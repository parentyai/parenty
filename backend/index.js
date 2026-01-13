const express = require('express');
const { loadEnv } = require('./src/config/env');
const { verifySignature } = require('./src/line/verifySignature');
const { normalizeEvents, logEvents } = require('./src/line/handler');
const { replyToLine } = require('./src/line/reply');

const env = loadEnv();

const app = express();

const rawBodySaver = (req, res, buf) => {
  req.rawBody = buf;
};

app.use(express.json({ verify: rawBodySaver }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    envName: env.ENV_NAME,
    ts: new Date().toISOString(),
    baseUrl: env.PUBLIC_BASE_URL
  });
});

app.post('/line/webhook', (req, res) => {
  const signature = req.get('x-line-signature') || '';
  const rawBody = req.rawBody || Buffer.from('');

  if (!verifySignature(rawBody, signature, env.LINE_CHANNEL_SECRET)) {
    return res.status(401).json({ ok: false, error: 'invalid signature' });
  }

  const events = normalizeEvents(req.body);
  replyToLine(events, env.LINE_CHANNEL_ACCESS_TOKEN).catch((error) => {
    console.error('[line.reply] error', { message: error.message });
  });
  logEvents(events);

  return res.status(200).json({ ok: true, count: events.length });
});

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
