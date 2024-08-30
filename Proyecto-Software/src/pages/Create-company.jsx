import React from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import '../Styles/Create-company.css';


const CreateCompany = () => {

    return (
        <div className='NewCompany'>
            <SidebarAdmin />
            <div className="container-md" style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="fs-2 text-white" style={{ textAlign: 'left' }}>New Company</p>
                </div>
                <form style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="companyName" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the company name</label>
                        <input type="text" className="form-control" id="companyName" style={{ width: '100%' }} />
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="legalID" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the legal identification number</label>
                        <input type="text" className="form-control" id="legalID" style={{ width: '100%' }} />
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="email" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" style={{ width: '100%' }} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '10px', marginBottom: '-10px' }}>
                        <button type="button" className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default CreateCompany;