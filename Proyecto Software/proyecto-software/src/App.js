import React, {useState} from 'react'
import './App.css';
import Home from './components/Home'
import Login from './components/Login'

import appFirebase from './credenciales';
import {getAuth,onAuthStateChanged} from 'firebase/auth';

const auth = getAuth(appFirebase)

function App() {
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
      {usuario ? <Home correoUsuario = {usuario.email} /> : <Login/>}
    </div>
  );
}

export default App;
