const { runPolicy } = require('../policy');

const DEFAULT_ALLOW_REASON = 'INSIGHT_PRESENTED';
const DEFAULT_SUPPRESS_REASON = 'CONTEXT_DEDUPE_SUPPRESSED';

function isTextMessageEvent(event) {
  if (!event || event.type !== 'message') {
    return false;
  }
  return Boolean(event.message && event.message.type === 'text');
}

function buildLinePolicyInputs(event) {
  const replyable = isTextMessageEvent(event);
  const reasonCodes = replyable
    ? [DEFAULT_ALLOW_REASON]
    : [DEFAULT_SUPPRESS_REASON];

  return {
    'context/ops': {
      feature: 'faq',
      channel: 'line',
      reasonCodes
    }
  };
}

function evaluateLinePolicy(event, env) {
  const inputs = buildLinePolicyInputs(event);
  const decision = runPolicy(inputs, {
    reasonCodeIndexPath: env.POLICY_REASON_CODE_INDEX_PATH
  });
  return {
    decision,
    replyable: isTextMessageEvent(event)
  };
}

module.exports = { evaluateLinePolicy };
