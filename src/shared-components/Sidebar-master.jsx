import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar.css';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../services/provider';

const SidebarMaster = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada exitosamente");
        navigate('/Login'); // Redirige a la página de Login después de cerrar sesión
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: ", error);
      });
  };

  const toggleCollapse = (menuId) => {
    setIsOpen(prevState => !prevState);
    setOpenMenuId(prevId => prevId === menuId ? null : menuId);
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#2c2f31';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#151718';
  };

  return (
    <div className="sidebar">
      {/* To open Sidebar */}
      <button className="btn btn-dark btn-sidebar" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar" >
        <i className="bi bi-list" style={{ fontSize: '30px' }}></i>
      </button>

      {/* Sidebar */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" data-bs-scroll="true" style={{ backgroundColor: '#151718', width: '370px' }}>
        {/* Sidebar top */}
        <div className="offcanvas-header text-white" style={{ backgroundColor: '#222527', height: '85px' }}>
          <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'Center' }}>
            <img className='img-logo' style={{ width: '185px', marginLeft: '10px' }} src={require('../images/logo.png')} />
          </div>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
        </div>

        <div className="search-box" style={{ marginTop: '35px' }}>
          <i class="bi bi-search" alt="Search Icon" style={{ fontSize: '17px', marginRight: '10px', color: 'white' }}></i>
          <input type="text" placeholder="Search" />
        </div>

        {/* Sidebar content */}
        <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718', marginTop: '10px' }}>
          {/* First Option */}
          <div className="p-2 sidebar-menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => toggleCollapse('collapseAdministrators')}>
            <i class="bi bi-person-circle icons-size"></i>
            <span>Administrators Configuration</span>
            <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseAdministrators' ? 'rotate' : ''}`} />
          </div>
          {/* First Submenu */}
          <div className={`collapse ${openMenuId === 'collapseAdministrators' ? 'show' : ''}`} id="collapseAdministrators">
            <div className="p-2 menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/CreateAdministrator')}>
              Add new administrator
            </div>
            <div className="p-2 menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/TableAdministrator')}>
              View administrators
            </div>
          </div>

          {/* Second Option */}
          <div className="p-2 sidebar-menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => toggleCollapse('collapseReports')}
            style={{ marginTop: '10px' }}>
            <i class="bi bi-bar-chart-line icons-size"></i>
            <span>Reports</span>
            <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseReports' ? 'rotate' : ''}`} />
          </div>
          {/* Second Submenu */}
          <div className={`collapse ${openMenuId === 'collapseReports' ? 'show' : ''}`} id="collapseReports">
            <div className="p-2 menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/MasterReport')}>
              New report
            </div>
          </div>

          {/* Third Option */}
          <div className="p-2 sidebar-menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => toggleCollapse('collapsePlans')}
            style={{ marginTop: '10px' }}>
            <i class="bi bi-card-checklist icons-size"></i>
            <span>Plans</span>
            <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapsePlans' ? 'rotate' : ''}`} />
          </div>
          {/* Third Submenu */}
          <div className={`collapse ${openMenuId === 'collapsePlans' ? 'show' : ''}`} id="collapsePlans">
            <div className="p-2 menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/PlanManagement')}>
              View plans
            </div>
            <div className="p-2 menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/CreatePlan')}>
              Add new plans
            </div>
            <div className="p-2 menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate('/TableSubscriber')}>
              View subscribers
            </div>
          </div>

          {/* Fourth Option */}
          <div className="p-2 sidebar-menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ marginTop: '10px' }}
            onClick={() => navigate('/MasterConfiguration')}>
            <i class="bi bi-person-gear" style={{ fontSize: '31px' }}></i>
            <span>Configuration</span>
          </div>
        </div>

        {/* Log Out */}
        <div className="p-1 text-white">
          <div style={{ padding: '8px' }}>
            <div className='logout-container'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" style={{ fontSize: '30px', verticalAlign: 'middle' }}></i>
              <span style={{ marginLeft: '15px', verticalAlign: 'middle', lineHeight: '31px' }}>Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMaster;