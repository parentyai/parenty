const COLLECTIONS = Object.freeze({
  UX: [
    'households',
    'guardians',
    'children',
    'consents',
    'subscriptions',
    'notifications',
    'notification_deliveries',
    'faq_logs',
    'scenario_states',
    'roadmaps'
  ],
  ADMIN: [
    'admin_users',
    'templates',
    'debug_line_users',
    'global_flags',
    'data_requests',
    'sources',
    'experience_sources',
    'experience_fragments',
    'experience_usage_logs',
    'review_sources',
    'review_fragments',
    'review_usage_logs',
    'reviews',
    'insight_reactions',
    'ops_configs',
    'audit_logs',
    'incident_records',
    'admin_views'
  ]
});

module.exports = { COLLECTIONS };
