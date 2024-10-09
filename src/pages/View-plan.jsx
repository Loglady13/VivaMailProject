import React, { useState, useEffect} from 'react';
import { principal } from '../shared-components/WordsBank.js';
import {fetchPlans} from '../services/provider.js';
import Swal from 'sweetalert2';

const ViewPlan=()=>{
    const [dataCollection, setDataCollection] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try {
                const plans = await fetchPlans(); 
                setDataCollection(plans);
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

    const handleContactClick = (planName) => {
        Swal.fire({
            title: `Contact Us about ${planName}`,
            html:
            `<form id="contactForm">
                <label for="name">Name:</label>
                <input type="text" name="name" class="swal2-input" placeholder="Your Name" required><br/>
                <label for="email">Email:</label>
                <input type="email" name="email" class="swal2-input" placeholder="Your Email" required><br/>
                <label for="message">Message:</label>
                <textarea name="message" class="swal2-textarea" placeholder="Your Message" required></textarea>
                <input type="hidden" name="plan" value="${planName}">
                <button type="submit" class="swal2-confirm swal2-styled">Send</button>
            </form>`,
            showConfirmButton: false // Oculta el botón por defecto, ya que el formulario tiene el suyo
        });

        // Manejar el envío del formulario usando fetch
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita la recarga o redirección

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                // Enviar el formulario usando fetch a la URL de Formspree
                const response = await fetch('https://formspree.io/f/xzzbpoqe', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Mostrar un mensaje de éxito si se envía correctamente
                    Swal.fire({
                        icon: 'success',
                        title: 'Message sent!',
                        text: 'We will get back to you soon.',
                        showConfirmButton: true
                    });
                } else {
                    // Mostrar un mensaje de error si hay problemas
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong. Please try again later.',
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                // Manejar errores de la solicitud
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was a problem sending the message.',
                    showConfirmButton: true
                });
            }
        });
    }

    
    return(
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
                                                <div className="flex-grow-1" style={{ marginLeft: '3px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                                    <h5 className="card-title" style={{ color: cardStyle.backgroundColor, marginTop: '25px' }}>{list.namePlan}</h5>
                                                    <p className="card-text" style={{ marginTop: '15px' }}>
                                                        {`${currencySymbol}${list.price} per ${list.paymentFrecuency}`}
                                                    </p>
                                                    <div>
                                                    {list.description.split(',').map((desc, index) => (
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                                            <i className="bi bi-check" style={{ color: cardStyle.backgroundColor, fontSize: '1.7rem', marginRight: '0.5rem' }}></i>
                                                            <span style={{ flex: '1', wordWrap: 'break-word', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '100%' }}>
                                                                {desc.trim()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column align-items-center" style={{ marginBottom: '10px' }}>
                                                    <button onClick={() => handleContactClick(list.namePlan)} className="btn btn-primary w-100" style={{ backgroundColor: cardStyle.backgroundColor, border: 'none', margin: '5px', height: '32px', maxWidth: '215px' }}>
                                                        {principal.contact}
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
                            <span className="visually-hidden">{principal.previous}</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#planCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">{principal.next}</span>
                        </button>
                    </div>
                </div>
    );

}
export default ViewPlan;