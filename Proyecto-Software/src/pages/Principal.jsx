import React from 'react';
import '../Styles/Principal.css';

const Principal = () =>{


    return(
        <div className='Principal'>
        <section className='nav-principal'>
            <div className='object'>
            <ul>
                <li className='element-img'><img src={'https://res.cloudinary.com/dgm059qwp/image/upload/v1722462386/adomoclnmg5kigfnbigl.png'} alt=""/></li>
                <li className='element-2'><a href="/Login">Log in</a></li>
                <li className='element-3'><button>Plans</button></li>
            </ul>
            </div>
        </section>
        <section className='vivamail'>
        <div className='content'>
        <img className='logo-principal' src={'https://res.cloudinary.com/dgm059qwp/image/upload/v1722462386/adomoclnmg5kigfnbigl.png'} alt=""/>
        <h3>EMAIL SENDING AUTOMATION</h3>
        <h3 className='description'>Plans start from $*** per month</h3>
        <button><a href="#">View Plans</a></button>
        </div>
        
        </section>
    </div>
    );



}

export default Principal;
