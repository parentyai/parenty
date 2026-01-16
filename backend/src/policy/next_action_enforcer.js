function enforceNextActionConstraints(nextAction, context = {}) {
  if (!nextAction || typeof nextAction !== 'object') {
    return nextAction;
  }
  const constraints = nextAction.constraints || {};
  if (constraints.requiresRole && Array.isArray(constraints.requiresRole)) {
    const roles = Array.isArray(context.roles)
      ? context.roles
      : context.role
        ? [context.role]
        : [];
    const hasRole = constraints.requiresRole.length === 0
      ? true
      : constraints.requiresRole.some((role) => roles.includes(role));
    if (!hasRole) {
      const error = new Error('[policy] nextAction requires role');
      error.code = 'NEXT_ACTION_FORBIDDEN';
      throw error;
    }
  }
  if (constraints.requiresReason === true && context.hasReason !== true) {
    const error = new Error('[policy] nextAction requires reason');
    error.code = 'NEXT_ACTION_FORBIDDEN';
    throw error;
  }
  if (constraints.auditRequired === true && context.auditLogged !== true) {
    const error = new Error('[policy] nextAction requires audit');
    error.code = 'NEXT_ACTION_FORBIDDEN';
    throw error;
  }
  return nextAction;
}

module.exports = { enforceNextActionConstraints };
