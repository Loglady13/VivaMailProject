import React, { useState } from 'react'
import Uno from '../images/1.jpg';
import Dos from '../images/2.png';
import Tres from '../images/3.png';
import appFirebase from '../services/credenciales';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import '../Styles/Login.css'

const auth = getAuth(appFirebase)


const ViewLogin = () =>{

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
        <div className='login'>
            <div className='left'>
                <div id="logo">
                    <div className="logo">
                        <div className="img">
                            <img src={'https://res.cloudinary.com/dgm059qwp/image/upload/v1722462386/adomoclnmg5kigfnbigl.png'} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
            {/* en esta sección será el formulario */}
            <div className='right'>
                <div className='form2'>
                    <h1>{registro ? 'Sign up': 'Log in'}</h1>
                    <form onSubmit={handlerSubmit}>
                        <div className='register2'>
                            <label className='form-label'>Email Address:</label>
                            <br/>
                            <br/>
                            <input type='email' className='form-control' placeholder='example@gmail.com' id='email' required/>
                        </div>
                        <div className='register2'>
                            <br/>
                            <label className='form-label'>Password</label>
                            <br/>
                            <br/>
                            <input type='password' className='form-control' placeholder='Password' id='password' required/>
                        </div>

                        <div className='register2'>
                        <button type='submit' className='register'>
                        {registro ? 'Sign in' : 'Log in'}
                        </button></div>
                        

                    </form>

                    

                    
                </div>

            </div>

        </div>
    )
}

export default ViewLogin