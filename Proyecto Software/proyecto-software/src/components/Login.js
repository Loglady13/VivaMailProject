import React, { useState } from 'react'
import Uno from '../images/1.jpg';
import Dos from '../images/2.png';
import Tres from '../images/3.png';
import appFirebase from '../credenciales';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';

const auth = getAuth(appFirebase)


const Login = () =>{

    const [registro, setRegistro] = useState(false)

    const handlerSubmit = async(e)=>{
        e.preventDefault()
        const email = e.target.email.value;
        const password = e.target.password.value;


        if(registro){
            await createUserWithEmailAndPassword(auth,email,password)
        }
        else{
            await signInWithEmailAndPassword(auth, email, password)
        }
    }



    return (
        <div className='row container p-4'>
            <div className='col-md-8'>
                <div id="carouselExample" className="carousel slide">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={Uno} alt="" className='tamaño-img'/>
                        </div>
                        <div class="carousel-item">
                            <img src={Dos} alt="" className='tamaño-img'/>
                        </div>
                        <div class="carousel-item">
                            <img src={Tres} alt="" className='tamaño-img' />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            {/* en esta sección será el formulario */}
            <div className='col-md-4'>
                <div className='mt-5 ms-5'>
                    <h1>{registro ? 'Sign up': 'Log in'}</h1>
                    <form onSubmit={handlerSubmit}>
                        <div className='mb-3'>
                            <label className='form-label'>Email Address:</label>
                            <input type='email' className='form-control' placeholder='example@gmail.com' id='email' required/>
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Password</label>
                            <input type='password' className='form-control' placeholder='Password' id='password' required/>
                        </div>

                        <button className='btn btn-primary' type='submit'>
                        {registro ? 'Sign in' : 'Log in'}
                        </button>

                    </form>

                    <div className='form-group' onClick={()=> setRegistro(!registro)}>
                        <button className='btn btn-secondary mt-4 from-control'>
                            {registro ? 'Do you already have an account? Log in': 'You don´t have an account? Sign in'}
                        </button>
                    </div>

                    
                </div>

            </div>

        </div>
    )
}

export default Login