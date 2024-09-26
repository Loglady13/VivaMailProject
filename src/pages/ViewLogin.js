import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../images/logo.png';
import { login, principal } from '../shared-components/WordsBank';

const auth = getAuth();

const ViewLogin = ({ setManualLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setManualLogin(true);
        } catch (error) {
            setError('Error al iniciar sesión: ' + error.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#151718' }}>
            <div className="row container" style={{ maxWidth: '800px' }}>
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                    <img src={logo} alt="Logo" style={{ maxWidth: '100%' }} />
                </div>
                <div className="col-md-1"></div> 
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h1 className="text-white mb-4">{principal.login}</h1>
                    <form onSubmit={handlerSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-white">{login.emailAddress}</label>
                            <input type="email" className="form-control" placeholder={login.enterEmail} value={email} required onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">{login.password}</label>
                            <input type="password" className="form-control" placeholder={login.enterPassword} value={password} required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button className="btn btn-primary w-100" type="submit">
                            {login.login}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ViewLogin;
