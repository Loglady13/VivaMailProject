import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import '../Styles/Create-company.css';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/credenciales';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateCompany = () => {
    /*
        COSAS QUE FALTAN

        -VERIFICAR CUANTAS EMPRESAS LE PERMITE TENER SU PLAN PARA SABER SI PUEDE CREAR OTRA O NO

    */

    /* To redirect to the home page from the cancel button */
    const navigate = useNavigate();

    /* To set inputs as empty after a creation */
    const defaultEntry = {
        companyName: '',
        legalID: '',
        email: ''
    };

    const [company, setCompany] = useState(defaultEntry);
    const [errors, setErrors] = useState({ companyName: '', legalID:'', email:''});
    const [isSuccess, setIsSuccess] = useState(false); // Estado para el éxito


    const captureInputs = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
        setErrors({...errors, [name]: ''})
    };

    /* To check there's no company with this mail already */
    const checkIfEmailExists = async (email) => {
        const q = query(collection(db, 'Company'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const validateInputs = () => {
        const newErrors = { companyName: '', legalID: '', email: ''};
        let isValid = true;

        /* Verify the field is not empty */
        if (!company.companyName) {
            newErrors.companyName = 'Company name is required.';
            isValid = false;
        }

        /* Verify the field is not empty and validate that the legalID has exactly 11 numeric digits */
        if (!company.legalID) {
            newErrors.legalID = 'Legal ID is required.';
            isValid = false;
        } else if (!/^\d{11}$/.test(company.legalID)) {
            newErrors.legalID = 'The legal ID must have exactly 11 digits.';
            isValid = false;
        }

        /* Verify the field is not empty and validate basic email formatting (must includ @ y .example) */
        if (!company.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
            newErrors.email = 'Please enter a valid email format including @ and .example.';
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
                html: 'The company has been successfully created',
            }).then(() => setIsSuccess(false)); // Resetear el estado después de mostrar la alerta
        }
    }, [isSuccess]);

    const saveCompany = async (e) => {
        e.preventDefault();

        /* Does the verification of the inputs */
        if (!validateInputs()) {
            return;
        }

        /* Does the verification of the email */
        const emailExists = await checkIfEmailExists(company.email);
        if (emailExists) {
            setErrors({...errors, email: 'A company with this email already exists.'});
            return;
        }

        /* Saves de company */
        try {
            const currentDate = new Date(); // Capture the current date and time
            await addDoc(collection(db, 'Company'), {
                ...company,
                creationDate: currentDate,
                lastUpdate: currentDate, // Both dates are current at the time of creation
            });
            setErrors({ companyName:'', legalID:'', email:''});
            setCompany(defaultEntry);
            setIsSuccess(true); // Activar la alerta de éxito
        } catch (error) {
            console.log(error);
            setErrors({...errors, global: 'An error occurred while saving the company'})
        }
    };

    return (
        <div className='NewCompany'>
            <SidebarAdmin />
            <div className="container-md" style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="fs-2 text-white" style={{ textAlign: 'left' }}>New Company</p>
                </div>
                <form onSubmit={saveCompany} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="companyName" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the company name</label>
                        <input onChange={captureInputs} value={company.companyName} type="text" name='companyName' className="form-control" style={{ width: '100%' }}/>
                        {errors.companyName && <div className='text-danger'>{errors.companyName}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="legalID" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the legal identification number</label>
                        <input onChange={captureInputs} value={company.legalID} type="text" name='legalID' className="form-control" style={{ width: '100%' }}/>
                        {errors.legalID && <div className='text-danger'>{errors.legalID}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="email" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Email address</label>
                        <input onChange={captureInputs} value={company.email} type="text" name='email' className="form-control" aria-describedby="emailHelp" style={{ width: '100%' }}/>
                        {errors.email && <div className='text-danger'>{errors.email}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '18px', marginBottom: '-10px' }}>
                        <button type='button' className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }} onClick={() => navigate('/HomeAdmin')}>Cancel</button>
                        <button className="btn btn-primary" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
