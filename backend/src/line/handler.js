const { sanitizeLineEvents } = require('../logging/line_sanitizer');

function normalizeEvents(body) {
  const events = Array.isArray(body && body.events) ? body.events : [];
  return sanitizeLineEvents(events);
}

function logEvents(events) {
  const payload = {
    count: events.length,
    events: events.map(({ replyToken, ...rest }) => rest)
  };
  console.log('[line.webhook] events', JSON.stringify(payload));
}

module.exports = { normalizeEvents, logEvents };
