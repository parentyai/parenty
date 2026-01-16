const { createRepository } = require('./repository');
const { maskText, requireText } = require('../logging/text_masker');
const { assertNoRawText } = require('../logging/pii_guard');

function sanitizeFaqLog(payload) {
  if (!payload || typeof payload !== 'object') {
    const error = new Error('[faq_logs] payload is required');
    error.code = 'FAQ_LOG_INVALID_PAYLOAD';
    throw error;
  }

  assertNoRawText(payload, 'faq_logs');

  const sanitized = { ...payload };
  sanitized.question = maskText(requireText(payload.question, 'question'));
  sanitized.answer = maskText(requireText(payload.answer, 'answer'));

  return sanitized;
}

function createFaqLogStore(db) {
  const repo = createRepository(db);

  async function createFaqLog(payload) {
    return repo.addDoc('faq_logs', sanitizeFaqLog(payload));
  }

  async function getFaqLog(logId) {
    return repo.getDocData('faq_logs', logId);
  }

  return {
    createFaqLog,
    getFaqLog,
    sanitizeFaqLog
  };
}

module.exports = { createFaqLogStore, sanitizeFaqLog };
