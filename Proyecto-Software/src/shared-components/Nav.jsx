import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Nav.css';
import React, { useState } from 'react';

const Nav = () =>{
    const auth = getAuth();

    const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada exitosamente");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: ", error);
      });
    };
    
    const  [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sidebar">
    <div className="sidebar-logo">
      <img className='img-logo' src={'https://res.cloudinary.com/dgm059qwp/image/upload/v1722462386/adomoclnmg5kigfnbigl.png'}/>
    </div>
    <div className="search-box">
      <img src={'https://res.cloudinary.com/dz22jvwbm/image/upload/v1724475255/buscar_ggh4ns.png'} alt="" />
      <input type="text" />
    </div>
    <ul className="nav-items">
      <li>
        <div className="nav-item">
          <img src={'https://res.cloudinary.com/dz22jvwbm/image/upload/v1724473576/agregar_lyen9l.png'}/>
          <span>Administrators Configuration</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </li>
      <li>
        <div className="nav-item">
          <img src={'https://res.cloudinary.com/dz22jvwbm/image/upload/v1724473576/agregar_lyen9l.png'}/>
          <span>Reports</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </li>
      <li>
        <div className="nav-item">
          <img src={'https://res.cloudinary.com/dz22jvwbm/image/upload/v1724473927/repetir_aodmuw.png'}/>
          <span>Plans</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </li>
      <li>
        <div className="nav-item">
          <img src={'https://res.cloudinary.com/dz22jvwbm/image/upload/v1724473979/avatar-de-usuario_u75ayp.png'}/>
          <span>Configuration</span>
          <span className="dropdown-icon">▼</span>
        </div>
      </li>
    </ul>
    <div className="sign-out">
      <img src={'https://res.cloudinary.com/dz22jvwbm/image/upload/v1724474173/cerrar-sesion-de-usuario_eehjii.png'} alt="" />
      <span>Sign out</span>
    </div>
  </nav>
  );
    
};

export default Nav;