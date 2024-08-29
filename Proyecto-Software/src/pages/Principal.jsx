import React from 'react';
import logo from '../images/logo.png';

const Principal = () => {
    return (
        <div>
            <nav className="navbar" style={{backgroundColor: '#151718', padding: '20px'}}>
                <div className="container-fluid">
                    <img src={logo} width="150" alt="logo" />
                    <form className="d-flex" role="search">
                        <a className="navbar-brand" style={{color: 'white'}} href='/Login'>Log In</a>
                        <button className="btn" type="submit" style={{backgroundColor: '#7839CD', color: 'white',}}>Plans</button>
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
                    <img src={logo} alt="main logo" className='img-fluid rounded mx-auto d-block'/>
                    <br />
                    <h1 style={{color: 'white', fontSize: '30px'}} className='text-center'>EMAIL SENDING AUTOMATION</h1>
                    <br />
                    <h1 style={{color: 'white', fontSize: '30px'}} className='text-center'>Plans start from $**** per month</h1>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-lg" type="submit" style={{backgroundColor: '#7839CD', color: 'white'}}>Plans</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Principal;
