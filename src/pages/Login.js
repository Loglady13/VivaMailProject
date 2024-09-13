import React, { useState, useEffect } from 'react';
import appFirebase from '../services/credentials.js';
import { onAuthStateChanged } from 'firebase/auth';
import HomeMaster from '../pages/Home-page-master';
import HomeAdmin from './Home-page-admin';
import ViewLogin from '../pages/ViewLogin';
import { auth, db } from '../services/credentials.js';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function Login() {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga para manejar la espera
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const verificarTipoUsuario = async (usuarioFirebase) => {
      if (usuarioFirebase) {

        // Verificar en la colección de usuarios
        const userDocRef = doc(db, 'User', usuarioFirebase.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setTipoUsuario(userData.role); // Suponiendo que el rol se almacena en el campo 'rol'
          navigate(userData.role === 'Master' ? '/HomeMaster' : '/HomeAdmin');
        } else {
          setTipoUsuario(null);
        }

      }
    };

    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setLoading(true); // Iniciar el estado de carga
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
        verificarTipoUsuario(usuarioFirebase).then(() => setLoading(false));
      } else {
        setUsuario(null);
        setTipoUsuario(null);
        setLoading(false); // Finalizar la carga si no hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Mostrar una vista de carga mientras se verifica el estado del usuario
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
        <ViewLogin />
      )}
    </div>
  );
}

export default Login;
