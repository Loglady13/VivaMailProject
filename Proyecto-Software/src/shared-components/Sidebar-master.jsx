import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar.css';
import React, { useState } from 'react';

const SidebarMaster = () => {
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

  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleCollapse = (menuId) => {
    setIsOpen(prevState => !prevState);
    setOpenMenuId(prevId => prevId === menuId ? null : menuId);
  };


  return (
    <div className="sidebar" style={{ display: 'inline-block', borderRadius: '200px', margin: '20px' }}>
      {/* To open Sidebar */}
      <button className="btn btn-dark" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={require('../images/sidebar-open-icon.png')} alt="Icono" style={{ width: '30px', height: '30px' }} />
      </button>

      {/* Sidebar */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" data-bs-scroll="true" style={{ backgroundColor: '#151718', width: '380px' }}>
        {/* Sidebar top */}
        <div className="offcanvas-header text-white" style={{ backgroundColor: '#222527', height: '85px' }}>
          <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'Center' }}>
            <img className='img-logo' style={{ width: '190px', marginLeft: '10px' }} src={require('../images/logo.png')} />
          </div>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
        </div>

        <div className="search-box" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#423F3F', borderRadius: '5px', padding: '5px 10px', width: '345px', marginTop: '35px', marginLeft: '15px' }}>
          <img src={require('../images/sidebar-search-icon.png')} alt="Search Icon" style={{ width: '20px', marginRight: '10px' }} />
          <input type="text" placeholder="Search" style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} />
        </div>

        {/* Sidebar content */}
        <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718', marginTop: '10px' }}>
          {/* First Option */}
          <div className="p-2"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
            onClick={() => toggleCollapse('collapseAdministrators')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src={require('../images/sidebar-more-icon.png')} alt="Logo" style={{ width: '35px' }} />
            <span style={{ marginLeft: '18px' }}>Administrators Configuration</span>
            <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseAdministrators' ? 'rotate' : ''}`} />
          </div>
          {/* First Submenu */}
          <div className={`collapse ${openMenuId === 'collapseAdministrators' ? 'show' : ''}`} id="collapseAdministrators">
            <div className="p-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
              style={{ marginLeft: '60px', cursor: 'pointer' }}>
              Add new administrator
            </div>
            <div className="p-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
              style={{ marginLeft: '60px', cursor: 'pointer' }}>
              View administrators
            </div>
          </div>

          {/* Second Option */}
          <div className="p-2"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
            onClick={() => toggleCollapse('collapseReports')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '10px' }}>
            <img src={require('../images/sidebar-reports-icon.png')} alt="Reports Icon" style={{ width: '35px' }} />
            <span style={{ marginLeft: '18px' }}>Reports</span>
            <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseReports' ? 'rotate' : ''}`} />
          </div>
          {/* Second Submenu */}
          <div className={`collapse ${openMenuId === 'collapseReports' ? 'show' : ''}`} id="collapseReports">
            <div className="p-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
              style={{ marginLeft: '60px', cursor: 'pointer' }}>
              New report
            </div>
          </div>

          {/* Third Option */}
          <div className="p-2"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
            onClick={() => toggleCollapse('collapsePlans')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '10px' }}>
            <img src={require('../images/sidebar-plans-icon.png')} alt="Plans Icon" style={{ width: '35px' }} />
            <span style={{ marginLeft: '18px' }}>Plans</span>
            <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapsePlans' ? 'rotate' : ''}`} />
          </div>
          {/* Third Submenu */}
          <div className={`collapse ${openMenuId === 'collapsePlans' ? 'show' : ''}`} id="collapsePlans">
            <div className="p-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
              style={{ marginLeft: '60px', cursor: 'pointer' }}>
              View plans
            </div>
            <div className="p-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
              style={{ marginLeft: '60px', cursor: 'pointer' }}>
              Add new plans
            </div>
            <div className="p-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
              style={{ marginLeft: '60px', cursor: 'pointer' }}>
              View subscribers
            </div>
          </div>

          {/* Fourth Option */}
          <div className="p-2"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '10px' }}>
            <img src={require('../images/sidebar-configuration-icon.png')} alt="Configuration Icon" style={{ width: '35px' }} />
            <span style={{ marginLeft: '18px' }}>Configuration</span>
          </div>
        </div>

        {/* Log Out */}
        <div className="p-3 text-white" style={{ backgroundColor: '#151718' }}>
          <div style={{width: '130px', marginBottom: '10px', marginLeft: '30px', padding: '10px', cursor: 'pointer'}}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
          onClick={handleLogout}>
            <img src={require('../images/sidebar-sign-out-icon.png')} alt="Sign Out Icon" style={{ width: '35px', }} />
            <span style={{ marginLeft: '5px' }}> Sign Out </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMaster;