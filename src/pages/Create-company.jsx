import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import '../Styles/Create-company.css';
import Swal from 'sweetalert2';
import { addCompany, checkIfEmailCompanyExists } from '../services/provider';
import { createCompany, create  } from '../shared-components/WordsBank';
 
const CreateCompany = () => {

    /* To set inputs as empty after a creation */
    const defaultEntry = {
        companyName: '',
        legalID: '',
        email: ''
    };

    const [company, setCompany] = useState(defaultEntry);
    const [errors, setErrors] = useState({ companyName: '', legalID:'', email:''});
    const [isSuccess, setIsSuccess] = useState(false); 


    const captureInputs = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
        setErrors({...errors, [name]: ''})
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
            }).then(() => setIsSuccess(false)); // Resetting the status after displaying the alert
        }
    }, [isSuccess]);

    const saveCompany = async (e) => {
        e.preventDefault();

        /* Does the verification of the inputs */
        if (!validateInputs()) {
            return;
        }

        /* Saves de company */
        try {

            const emailExists = await checkIfEmailCompanyExists(company.email);
            if(emailExists) {
                setErrors({ ...errors, email: 'A company with this email already exists.'});
                return;
            }

            await addCompany(company);
            setErrors({ companyName:'', legalID:'', email:''});
            setCompany(defaultEntry);
            setIsSuccess(true); // Activate success alert
        } catch (error) {
            console.log(error);
            setErrors({...errors, global: 'An error occurred while saving the company'})
        }
    };

    return (
        <div className='NewCompany'>
            <SidebarAdmin />
            <div className="container-md" style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '50px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="fs-2 text-white" style={{ textAlign: 'left' }}>{createCompany.newCompany}</p>
                </div>
                <form onSubmit={saveCompany} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="companyName" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>{createCompany.nameCompany}</label>
                        <input onChange={captureInputs} value={company.companyName} type="text" name='companyName' className="form-control" style={{ width: '100%' }}/>
                        {errors.companyName && <div className='text-danger'>{errors.companyName}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="legalID" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>{createCompany.legalIdCompany}</label>
                        <input onChange={captureInputs} value={company.legalID} type="text" name='legalID' className="form-control" style={{ width: '100%' }}/>
                        {errors.legalID && <div className='text-danger'>{errors.legalID}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="email" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>{createCompany.emailCompany}</label>
                        <input onChange={captureInputs} value={company.email} type="text" name='email' className="form-control" aria-describedby="emailHelp" style={{ width: '100%' }}/>
                        {errors.email && <div className='text-danger'>{errors.email}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '18px', marginBottom: '-10px' }}>
                        <button className="btn btn-primary" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>{create.add}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompany;
