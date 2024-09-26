import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc, deleteDoc, limit, startAfter, startAt, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/credentials';



// Function to obtain the current authenticated user ID
export const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
};


// Function to check if an email already exists
export const checkIfEmailCompanyExists = async (email, currentCompanyId = null) => {
    const q = query(collection(db, 'Company'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    // If there are no results, the email is not in use
    if (querySnapshot.empty) return false;
    // If there are results, we need to check if the email belongs to another company
    for (const doc of querySnapshot.docs) {
        if (doc.id !== currentCompanyId) {
            // If the email is used by a different company, return true
            return true;
        }
    }
    // If no other companies are using the email, return false
    return false;
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


// Function to verify the role of the user based on their ID
export const verifyUserRole = async (userId) => {
    try {
        const userDocRef = doc(db, 'User', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data().role; // Return the role of the user
        } else {
            return null; // User document doesn't exist
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
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


// Function to update a company 
export const updateCompany = async (companyId, updatedData) => {
    try {
        const companyRef = doc(db, 'Company', companyId); // Get a reference to the company document
        await updateDoc(companyRef, updatedData); // Update the document with the new data
        return true; // Return true on success
    } catch (error) {
        console.error('Error updating company: ', error);
        return false; // Return false on failure
    }
};


// Fetches the total number of documents
export const fetchTotalDocumentsCompany = async (userId) => {
    const queryCollection = query(collection(db, 'Company'), where('adminID', '==', userId));
    const querySnapshot = await getDocs(queryCollection);
    return querySnapshot.size;
};

// Fetches documents with pagination and optional search
export const fetchCompanyData = async (userId, pageSize, searchTerm = '', lastVisible = null, firstVisiblePages = [], isNextPage = false, isPrevPage = false) => {
    let queryC;
    const queryCollection = query(collection(db, 'Company'), where('adminID', '==', userId));

    if (searchTerm.trim() !== '') {
        const isEmail = searchTerm.includes('@');
        if (isEmail) {
            queryC = query(queryCollection,
                where('email', '>=', searchTerm),
                where('email', '<=', searchTerm + '\uf8ff'),
                limit(pageSize));
        } else {
            queryC = query(queryCollection,
                where('companyName', '>=', searchTerm),
                where('companyName', '<=', searchTerm + '\uf8ff'),
                limit(pageSize));
        }
    } else if (isNextPage && lastVisible) {
        queryC = query(queryCollection, startAfter(lastVisible), limit(pageSize));
    } else if (isPrevPage && firstVisiblePages.length > 1) {
        queryC = query(queryCollection, startAt(firstVisiblePages[firstVisiblePages.length - 2]), limit(pageSize));
    } else {
        queryC = query(queryCollection, limit(pageSize));
    }

    const querySnapshot = await getDocs(queryC);
    const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().companyName,
        email: doc.data().email,
        legalID: doc.data().legalID,
        state: doc.data().state,
        creationDate: doc.data().creationDate,
        lastUpdate: doc.data().lastUpdate,
    }));

    return {
        documents,
        firstVisible: querySnapshot.docs[0],
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
        totalDocuments: querySnapshot.size
    };
};


/* --------------------------------------------------------------------------------------------------------------------------------------*/

/* ------------------------------------------------------- TABLE COMPONENT   ------------------------------------------------------------*/

// Function to know collection size. 
export const fetchTotalDocuments = async (collectionName) => {
    const queryCollection = collection(db, collectionName);
    const querySnapshot = await getDocs(queryCollection);
    return querySnapshot.size;
};

// Fetch data (includes pagination and search)
export const fetchData = async ({ collectionName, searchTerm = '', columnsToShow, lastVisible, isNextPage = false, isPrevPage = false, firstVisiblePages = [], pageSize = 5 }) => {
    const queryCollection = collection(db, collectionName);
    let queryC;

    if ( collectionName === 'User'){
        const queryUser = query(queryCollection, where('role', '==', 'Administrator'));
        if (searchTerm) {
            const regex = /^[a-zA-Z0-9._%+-]+@$/;
            if (regex.test(searchTerm)) {
                queryC = query(queryUser,
                    where(columnsToShow[1], '>=', searchTerm),
                    where(columnsToShow[1], '<=', searchTerm + '\uf8ff'), limit(pageSize));
            } else {
                queryC = query(queryUser,
                    where(columnsToShow[0], '>=', searchTerm),
                    where(columnsToShow[0], '<=', searchTerm + '\uf8ff'), limit(pageSize));
            }
        } else if (isNextPage && lastVisible) {
            queryC = query(queryUser, startAfter(lastVisible), limit(pageSize));
        } else if (isPrevPage && firstVisiblePages.length > 1) {
            queryC = query(queryUser, startAt(firstVisiblePages[firstVisiblePages.length - 2]), limit(pageSize));
        } else {
            queryC = query(queryUser, limit(pageSize));
        }
    } else {
        if (searchTerm) {
            const regex = /^[a-zA-Z0-9._%+-]+@$/;
            if (regex.test(searchTerm)) {
                queryC = query(queryCollection,
                    where(columnsToShow[1], '>=', searchTerm),
                    where(columnsToShow[1], '<=', searchTerm + '\uf8ff'), limit(pageSize));
            } else {
                queryC = query(queryCollection,
                    where(columnsToShow[0], '>=', searchTerm),
                    where(columnsToShow[0], '<=', searchTerm + '\uf8ff'), limit(pageSize));
            }
        } else if (isNextPage && lastVisible) {
            queryC = query(queryCollection, startAfter(lastVisible), limit(pageSize));
        } else if (isPrevPage && firstVisiblePages.length > 1) {
            queryC = query(queryCollection, startAt(firstVisiblePages[firstVisiblePages.length - 2]), limit(pageSize));
        } else {
            queryC = query(queryCollection, limit(pageSize));
        }
    }
    const querySnapshot = await getDocs(queryC);
    const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
        documents,
        lastVisible: lastVisibleDoc,
        firstVisible: querySnapshot.docs[0]
    };
};

// Function for 
export const subscribeToCollection = (collectionName, setData, loadData) => {
    const queryCollection = collection(db, collectionName);
    const unsubscribe = onSnapshot(queryCollection, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setData(documents);
    });
    loadData();  // Fetches data when component mounts or when collectionName or pageSize changes
    return () => unsubscribe(); 
};

/* --------------------------------------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------------------ ADMINISTRATOR -----------------------------------------------------------*/
async function deleteAdminAuthentication(uid) {
    try {
      await admin.auth().deleteUser(uid);
      console.log(`Usuario con UID: ${uid} eliminado de Firebase Authentication`);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  }
