import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/credenciales';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../Styles/Create-client-mail.css'

const CreateClientMail = () => {

     /* To redirect to the home page from the cancel button */
    const navigate = useNavigate();

     /* To set inputs as empty after a creation */
    const defaultEntry = {
        nameClient: '',
        emailClient: '',
        idAdmin: ''
    };

    const [clientEmail, setClientEmail] = useState(defaultEntry);
    const [errors, setErrors] = useState({ nameClient: '', emailClient: '', idAdmin: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setClientEmail({ ...clientEmail, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const checkIfClientEmailExists = async (emailClient) => {
        const q = query(collection(db, 'EmailClient'), where('emailClient', '==', emailClient));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const ValidateInputs = (isFileUpload = false) => {
        const newErrors = { nameClient: '', emailClient: '', idAdmin: '' };
        let isValid = true;
        const noNumbers = /^\D{3,}/;
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isFileUpload) {
            if (!clientEmail.nameClient) {
                newErrors.nameClient = 'Name client is required.';
                isValid = false;
            } else if (!noNumbers.test(clientEmail.nameClient)) {
                newErrors.nameClient = 'The field name client must have only letters';
                isValid = false;
            }

            if (!clientEmail.emailClient) {
                newErrors.emailClient = 'Email client is required.';
                isValid = false;
            } else if (!emailFormat.test(clientEmail.emailClient)) {
                newErrors.emailClient = 'Please enter a valid email format including @ and .example.';
                isValid = false;
            }

            if (!clientEmail.idAdmin) {
                newErrors.idAdmin = 'Id Admin is required.';
                isValid = false;
            }
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
                html: 'The client has been successfully created',
            }).then(() => setIsSuccess(false)); // Resetting the status after displaying the alert
        }
    }, [isSuccess]);

    const saveClientEmail = async (e) => {
        e.preventDefault();

        if (!ValidateInputs(selectedFile !== null)) {
            return;
        }

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                let success = true; // Success indicator
                const currentDate = new Date();

                for (const entry of jsonData) {
                    const { nameClient, emailClient, idAdmin } = entry;

                    if (!nameClient || !emailClient || !idAdmin) {
                        console.warn(`Incomplete entry in the Excel file, will be ignored: ${JSON.stringify(entry)}`);
                        success = false;
                        continue;
                    }

                    const emailExists = await checkIfClientEmailExists(emailClient);
                    if (emailExists) {
                        console.warn(`The email ${emailClient} already exists, will be ignored.`);
                        success = false;
                        continue;
                    }

                    try {
                        await addDoc(collection(db, 'EmailClient'), {
                            nameClient,
                            emailClient,
                            idAdmin,
                            creationDate: currentDate,
                            lastUpdate: currentDate,
                            state: false,
                        });
                        console.log(`Client ${nameClient} added successfully.`);
                    } catch (error) {
                        console.error(`Error adding client ${nameClient}:`, error);
                        success = false;
                    }
                }

                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showCloseButton: true,
                        html: 'The clients have been successfully created',
                    }).then(() => setIsSuccess(true));
                }
            };
            reader.readAsArrayBuffer(selectedFile);
        } else {
            const emailExists = await checkIfClientEmailExists(clientEmail.emailClient);
            if (emailExists) {
                setErrors({ ...errors, emailClient: 'A client with this email already exists.' });
                return;
            }

            try {
                const currentDate = new Date();
                await addDoc(collection(db, 'EmailClient'), {
                    ...clientEmail,
                    creationDate: currentDate,
                    lastUpdate: currentDate,
                    state: false,
                });
                setErrors({ nameClient: '', emailClient: '', idAdmin: '' });
                setClientEmail(defaultEntry);
                setIsSuccess(true);
            } catch (error) {
                console.log(error);
                setErrors({ ...errors, global: 'An error occurred while saving the client' });
            }
        }
    };

    const selectedExcel = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setUploadedFile(file);
    }

    const removeUploadedFile = () => {
        setUploadedFile(null);
        setSelectedFile(null);
        document.getElementById('excelFile').value = null;
    };

    return (
        <div className='NewClient'>
            <SidebarAdmin />
            <div className="container-md" style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="fs-2 text-white" style={{ textAlign: 'left' }}>New Client</p>
                </div>
                <form onSubmit={saveClientEmail} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="nameClient" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the name of the client</label>
                        <input onChange={captureInputs} value={clientEmail.nameClient} type="text" name='nameClient' className="form-control" style={{ width: '100%' }} />
                        {errors.nameClient && <div className='text-danger'>{errors.nameClient}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="emailClient" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the email of the client</label>
                        <input onChange={captureInputs} value={clientEmail.emailClient} type="text" name='emailClient' className="form-control" aria-describedby="emailHelp" style={{ width: '100%' }} />
                        {errors.emailClient && <div className='text-danger'>{errors.emailClient}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="idAdmin" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Id Administrator</label>
                        <input onChange={captureInputs} value={clientEmail.idAdmin} type="text" name='idAdmin' className="form-control" style={{ width: '100%' }} />
                        {errors.idAdmin && <div className='text-danger'>{errors.idAdmin}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="excelFile" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Upload Excel File (If you want to create more than one at time)</label>
                        <input type="file" id="excelFile" name="excelFile" className="form-control" style={{ width: '100%' }} accept=".xlsx, .xls" onChange={selectedExcel} />
                    </div>
                    {uploadedFile && (
                        <div style={{ marginTop: '10px' }}>
                            <span className="text-white">{uploadedFile.name}</span>
                            <button type="button" className="btn btn-danger ms-3" onClick={removeUploadedFile}>Remove</button>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '18px', marginBottom: '-10px' }}>
                        <button type='button' className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }} onClick={() => navigate('/HomeAdmin')}>Cancel</button>
                        <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClientMail;
