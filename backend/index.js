const express = require('express');
const { loadEnv } = require('./src/config/env');
const { verifySignature } = require('./src/line/verifySignature');
const { normalizeEvents, logEvents } = require('./src/line/handler');
const { captureLineUserIdOnce } = require('./src/line/capture_userid');
const { sendLineReplyWithPolicy } = require('./src/line/delivery');
const { evaluateLinePolicy } = require('./src/line/policy');
const { runPolicy } = require('./src/policy');
const { getFirestoreStatus } = require('./src/firestore/preflight');
const { createFirestoreClient } = require('./src/firestore');
const { createAuthMiddleware } = require('./src/auth/middleware');
const { createAdminRouter } = require('./src/admin/router');

const env = loadEnv();
let firestore = null;
try {
  firestore = createFirestoreClient(env);
} catch (error) {
  console.error('[firestore] unavailable', { message: error.message });
}

const app = express();

const rawBodySaver = (req, res, buf) => {
  req.rawBody = buf;
};

app.use(express.json({ verify: rawBodySaver }));

app.get('/health', (req, res) => {
  const firestore = getFirestoreStatus(env);
  res.status(200).json({
    status: 'ok',
    envName: env.ENV_NAME,
    ts: new Date().toISOString(),
    baseUrl: env.PUBLIC_BASE_URL,
    firestore
  });
});

app.post('/line/webhook', async (req, res) => {
  const signature = req.get('x-line-signature') || '';
  const rawBody = req.rawBody || Buffer.from('');

  if (!verifySignature(rawBody, signature, env.LINE_CHANNEL_SECRET)) {
    return res.status(401).json({ ok: false, error: 'invalid signature' });
  }

  if (!firestore) {
    console.error('[line.webhook] firestore not configured');
    return res.status(503).json({ ok: false, error: 'firestore not configured' });
  }

  try {
    await captureLineUserIdOnce({
      env,
      firestore,
      events: req.body && req.body.events
    });
  } catch (error) {
    console.error('[line.capture] error', { message: error.message });
  }

  const events = normalizeEvents(req.body);
  const replyTasks = [];

  const isReplyableEvent = (event) => Boolean(
    event
    && event.type === 'message'
    && event.message
    && event.message.type === 'text'
    && event.replyToken
  );

  events.forEach((event) => {
    const replyable = isReplyableEvent(event);
    try {
      const { decision } = evaluateLinePolicy(event, env);
      if (decision) {
        console.log('[policy.line]', {
          result: decision.result,
          primaryReason: decision.primaryReason,
          reasonCodes: decision.reasonCodes,
          traceId: decision.policyTrace && decision.policyTrace.traceId
        });
      }
      if (replyable && decision) {
        replyTasks.push(sendLineReplyWithPolicy({
          event,
          policyDecision: decision,
          env,
          firestore
        }));
      }
    } catch (error) {
      console.error('[policy.line] error', { message: error.message });
      if (replyable) {
        try {
          const decision = runPolicy({}, {
            reasonCodeIndexPath: env.POLICY_REASON_CODE_INDEX_PATH
          });
          replyTasks.push(sendLineReplyWithPolicy({
            event,
            policyDecision: decision,
            env,
            firestore
          }));
        } catch (fallbackError) {
          console.error('[policy.line] fallback error', { message: fallbackError.message });
        }
      }
    }
  });

  if (replyTasks.length) {
    try {
      const results = await Promise.allSettled(replyTasks);
      const failed = results.filter((result) => result.status === 'rejected');
      if (failed.length) {
        console.error('[line.reply] failures', { count: failed.length });
      }
    } catch (error) {
      console.error('[line.reply] error', { message: error.message });
    }
  }
  logEvents(events);

  return res.status(200).json({ ok: true, count: events.length });
});

const { requireAuth, requireAdmin } = createAuthMiddleware(env);
const PUBLIC_PATHS = new Set(['/health', '/line/webhook']);

app.use((req, res, next) => {
  if (PUBLIC_PATHS.has(req.path)) {
    return next();
  }
  return requireAuth(req, res, next);
});

const adminRouter = createAdminRouter({ env, requireAdmin });
app.use('/admin/v1', adminRouter);

app.use((err, req, res, next) => {
  console.error('[request.error]', { message: err.message });
  res.status(400).json({ ok: false, error: 'invalid request' });
});

const port = Number(env.PORT);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error('[ENV] PORT must be a valid number');
}

app.listen(port, () => {
  console.log(`[server] listening on ${port} env=${env.ENV_NAME}`);
});
