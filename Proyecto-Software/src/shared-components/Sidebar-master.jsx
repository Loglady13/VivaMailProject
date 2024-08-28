import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar.css';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
      <button className="btn btn-dark" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '45px' }}>
        <i className="bi bi-list" style={{ fontSize: '30px'}}></i>
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
          <i class="bi bi-search" alt="Search Icon" style={{ fontSize: '18px', marginRight: '10px', color: 'white' }}></i>
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
            <i class="bi bi-person-circle" style={{ fontSize: '31px' }}></i>
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
            <i class="bi bi-bar-chart-line" style={{ fontSize: '31px' }}></i>
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
            <i class="bi bi-card-checklist" style={{ fontSize: '31px' }}></i>
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
            <i class="bi bi-person-gear" style={{ fontSize: '31px' }}></i>
            <span style={{ marginLeft: '18px' }}>Configuration</span>
          </div>
        </div>

        {/* Log Out */}
        <div className="p-3 text-white" style={{ backgroundColor: '#151718' }}>
          <div style={{ width: '130px', marginLeft: '30px', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" style={{ fontSize: '31px', verticalAlign: 'middle' }}></i>
            <span style={{ marginLeft: '15px', verticalAlign: 'middle', lineHeight: '31px' }}>Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMaster;