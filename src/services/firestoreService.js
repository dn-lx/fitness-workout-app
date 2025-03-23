import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, query, where } from 'firebase/firestore';

// Constants for storage locations
export const STORAGE_TYPE = {
  LOCAL: 'local',
  CLOUD: 'cloud'
};

/**
 * Save data to either local emulator or cloud Firestore
 * @param {string} collectionName - The collection to save to
 * @param {Object} data - The data to save
 * @param {string} storageType - Either STORAGE_TYPE.LOCAL or STORAGE_TYPE.CLOUD
 * @returns {Promise<string>} Document ID of the saved document
 */
export const saveData = async (collectionName, data, storageType = STORAGE_TYPE.CLOUD) => {
  try {
    // Always include a timestamp
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date(),
      storageType: storageType
    };
    
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, dataWithTimestamp);
    console.log(`Document saved to ${storageType} with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving document to ${storageType}:`, error);
    throw error;
  }
};

/**
 * Retrieve data from Firestore
 * @param {string} collectionName - The collection to read from
 * @param {string} storageType - Retrieve only LOCAL or CLOUD data, or null for all data
 * @returns {Promise<Array>} Array of documents
 */
export const getData = async (collectionName, storageType = null) => {
  try {
    const collectionRef = collection(db, collectionName);
    
    let q = collectionRef;
    if (storageType) {
      // Filter by storage type if specified
      q = query(collectionRef, where("storageType", "==", storageType));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Retrieved ${documents.length} documents${storageType ? ` from ${storageType}` : ''}`);
    return documents;
  } catch (error) {
    console.error(`Error getting documents:`, error);
    throw error;
  }
};

/**
 * Get a single document by ID
 * @param {string} collectionName - The collection to read from
 * @param {string} documentId - The document ID
 * @returns {Promise<Object|null>} Document data or null if not found
 */
export const getDocumentById = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}; 