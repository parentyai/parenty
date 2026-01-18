async function replyToLine(events, accessToken, replyText, options = {}) {
  const error = new Error(
    '[line.reply] deprecated: use sendLineReplyWithPolicy in src/line/delivery.js'
  );
  error.code = 'LINE_REPLY_DEPRECATED';
  throw error;
}

module.exports = { replyToLine };
