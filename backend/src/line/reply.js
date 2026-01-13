const https = require('https');

function buildReplyMessage(event) {
  if (!event || event.type !== 'message') {
    return null;
  }
  if (!event.message || event.message.type !== 'text') {
    return null;
  }
  return {
    type: 'text',
    text: 'OK'
  };
}

function sendReply(replyToken, messages, accessToken) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ replyToken, messages });
    const options = {
      hostname: 'api.line.me',
      path: '/v2/bot/message/reply',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      res.resume();
      if (res.statusCode && res.statusCode >= 400) {
        const error = new Error(`[line.reply] status ${res.statusCode}`);
        return reject(error);
      }
      return resolve();
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function replyToLine(events, accessToken) {
  if (!accessToken) {
    console.error('[line.reply] missing access token');
    return;
  }

  const tasks = [];

  for (const event of events) {
    if (!event || !event.replyToken) {
      continue;
    }
    const message = buildReplyMessage(event);
    if (!message) {
      continue;
    }
    tasks.push(sendReply(event.replyToken, [message], accessToken));
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
