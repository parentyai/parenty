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

function sanitizeMessage(message) {
  if (!message || typeof message !== 'object') {
    return null;
  }
  const type = message.type || 'unknown';
  return {
    type,
    textLength: type === 'text' ? String(message.text || '').length : undefined
  };
}

function sanitizeLineEvent(event) {
  if (!event || typeof event !== 'object') {
    return {
      type: 'unknown',
      timestamp: null,
      source: null,
      message: null,
      replyToken: null
    };
  }

  return {
    type: event.type || 'unknown',
    timestamp: event.timestamp || null,
    source: event.source ? sanitizeSource(event.source) : null,
    message: sanitizeMessage(event.message),
    replyToken: event.replyToken || null
  };
}

function sanitizeLineEvents(events) {
  return events.map((event) => sanitizeLineEvent(event));
}

module.exports = { sanitizeLineEvents };
