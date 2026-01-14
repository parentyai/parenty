const crypto = require('crypto');

function hashValue(value) {
  if (!value) {
    return null;
  }
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function sanitizeSource(source) {
  if (!source || typeof source !== 'object') {
    return source;
  }
  const sanitized = { ...source };
  if (sanitized.userId) {
    sanitized.userId = hashValue(sanitized.userId);
  }
  if (sanitized.groupId) {
    sanitized.groupId = hashValue(sanitized.groupId);
  }
  if (sanitized.roomId) {
    sanitized.roomId = hashValue(sanitized.roomId);
  }
  return sanitized;
}

function normalizeEvents(body) {
  const events = Array.isArray(body && body.events) ? body.events : [];

  return events.map((event) => {
    const message = event && event.message ? event.message : null;
    const normalizedMessage = message
      ? {
          type: message.type || 'unknown',
          textLength: message.type === 'text' ? String(message.text || '').length : undefined
        }
      : null;

    return {
      type: event && event.type ? event.type : 'unknown',
      timestamp: event && event.timestamp ? event.timestamp : null,
      source: event && event.source ? sanitizeSource(event.source) : null,
      message: normalizedMessage,
      replyToken: event && event.replyToken ? event.replyToken : null
    };
  });
}

function logEvents(events) {
  const payload = {
    count: events.length,
    events: events.map(({ replyToken, ...rest }) => rest)
  };
  console.log('[line.webhook] events', JSON.stringify(payload));
}

module.exports = { normalizeEvents, logEvents };
