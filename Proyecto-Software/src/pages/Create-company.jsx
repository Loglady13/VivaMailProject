import React, { useState } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import '../Styles/Create-company.css';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import appFirebase from '../services/credenciales';
import { useNavigate } from 'react-router-dom';


const CreateCompany = () => {
    const navigate = useNavigate();
    const db = getFirestore(appFirebase)

    /*To set inputs as empty after a creation*/
    const defaultEntry = {
        companyName: '',
        legalID: '',
        email: ''
    }

    const [company, setCompany] = useState(defaultEntry)

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value })
    }

    const saveCompany = async (e) => {
        e.preventDefault();
        try {
            const currentDate = new Date(); // Capture the current date and time
            await addDoc(collection(db, 'Company'), {
                ...company,
                createDate: currentDate,
                lastUpdate: currentDate, // Both dates are current at the time of creation
            });
        } catch (error) {
            console.log(error);
        }
        setCompany({ ...defaultEntry })
    }

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
                        <input onChange={captureInputs} value={company.companyName} type="text" name='companyName' className="form-control" style={{ width: '100%' }} />
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="legalID" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the legal identification number</label>
                        <input onChange={captureInputs} value={company.legalID} type="text" name='legalID' className="form-control" style={{ width: '100%' }} />
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="email" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Email address</label>
                        <input onChange={captureInputs} value={company.email} type="email" name='email' className="form-control" aria-describedby="emailHelp" style={{ width: '100%' }} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '10px', marginBottom: '-10px' }}>
                        <button onClick={() => navigate('/HomeAdmin')} className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Cancel</button>
                        <button className="btn btn-primary" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default CreateCompany;