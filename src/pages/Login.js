import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import HomeMaster from '../pages/Home-page-master';
import HomeAdmin from './Home-page-admin';
import ViewLogin from '../pages/ViewLogin';
import { auth } from '../services/credentials.js';
import { useNavigate } from 'react-router-dom'; 
import { verifyUserRole } from '../services/provider.js';

function Login() {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga para manejar la espera
  const [manualLogin, setManualLogin] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const verificarTipoUsuario = async (usuarioFirebase) => {
      if (usuarioFirebase) {
        const userRole = await verifyUserRole(usuarioFirebase.uid);
        if (userRole) {
          setTipoUsuario(userRole); 
          navigate(userRole === 'Master' ? '/HomeMaster' : '/HomeAdmin');
        } else {
          setTipoUsuario(null);
        }

      }
    };

    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (manualLogin) { // Solo si fue un login manual
        setLoading(true);
        if (usuarioFirebase) {
          setUsuario(usuarioFirebase);
          verificarTipoUsuario(usuarioFirebase).then(() => setLoading(false));
        } else {
          setUsuario(null);
          setTipoUsuario(null);
          setLoading(false);
        }
      } else {
        setLoading(false); // Si no es login manual, detén la carga
      }
    });

    return () => unsubscribe();
  }, [manualLogin, navigate]);

  // Vista de carga 
  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      {usuario ? (
        tipoUsuario === 'admin' ? (
          <HomeAdmin correoUsuario={usuario.email} />
        ) : tipoUsuario === 'master' ? (
          <HomeMaster correoUsuario={usuario.email} />
        ) : (
          <p>No tienes permisos para acceder</p>
        )
      ) : (
        <ViewLogin setManualLogin={setManualLogin} />
      )}
    </div>
  );
}

export default Login;
