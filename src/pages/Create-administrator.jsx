import React, { useState, useEffect } from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import '../Styles/Create-administrator.css';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, query, where, onSnapshot, setDoc  } from 'firebase/firestore';
import { db } from '../services/credentials';
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const CreateAdministrator=()=>{

    /* To redirect to the home page from the cancel button */
    const navigate = useNavigate();
    const auth = getAuth(); // Obtener instancia de Firebase Auth

    /* To set inputs as empty after a creation */
    const defaultEntry = {
        adminName: '',
        email: '', 
        password: '',
        planAdmin: ''
    };

    const [admin, setAdmin] = useState(defaultEntry);
    const [errors, setErrors] = useState({adminName : '', password:'', email:'', planAdmin:''});
    const [isSuccess, setIsSuccess] = useState(false); 
    const [plans, setPlans] = useState([]); // Status for save plans

    useEffect(() => {
        // Escuchar en tiempo real los cambios en la colección de planes
        const unsubscribe = onSnapshot(collection(db, 'Plan'), (snapshot) => {
            const updatedPlans = snapshot.docs.map(doc => ({
                id: doc.id, 
                ...doc.data()
            }));
            setPlans(updatedPlans);
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, []);


    const captureInputs = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
        setErrors({...errors, [name]: ''})
    };

    /* To check there's no company with this mail already */
    const checkIfEmailExists = async (email) => {
        const q = query(collection(db, 'Administrator'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const validateInputs = () => { 
        const newErrors = { nameAdmin: '', password: '', email: '', planAdmin: '' }; 
        let isValid = true;

        /* Verify the field is not empty */
        if (!admin.adminName) {
            newErrors.adminName = 'Administrator name is required.';
            isValid = false;
        }
        /* Verify the field is not empty and validate that the password has more than 8 numeric digits */
        if (!admin.password) {
            newErrors.password = 'Password is required.';
            isValid = false;
        } else if (admin.password.length < 8) { 
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }
        /* Verify the field is not empty and validate basic email formatting (must includ @ y .example) */
        if (!admin.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
            newErrors.email = 'Please enter a valid email format including @ and .example.';
            isValid = false;
        }
        if (!admin.planAdmin) {
            newErrors.planAdmin = 'Plan is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                showCloseButton: true,
                html: 'The adminitrator has been successfully created',
            }).then(() => setIsSuccess(false)); // Resetting the status after displaying the alert
        }
    }, [isSuccess]);

    const saveAdministrator = async (e) => {
        e.preventDefault();

        /* Does the verification of the inputs */
        if (!validateInputs()) {
            return;
        }

        /* Does the verification of the email */
        const emailExists = await checkIfEmailExists(admin.email);
        if (emailExists) {
            setErrors({...errors, email: 'An administrator with this email already exists.'});
            return;
        }

        /* Saves Administrator */
        try {
            // Create an user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
            const user = userCredential.user; // The credencials of the new user
            const currentDate = new Date(); // Capture the current date and time
            const role = 'Administrator'
            const companyIDs = []
            const {adminName, email, planAdmin} = admin;

            await setDoc(doc(db, 'User', user.uid), {
                role: role,
                companyIDs, 
                nameAdmin: adminName,
                email: email,
                creationDate: currentDate,
                lastUpdate: currentDate, // Both dates are current at the time of creation
                plan: planAdmin
            });
            setErrors({ adminName:'', email:'', password:'', planAdmin: ''});
            setAdmin(defaultEntry);
            setIsSuccess(true); // Activate success alert
        } catch (error) {
            console.log(error);
            setErrors({...errors, global: 'An error occurred while saving an administrator'})
        }
    };

    return(
        <div className='NewAdmin'>
            <SidebarMaster />
            <div className="container-md" style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '50px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="fs-2 text-white" style={{ textAlign: 'left' }}>New Administrator</p>
                </div>
                <form onSubmit={saveAdministrator} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="adminName" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the administrator name</label>
                        <input onChange={captureInputs} value={admin.adminName} type="text" name='adminName' className="form-control" style={{ width: '100%' }}/>
                        {errors.adminName && <div className='text-danger'>{errors.adminName}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="email" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Email address</label>
                        <input onChange={captureInputs} value={admin.email} type="text" name='email' className="form-control" style={{ width: '100%' }}/>
                        {errors.email && <div className='text-danger'>{errors.email}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="password" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Password</label>
                        <input onChange={captureInputs} value={admin.password} type="text" name='password' className="form-control" aria-describedby="emailHelp" style={{ width: '100%' }}/>
                        {errors.password && <div className='text-danger'>{errors.password}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="planAdmin" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Select a plan</label>
                        <select onChange={captureInputs} value={admin.planAdmin} name='planAdmin' className="form-select" style={{ width: '100%' }}>
                            <option value="">Select a plan</option>
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.name}>{plan.namePlan}</option> // Asumiendo que el campo en la colección de planes es 'name'
                            ))}
                        </select>
                        {errors.planAdmin && <div className='text-danger'>{errors.planAdmin}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '18px', marginBottom: '-10px' }}>
                        <button type='button' className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }} onClick={() => navigate('/HomeMaster')}>Cancel</button>
                        <button className="btn btn-primary" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>
        
    );

}
export default CreateAdministrator;