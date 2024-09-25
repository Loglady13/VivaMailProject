import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { addCompany, checkIfEmailCompanyExists, getNumberCompaniesAllowedByPlanForUser, getUserCompanyCount } from '../services/provider';

const ModalCreateCompany = ({ isOpen, onClose }) => {

    /* To set inputs as empty after a creation */
    const defaultEntry = {
        companyName: '',
        legalID: '',
        email: ''
    };

    const [company, setCompany] = useState(defaultEntry);
    const [errors, setErrors] = useState({ companyName: '', legalID: '', email: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateInputs = () => {
        const newErrors = { companyName: '', legalID: '', email: '' };
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
            }).then(() => setIsSuccess(false)); // Reset the success status
        }
    }, [isSuccess]);

    const saveCompany = async (e) => {
        e.preventDefault();

        /* Does the verification of the inputs */
        if (!validateInputs()) {
            return;
        }

        try {
            /* Check that the e-mail address is not already in use */
            const emailExists = await checkIfEmailCompanyExists(company.email);
            if (emailExists) {
                setErrors({ ...errors, email: 'A company with this email already exists.' });
                return;
            }

            /* Checks whether the user's plan allows him to create another company */
            const userPlan = await getNumberCompaniesAllowedByPlanForUser();
            const companyCount = await getUserCompanyCount();

            if (companyCount >= userPlan) {
                setErrors({ ...errors, global: 'You have reached the maximum number of companies allowed by your plan' });
                return;
            }

            /* Saves the company and reset the inputs */
            await addCompany(company);
            setErrors({ companyName: '', legalID: '', email: '' });
            setCompany(defaultEntry);
            setIsSuccess(true);
            onClose(); // Close the modal on success
        } catch (error) {
            console.log(error);
            setErrors({ ...errors, global: 'An error occurred while saving the company' });
        }
    };

    return (
        <div className={`modal ${isOpen ? 'd-block' : 'd-none'}`} style={{ background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop:'50px' }}>
            <div className="modal-dialog" style={{ margin: 'auto', maxWidth:'100%', width:'640px' }}>
                <div className="modal-content" style={{ background: 'black', padding: '28px', borderRadius: '10px', marginBottom: '50px'}}>
                    <div class="modal-header" style={{ marginBottom: '10px'}}>
                        <span className="modal-title text-white fs-3">New Company</span>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose} style={{ filter: 'invert(1)', marginBottom: '30px' }}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={saveCompany}>
                            <div className="mb-3">
                                <label className="form-label text-white">Enter the company name</label>
                                <input onChange={captureInputs} value={company.companyName} type="text" name='companyName' className="form-control"/>
                                {errors.companyName && <div className='text-danger'>{errors.companyName}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Enter the legal identification number</label>
                                <input onChange={captureInputs} value={company.legalID} type="text" name='legalID' className="form-control" />
                                {errors.legalID && <div className='text-danger'>{errors.legalID}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Email address</label>
                                <input onChange={captureInputs} value={company.email} type="text" name='email' className="form-control" />
                                {errors.email && <div className='text-danger'>{errors.email}</div>}
                            </div>

                            {errors.global && <div className='text-danger mb-3'>{errors.global}</div>}

                            <div class="modal-footer" style={{marginTop: '40px', marginBottom: '-28px'}}>
                                <button type="button" className="btn btn-danger" style={{ width:'80px', height:'40px', marginTop: '25px' }} onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-success" style={{ width:'80px', height:'40px', marginTop: '25px' }}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateCompany;
