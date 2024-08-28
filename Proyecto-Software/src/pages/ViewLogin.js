import React, { useState } from 'react';
import appFirebase from '../services/credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../images/logo.png';

const auth = getAuth(appFirebase);

const ViewLogin = () => {
    const [registro, setRegistro] = useState(false);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (registro) {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#151718' }}>
            <div className="row container" style={{ maxWidth: '800px' }}>
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                    <img src={logo} alt="Logo" style={{ maxWidth: '100%' }} />
                </div>
                <div className="col-md-1"></div> {/* Esta columna actúa como un separador */}
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h1 className="text-white mb-4">Log In</h1>
                    <form onSubmit={handlerSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-white">Email Address:</label>
                            <input type="email" className="form-control" placeholder="Enter email" id="email" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">Password:</label>
                            <input type="password" className="form-control" placeholder="Enter password" id="password" required />
                        </div>
                        <button className="btn btn-primary w-100" type="submit">
                            Log in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ViewLogin;
