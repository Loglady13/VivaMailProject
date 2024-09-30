import '../Styles/Home-master.css';
import SidebarMaster from '../shared-components/Sidebar-master';
import { getUserInfo } from '../services/provider';
import React, { useState, useEffect } from 'react';
import { getAuth} from 'firebase/auth';
import { homeMaster } from '../shared-components/WordsBank';


const HomeMaster = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const auth = getAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const info = await getUserInfo();
                if (info) {
                    setUserInfo({
                        name: info.nameMaster || 'Nombre no disponible',
                        email: info.email || 'Correo no disponible',
                    });
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        } else {
            console.log('No user logged in');
        }
    });

    return () => unsubscribe(); 
}, []);
  return (
    <div className='Home' style={{backgroundColor: '423F3F'}}>
      <SidebarMaster/>  
      <div className='bg-image' style={{
                position: 'relative',
                backgroundImage: 'url(https://res.cloudinary.com/dz22jvwbm/image/upload/v1724461721/envio-de-correos-masivos-detalle_w26uus.jpg)',
                minHeight: '93vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                
            }}>
          <br />
          <br />
          <div className style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '300px', float: 'right', marginRight: '40px'}}>
            <h2 style={{color: 'white', padding: '30px'}}>{homeMaster.welcome}</h2>
          </div>     
      </div>
      
    </div>
  );
};

export default HomeMaster;
