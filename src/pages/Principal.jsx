import React, { useRef, useState} from 'react';
import logo from '../images/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Styles/Principal.css';
import { principal } from '../shared-components/WordsBank.js';
import ViewPlan from '../pages/View-plan.jsx'

const Principal = () => {
    // Status to control the visibility of plans
    const [showPlans, setShowPlans] = useState(false);
    const plansSectionRef = useRef(null);

    //Function to show plans and scroll
    const handleShowPlans = () => {
        setShowPlans(true); // Muestra los planes
        setTimeout(() => {
            if (plansSectionRef.current) {
                plansSectionRef.current.scrollIntoView({ behavior: 'smooth' }); // type scroll
            }
        }, 100); // Timeout to ensure that the section is rendered before scrolling
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar" style={{ backgroundColor: '#151718', padding: '20px' }}>
                <div className="container-fluid">
                    <img src={logo} width="150" alt="logo" />
                    <form className="d-flex" role="search">
                        <a className="navbar-brand" style={{ color: 'white' }} href='/Login'>{principal.login}</a>
                        <button className="btn" type="button" onClick={handleShowPlans} style={{ backgroundColor: '#7839CD', color: 'white' }}>{principal.plans}</button>
                    </form>
                </div>
            </nav>
            <div className='bg-image' style={{
                position: 'relative',
                backgroundImage: 'url(https://res.cloudinary.com/dz22jvwbm/image/upload/v1724461721/envio-de-correos-masivos-detalle_w26uus.jpg)',
                minHeight: '93vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 1,
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 2,
                }}></div>
                <div style={{ position: 'relative', zIndex: 3 }}>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <img src={logo} alt="main logo" className='img-fluid rounded mx-auto d-block' />
                    <br />
                    <h1 style={{ color: 'white', fontSize: '30px' }} className='text-center'>{principal.description}</h1>
                    <br />
                    <h1 style={{ color: 'white', fontSize: '30px' }} className='text-center'>{principal.plansdescription}</h1>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-lg" type="button" onClick={handleShowPlans} style={{ backgroundColor: '#7839CD', color: 'white' }}>{principal.plans}</button>
                    </div>
                </div>
            </div>

            {showPlans && (
                <div ref={plansSectionRef} style={{ background: 'linear-gradient(to bottom, #4F4949, #151718)', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                    <ViewPlan/>
                </div>
            )}
        </div>
    );
}

export default Principal;
