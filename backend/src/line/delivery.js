const crypto = require('crypto');
const { sendLineReply, sendLinePush } = require('../delivery/send_line');
const { createNotificationDeliveryStore } = require('../firestore/notification_deliveries');
const { createRepository } = require('../firestore/repository');
const { runPolicy } = require('../policy');

const DEFAULT_DENY_TEMPLATE_ID = 'tpl_deny_unknown_reason';
const DEFAULT_DEGRADED_TEMPLATE_ID = 'tpl_deg_provider_outage';

function requireString(value, fieldName) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`[line.delivery] ${fieldName} is required`);
    error.code = 'LINE_DELIVERY_INVALID';
    throw error;
  }
  return value;
}

function resolveHouseholdId(event) {
  if (!event || !event.source || typeof event.source !== 'object') {
    return 'unknown';
  }
  return event.source.userId
    || event.source.groupId
    || event.source.roomId
    || 'unknown';
}

async function resolveTemplateBody(repo, templateId) {
  if (!templateId) {
    return null;
  }
  const record = await repo.getDocData('templates', templateId);
  if (!record || !record.data) {
    return null;
  }
  if (record.data.status !== 'active') {
    return null;
  }
  const body = record.data.body;
  if (!body || typeof body !== 'string') {
    return null;
  }
  return body;
}

async function resolveMessageText({ decision, repo, contentId }) {
  if (!decision) {
    const error = new Error('[line.delivery] policyDecision is required');
    error.code = 'LINE_DELIVERY_INVALID';
    throw error;
  }

  if (decision.result === 'ALLOW') {
    const body = await resolveTemplateBody(repo, contentId);
    if (body) {
      return { text: body, templateId: contentId, contentId };
    }
    const error = new Error('[line.delivery] template body is required for ALLOW');
    error.code = 'LINE_TEMPLATE_MISSING';
    throw error;
  }

  const primaryTemplateId = decision.templateId || null;
  const body = await resolveTemplateBody(repo, primaryTemplateId);
  if (body) {
    return { text: body, templateId: primaryTemplateId, contentId: primaryTemplateId };
  }

  const fallbackTemplateId = decision.result === 'DENY'
    ? DEFAULT_DENY_TEMPLATE_ID
    : DEFAULT_DEGRADED_TEMPLATE_ID;
  if (fallbackTemplateId && fallbackTemplateId !== primaryTemplateId) {
    const fallbackBody = await resolveTemplateBody(repo, fallbackTemplateId);
    if (fallbackBody) {
      return {
        text: fallbackBody,
        templateId: fallbackTemplateId,
        contentId: fallbackTemplateId
      };
    }
  }

  const error = new Error('[line.delivery] template body is required');
  error.code = 'LINE_TEMPLATE_MISSING';
  throw error;
}

function buildDedupeKey(contentId, targetId) {
  return crypto.createHash('sha256').update(`${contentId}:${targetId}`).digest('hex');
}

async function sendLineReplyWithPolicy({
  event,
  policyDecision,
  env,
  firestore
}) {
  if (!event || !event.replyToken) {
    const error = new Error('[line.delivery] replyToken is required');
    error.code = 'LINE_DELIVERY_INVALID';
    throw error;
  }

  const decision = policyDecision || runPolicy({}, {
    reasonCodeIndexPath: env.POLICY_REASON_CODE_INDEX_PATH
  });

  const repo = createRepository(firestore);
  const baseContentId = decision.result === 'ALLOW'
    ? env.LINE_REPLY_CONTENT_ID || null
    : decision.templateId || null;
  requireString(baseContentId, 'contentId');

  const { text, templateId, contentId } = await resolveMessageText({
    decision,
    repo,
    contentId: baseContentId
  });

  const traceId = decision.policyTrace && decision.policyTrace.traceId
    ? decision.policyTrace.traceId
    : crypto.randomUUID();
  const message = {
    type: 'text',
    text
  };
  const store = createNotificationDeliveryStore(firestore);
  const now = new Date();
  let result;
  try {
    result = await sendLineReply({
      replyToken: event.replyToken,
      messages: [message],
      accessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
      dedupeKey: event.replyToken,
      traceId
    });
  } catch (error) {
    await store.createNotificationDelivery({
      householdId: resolveHouseholdId(event),
      notificationId: event.replyToken,
      dedupeKey: event.replyToken,
      status: 'failed',
      policyDecision: decision,
      sentAt: now,
      trace: {
        runId: traceId
      },
      contentId,
      templateId,
      channel: 'LINE',
      mode: 'reply',
      sendOutcome: {
        success: false,
        error: error.message
      }
    });
    throw error;
  }

  await store.createNotificationDelivery({
    householdId: resolveHouseholdId(event),
    notificationId: event.replyToken,
    dedupeKey: result.dedupeKey,
    status: 'sent',
    policyDecision: decision,
    sentAt: now,
    trace: {
      runId: traceId
    },
    contentId,
    templateId,
    channel: 'LINE',
    mode: 'reply',
    sendOutcome: {
      success: true,
      messageId: result.messageId,
      latency: result.latency
    }
  });

  return result;
}

async function sendLinePushWithPolicy({
  targetId,
  contentId,
  templateIdOverride,
  policyDecision,
  env,
  firestore
}) {
  requireString(targetId, 'targetId');
  requireString(contentId, 'contentId');

  const decision = policyDecision || runPolicy({}, {
    reasonCodeIndexPath: env.POLICY_REASON_CODE_INDEX_PATH
  });

  const repo = createRepository(firestore);
  const baseContentId = decision.result === 'ALLOW'
    ? (templateIdOverride || contentId)
    : decision.templateId || null;
  requireString(baseContentId, 'contentId');

  const { text, templateId, contentId: resolvedContentId } = await resolveMessageText({
    decision,
    repo,
    contentId: baseContentId
  });

  const traceId = decision.policyTrace && decision.policyTrace.traceId
    ? decision.policyTrace.traceId
    : crypto.randomUUID();
  const dedupeKey = buildDedupeKey(resolvedContentId, targetId);
  const message = {
    type: 'text',
    text
  };
  const store = createNotificationDeliveryStore(firestore);
  const now = new Date();
  let result;
  try {
    result = await sendLinePush({
      to: targetId,
      messages: [message],
      accessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
      dedupeKey,
      traceId
    });
  } catch (error) {
    await store.createNotificationDelivery({
      householdId: targetId,
      notificationId: dedupeKey,
      dedupeKey,
      status: 'failed',
      policyDecision: decision,
      sentAt: now,
      trace: {
        runId: traceId
      },
      contentId,
      templateId,
      channel: 'LINE',
      mode: 'push',
      sendOutcome: {
        success: false,
        error: error.message
      }
    });
    throw error;
  }

  await store.createNotificationDelivery({
    householdId: targetId,
    notificationId: dedupeKey,
    dedupeKey: result.dedupeKey || dedupeKey,
    status: 'sent',
    policyDecision: decision,
    sentAt: now,
    trace: {
      runId: traceId
    },
    contentId,
    templateId,
    channel: 'LINE',
    mode: 'push',
    sendOutcome: {
      success: true,
      messageId: result.messageId,
      latency: result.latency
    }
  });

  return result;
}

module.exports = { sendLineReplyWithPolicy, sendLinePushWithPolicy };
