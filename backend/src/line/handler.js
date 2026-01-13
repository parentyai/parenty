function normalizeEvents(body) {
  const events = Array.isArray(body && body.events) ? body.events : [];

  return events.map((event) => {
    const message = event && event.message ? event.message : null;
    const normalizedMessage = message
      ? {
          type: message.type || 'unknown',
          text: message.type === 'text' ? message.text || '' : undefined
        }
      : null;

    return {
      type: event && event.type ? event.type : 'unknown',
      timestamp: event && event.timestamp ? event.timestamp : null,
      source: event && event.source ? event.source : null,
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
