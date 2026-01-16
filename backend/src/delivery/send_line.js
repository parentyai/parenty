const https = require('https');
const crypto = require('crypto');

function requireString(value, fieldName) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`[delivery] ${fieldName} is required`);
    error.code = 'DELIVERY_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function requireArray(value, fieldName) {
  if (!Array.isArray(value) || value.length === 0) {
    const error = new Error(`[delivery] ${fieldName} must be a non-empty array`);
    error.code = 'DELIVERY_INVALID_PAYLOAD';
    throw error;
  }
  return value;
}

function validateMessages(messages) {
  requireArray(messages, 'messages');
  messages.forEach((message, index) => {
    if (!message || typeof message !== 'object') {
      const error = new Error(`[delivery] messages[${index}] must be an object`);
      error.code = 'DELIVERY_INVALID_PAYLOAD';
      throw error;
    }
    requireString(message.type, `messages[${index}].type`);
  });
  return messages;
}

function sendLineRequest(path, body, accessToken) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'api.line.me',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      res.resume();
      if (res.statusCode && res.statusCode >= 400) {
        const error = new Error(`[line.send] status ${res.statusCode}`);
        return reject(error);
      }
      return resolve();
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function buildExecutionResult({ success, messageId, dedupeKey, traceId, latency }) {
  return {
    success,
    messageId: messageId || null,
    latency,
    dedupeKey,
    traceId
  };
}

async function sendLineReply({ replyToken, messages, accessToken, dedupeKey, traceId }) {
  requireString(accessToken, 'accessToken');
  requireString(replyToken, 'replyToken');
  validateMessages(messages);

  const start = Date.now();
  const resolvedTraceId = traceId && traceId.trim().length ? traceId : crypto.randomUUID();
  const resolvedDedupeKey = dedupeKey && dedupeKey.trim().length ? dedupeKey : replyToken;

  await sendLineRequest('/v2/bot/message/reply', { replyToken, messages }, accessToken);
  return buildExecutionResult({
    success: true,
    dedupeKey: resolvedDedupeKey,
    traceId: resolvedTraceId,
    latency: Date.now() - start
  });
}

async function sendLinePush({ to, messages, accessToken, dedupeKey, traceId }) {
  requireString(accessToken, 'accessToken');
  requireString(to, 'to');
  requireString(dedupeKey, 'dedupeKey');
  requireString(traceId, 'traceId');
  validateMessages(messages);

  const start = Date.now();
  await sendLineRequest('/v2/bot/message/push', { to, messages }, accessToken);
  return buildExecutionResult({
    success: true,
    dedupeKey,
    traceId,
    latency: Date.now() - start
  });
}

module.exports = { sendLineReply, sendLinePush };
