const { collectionRef, docRef } = require('./refs');

function createRepository(db) {
  function collection(name) {
    return collectionRef(db, name);
  }

  function doc(name, docId) {
    return docRef(db, name, docId);
  }

  async function getDoc(name, docId) {
    return docRef(db, name, docId).get();
  }

  async function getDocData(name, docId) {
    const snapshot = await getDoc(name, docId);
    if (!snapshot.exists) {
      return null;
    }
    return { id: snapshot.id, data: snapshot.data() };
  }

  async function setDoc(name, docId, data, options = {}) {
    return docRef(db, name, docId).set(data, options);
  }

  async function updateDoc(name, docId, data) {
    return docRef(db, name, docId).update(data);
  }

  async function addDoc(name, data) {
    return collectionRef(db, name).add(data);
  }

  async function deleteDoc(name, docId) {
    return docRef(db, name, docId).delete();
  }

  return {
    collection,
    doc,
    getDoc,
    getDocData,
    setDoc,
    updateDoc,
    addDoc,
    deleteDoc
  };
}

module.exports = { createRepository };
