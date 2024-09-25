import appFirebase from '../services/credenciales';
import {getAuth,onAuthStateChanged} from 'firebase/auth';
import Home from '../pages/Home-page-master';
import ViewLogin from '../pages/ViewLogin';
import React, {useState} from 'react';

const auth = getAuth(appFirebase)

function Login (){
    const [usuario, setUsuario] = useState(null)

  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if(usuarioFirebase){
      setUsuario(usuarioFirebase)
    }
    else{
      setUsuario(null)
    }
  })

  return (
    <div className="">
      {usuario ? <Home correoUsuario = {usuario.email} /> : <ViewLogin/>}
    </div>
  );
}

export default Login;