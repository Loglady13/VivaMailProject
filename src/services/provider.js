import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc, deleteDoc,setDoc, limit, startAfter, startAt, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/credentials';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
    const companyCount = await getUserCompanyCount(userId)

    const isFirstCompany = companyCount === 0;

    if (!userId) {
        throw new Error('No authenticated user found');
    }

    const currentDate = new Date();
    const companyRef = await addDoc(collection(db, 'Company'), {
        ...companyData,
        creationDate: currentDate,
        lastUpdate: currentDate,
        state: isFirstCompany ? true : false,
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

// Get the number of companies allowed in the user's plan
export const getNumberCompaniesAllowedByPlanForUser = async () => {
    const userId = getCurrentUserId();
    const userRef = doc(db, 'User', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error('User not found');
    }

    const planName = userDoc.data().plan;
    const q = query(collection(db, 'Plan'), where('namePlan', '==', planName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error('Plan not found');
    }

    const planDoc = querySnapshot.docs[0]; // Take the first document (it should be unique)

    return planDoc.data().numberCompany;
};


// Get the number of companies in the arrangement in the user document
export const getUserCompanyCount = async () => {
    const userId = getCurrentUserId();

    if (!userId) {
        throw new Error('No authenticated user found');
    }

    const userRef = doc(db, 'User', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error('User document not found');
    }

    const companyIDs = userDoc.data().companyIDs || [];
    return companyIDs.length;  // Returns directly the number of companies
    
};


export const updateCompanyState = async (companyId, newState) => {
    try {
        const companyRef = doc(db, 'Company', companyId);
        await updateDoc(companyRef, { state: newState });
    } catch (error) {
        console.error("Error updating company state:", error);
    }
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
// Function for obtain plans
export const fetchPlans = async () => {
    const plansRef = collection(db, "Plan");
    const plansSnapshot = await getDocs(plansRef);
    return plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function that verify the email
export const checkEmailExists = async (email, excludeId) => {
    const companiesRef = collection(db, "User");
    const q = query(companiesRef, where("emailAdmin", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.some(doc => doc.id !== excludeId);
};

// Function for update Admin info. 
export const updateAdmin = async (id, updatedData) => {
    const docRef = doc(db, "User", id);
    await updateDoc(docRef, { ...updatedData, lastUpdate: new Date() });
};

export const subscribeToPlans = (setPlans) => {
    const unsubscribe = onSnapshot(collection(db, 'Plan'), (snapshot) => {
        const updatedPlans = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setPlans(updatedPlans);
    });

    return unsubscribe;
};

export const checkIfEmailExists = async (email) => {
    const q = query(collection(db, 'User'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const createAdministrator = async (administrator) => {
    const {adminName, email, password, planAdmin} = administrator;
    // Create an user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // The credencials of the new user
    const currentDate = new Date(); // Capture the current date and time
    const role = 'Administrator'
    const companyIDs = []
    
    await setDoc(doc(db, 'User', user.uid), {
        role: role,
        companyIDs, 
        nameAdmin: adminName,
        email: email,
        creationDate: currentDate,
        lastUpdate: currentDate, // Both dates are current at the time of creation
        plan: planAdmin
    });
};

/* --------------------------------------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------------------ CLIENT MAIL -----------------------------------------------------------*/

export const checkIfClientEmailExists = async (emailClient) => {
    const q = query(collection(db, 'EmailClient'), where('emailClient', '==', emailClient));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const createClientMail = async (client) =>{
    const currentDate = new Date(); // Obtener la fecha y hora actuales.
                await addDoc(collection(db, 'EmailClient'), {
                    ...client, // Agregar los datos del cliente manual.
                    creationDate: currentDate, // Fecha de creación.
                    lastUpdate: currentDate, // Última fecha de actualización.
                    state: false, // Estado inicial del cliente.
                });
}


