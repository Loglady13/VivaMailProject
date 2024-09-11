import React, { useRef, useState, useEffect} from 'react';
import logo from '../images/logo.png';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '../services/credenciales.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Styles/Principal.css';

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

    const [dataCollection, setDataCollection] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Plan'));
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id });
                });
                setDataCollection(docs);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);

    const groupCards = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };
  
    const groupedPlans = groupCards(dataCollection, 3);
    const currencySymbol = '$';
  
    const colors = [
        { backgroundColor: '#D02F7C', color: '#fff' },
        { backgroundColor: '#35D79C', color: '#fff' },
        { backgroundColor: '#7839CD', color: '#fff' }
    ];


    return (
        <div>
            {/* Navbar */}
            <nav className="navbar" style={{ backgroundColor: '#151718', padding: '20px' }}>
                <div className="container-fluid">
                    <img src={logo} width="150" alt="logo" />
                    <form className="d-flex" role="search">
                        <a className="navbar-brand" style={{ color: 'white' }} href='/Login'>Log In</a>
                        <button className="btn" type="button" onClick={handleShowPlans} style={{ backgroundColor: '#7839CD', color: 'white' }}>Plans</button>
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
                    <h1 style={{ color: 'white', fontSize: '30px' }} className='text-center'>EMAIL SENDING AUTOMATION</h1>
                    <br />
                    <h1 style={{ color: 'white', fontSize: '30px' }} className='text-center'>Plans start from $**** per month</h1>
                    <br />
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-lg" type="button" onClick={handleShowPlans} style={{ backgroundColor: '#7839CD', color: 'white' }}>Plans</button>
                    </div>
                </div>
            </div>

            {showPlans && (
                <div ref={plansSectionRef} style={{ background: 'linear-gradient(to bottom, #4F4949, #151718)', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                    <div className="container-md" style={{ width: '100%', marginTop: '2%' }}>
                    <div id="planCarousel" className="carousel slide" data-bs-ride="carousel" style={{marginTop:'5%'}}>
                        <div className="carousel-inner">
                        {groupedPlans.map((group, idx) => (
                            <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={idx}>
                                <div className="row justify-content-center">
                                {group.map((list, index) => {
                                    const colorIndex = index % colors.length;
                                    const cardStyle = colors[colorIndex];
                                    return (
                                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={list.id}>
                                        <div className="card mb-4 mx-2 card-hover-effect" style={{ backgroundColor: '#151718', borderColor: cardStyle.backgroundColor, borderRadius: '10px', color: '#F5F5F5', minHeight: '400px', maxHeight: '600px' }}>
                                            <div className="card-body d-flex flex-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                                <div className="flex-grow-1" style={{ marginLeft: '3px' }}>
                                                    <h5 className="card-title" style={{ color: cardStyle.backgroundColor, marginTop: '25px' }}>{list.namePlan}</h5>
                                                    <p className="card-text" style={{ marginTop: '15px' }}>
                                                        {`${currencySymbol}${list.price} per ${list.paymentFrecuency}`}
                                                    </p>
                                                    <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap' }}>
                                                        {list.description.split(',').map((desc, index) => (
                                                            <span key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                                                                <i className="bi bi-check" style={{ marginRight: '8px', color: cardStyle.backgroundColor, fontSize: '1.7rem', verticalAlign: 'middle' }}></i>
                                                                {desc.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column align-items-center" style={{ marginBottom: '10px' }}>
                                                    <button className="btn btn-primary w-100" style={{ backgroundColor: cardStyle.backgroundColor, border: 'none', margin: '5px', height: '32px', maxWidth: '215px' }}>
                                                        Contact us
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                    })}
                                </div>
                            </div>
                        ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#planCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#planCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}

export default Principal;
