import { getDB } from '../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, addDoc } from 'firebase/firestore';

// Storage type constants
export const STORAGE_TYPE = {
  LOCAL: 'local',
  CLOUD: 'cloud'
};

/**
 * Save a document to Firestore
 * @param {string} collectionName - Collection name
 * @param {string} [docId] - Optional document ID (if not provided, one will be generated)
 * @param {Object} data - Document data
 * @param {string} [storageType] - Storage type (local or cloud)
 * @returns {Promise<Object>} Result object with document ID if successful
 */
export const saveDocument = async (collectionName, docId, data, storageType = null) => {
  try {
    // Get the appropriate database
    const db = getDB(storageType);
    
    // Add timestamp
    const docData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    let docRef;
    
    // If docId is provided, use it
    if (docId) {
      docRef = doc(db, collectionName, docId);
      await setDoc(docRef, docData);
    } else {
      // Otherwise let Firestore generate an ID
      const colRef = collection(db, collectionName);
      docRef = await addDoc(colRef, docData);
    }
    
    return {
      success: true,
      docId: docRef.id || docId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get documents from a collection
 * @param {string} collectionName - Collection name
 * @param {string} [storageType] - Storage type (local or cloud)
 * @returns {Promise<Object>} Result object with documents array if successful
 */
export const getDocuments = async (collectionName, storageType = null) => {
  try {
    // Get the appropriate database
    const db = getDB(storageType);
    
    // Get the collection
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    // Map the documents
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      documents,
      count: documents.length
    };
  } catch (error) {
    return {
      success: false,
      documents: [],
      error: error.message
    };
  }
};

/**
 * Get a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {string} [storageType] - Storage type (local or cloud)
 * @returns {Promise<Object>} Result object with document data if successful
 */
export const getDocument = async (collectionName, docId, storageType = null) => {
  try {
    // Get the appropriate database
    const db = getDB(storageType);
    
    // Get the document
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        document: {
          id: docSnap.id,
          ...docSnap.data()
        }
      };
    } else {
      return {
        success: false,
        error: 'Document not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  saveDocument,
  getDocuments,
  getDocument,
  STORAGE_TYPE
}; 