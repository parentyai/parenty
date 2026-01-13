const crypto = require('crypto');

function safeEqual(a, b) {
  const aBuf = Buffer.from(a || '', 'utf8');
  const bBuf = Buffer.from(b || '', 'utf8');
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function verifySignature(rawBody, signature, channelSecret) {
  if (!signature || !channelSecret) {
    return false;
  }

  const body = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(String(rawBody || ''), 'utf8');

  const digest = crypto
    .createHmac('sha256', channelSecret)
    .update(body)
    .digest('base64');

  return safeEqual(digest, signature);
}

module.exports = { verifySignature };
