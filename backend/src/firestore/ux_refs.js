const { collectionRef, docRef } = require('./refs');

function householdsCollection(db) {
  return collectionRef(db, 'households');
}

function householdDoc(db, householdId) {
  return docRef(db, 'households', householdId);
}

function guardiansCollection(db) {
  return collectionRef(db, 'guardians');
}

function guardianDoc(db, guardianId) {
  return docRef(db, 'guardians', guardianId);
}

function childrenCollection(db) {
  return collectionRef(db, 'children');
}

function childDoc(db, childId) {
  return docRef(db, 'children', childId);
}

function consentsCollection(db) {
  return collectionRef(db, 'consents');
}

function consentDoc(db, consentId) {
  return docRef(db, 'consents', consentId);
}

function subscriptionsCollection(db) {
  return collectionRef(db, 'subscriptions');
}

function subscriptionDoc(db, subscriptionId) {
  return docRef(db, 'subscriptions', subscriptionId);
}

function notificationsCollection(db) {
  return collectionRef(db, 'notifications');
}

function notificationDoc(db, notificationId) {
  return docRef(db, 'notifications', notificationId);
}

function notificationDeliveriesCollection(db) {
  return collectionRef(db, 'notification_deliveries');
}

function notificationDeliveryDoc(db, deliveryId) {
  return docRef(db, 'notification_deliveries', deliveryId);
}

function faqLogsCollection(db) {
  return collectionRef(db, 'faq_logs');
}

function faqLogDoc(db, logId) {
  return docRef(db, 'faq_logs', logId);
}

function scenarioStatesCollection(db) {
  return collectionRef(db, 'scenario_states');
}

function scenarioStateDoc(db, stateId) {
  return docRef(db, 'scenario_states', stateId);
}

function roadmapsCollection(db) {
  return collectionRef(db, 'roadmaps');
}

function roadmapDoc(db, roadmapId) {
  return docRef(db, 'roadmaps', roadmapId);
}

module.exports = {
  householdsCollection,
  householdDoc,
  guardiansCollection,
  guardianDoc,
  childrenCollection,
  childDoc,
  consentsCollection,
  consentDoc,
  subscriptionsCollection,
  subscriptionDoc,
  notificationsCollection,
  notificationDoc,
  notificationDeliveriesCollection,
  notificationDeliveryDoc,
  faqLogsCollection,
  faqLogDoc,
  scenarioStatesCollection,
  scenarioStateDoc,
  roadmapsCollection,
  roadmapDoc
};
