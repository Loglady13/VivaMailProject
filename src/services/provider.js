import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/credentials';


// Function to obtain the current authenticated user ID
export const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
};


// Function to check if an email already exists
export const checkIfEmailExists = async (email) => {
    const q = query(collection(db, 'Company'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};


// Function to delete an item from a specified collection
export const deleteItem = async (collectionName, itemId) => {
    try {
        const itemRef = doc(db, collectionName, itemId);
        await deleteDoc(itemRef);
        return true; // Return true on success
    } catch (error) {
        console.error("Error deleting document: ", error);
        return false; // Return false on failure
    }
};


// Function to get the information of the current user
export const getUserInfo = async () => {
    try {
        const userId = getCurrentUserId();

        if (!userId) {
            throw new Error('No user is currently authenticated');
        }

        const userDocRef = doc(db, 'User', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            throw new Error('No user data found');
        }
    } catch (error) {
        console.error('Error getting user info:', error);
        return null;
    }
};


/* ------------------------------------------------------------- ONLY FOR COMPANY -----------------------------------------------------*/
// Function to add a company
export const addCompany = async (companyData) => {
    const userId = getCurrentUserId(); // Get the ID of the authenticated user

    if (!userId) {
        throw new Error('No authenticated user found');
    }

    const currentDate = new Date();
    const companyRef = await addDoc(collection(db, 'Company'), {
        ...companyData,
        creationDate: currentDate,
        lastUpdate: currentDate,
        state: false,
        adminID: userId // The ID of the user who created the company
    });

    // Updates the user's array of company IDs
    const userRef = doc(db, 'User', userId);
    await updateDoc(userRef, {
        companyIDs: [...(await getUserCompanyIDs(userId)), companyRef.id]
    });
};


// Function to obtain the array of company IDs of a user.
const getUserCompanyIDs = async (userId) => {
    const userRef = doc(db, 'User', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().companyIDs || [] : [];
};


// Function to delete a company from the companys list of the user
export const removeCompanyFromUser = async (companyId) => {
    try {
        const userId = getCurrentUserId(); // Get the ID of the authenticated user

        if (!userId) {
            throw new Error('No authenticated user found');
        }

        const userRef = doc(db, 'User', userId);
        const companyIDs = await getUserCompanyIDs(userId);

        // Ensure that only the specified company ID is removed
        const updatedCompanyIDs = companyIDs.filter(id => id !== companyId);

        // Check if the companyId exists in the array before updating
        if (companyIDs.length === updatedCompanyIDs.length) {
            console.warn(`Company ID ${companyId} not found in user's companyIDs`);
            return false;
        }

        // Update the user's companyIDs array
        await updateDoc(userRef, { companyIDs: updatedCompanyIDs });

        return true; // Return true on success
    } catch (error) {
        console.error("Error updating user's companyIDs: ", error);
        return false; // Return false on failure
    }
};


/* --------------------------------------------------------------------------------------------------------------------------------------*/


