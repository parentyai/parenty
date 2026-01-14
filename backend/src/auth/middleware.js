const { verifyIdToken } = require('./firebase');

function extractBearerToken(req) {
  const header = req.get('authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice('Bearer '.length).trim();
}

function buildAuthContext(decoded) {
  return {
    uid: decoded.uid || null,
    role: decoded.role || null,
    isAdmin: decoded.isAdmin === true,
    householdId: decoded.householdId || null,
    guardianId: decoded.guardianId || null
  };
}

function createAuthMiddleware(env) {
  async function requireAuth(req, res, next) {
    const token = extractBearerToken(req);
    if (!token) {
      return res.status(401).json({ ok: false, error: 'missing token' });
    }

    try {
      const decoded = await verifyIdToken(env, token);
      req.auth = buildAuthContext(decoded);
      return next();
    } catch (error) {
      return res.status(401).json({ ok: false, error: 'invalid token' });
    }
  }

  function requireRole(role) {
    return (req, res, next) => {
      if (!req.auth || req.auth.role !== role) {
        return res.status(403).json({ ok: false, error: 'forbidden' });
      }
      return next();
    };
  }

  function requireAdmin() {
    return (req, res, next) => {
      if (!req.auth || (!req.auth.isAdmin && req.auth.role !== 'admin')) {
        return res.status(403).json({ ok: false, error: 'forbidden' });
      }
      return next();
    };
  }

  return { requireAuth, requireRole, requireAdmin };
}

module.exports = { createAuthMiddleware };
