const { sendLineReply } = require('../delivery/send_line');

function buildReplyMessage(event, replyText) {
  if (!event || event.type !== 'message') {
    return null;
  }
  if (!event.message || event.message.type !== 'text') {
    return null;
  }
  return {
    type: 'text',
    text: replyText
  };
}

async function replyToLine(events, accessToken, replyText) {
  if (!accessToken) {
    console.error('[line.reply] missing access token');
    return;
  }

  const text = replyText && replyText.trim() ? replyText.trim() : 'OK';
  const tasks = [];

  for (const event of events) {
    if (!event || !event.replyToken) {
      continue;
    }
    const message = buildReplyMessage(event, text);
    if (!message) {
      continue;
    }
    tasks.push(sendLineReply({
      replyToken: event.replyToken,
      messages: [message],
      accessToken
    }));
  }

  if (!tasks.length) {
    return;
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((result) => result.status === 'rejected');
  if (failed.length) {
    console.error('[line.reply] failures', { count: failed.length });
  }
}

module.exports = { replyToLine };
