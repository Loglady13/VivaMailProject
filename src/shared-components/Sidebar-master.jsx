import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar-master.css';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { generalSideBar } from './WordsBank';

const SidebarMaster = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Options of the sidebar
  const menuItems = [
    {
      id: 'collapseAdministrators',
      icon: 'bi-person-circle',
      label: 'Administrators',
      submenus: ['Add new administrator', 'View administrators'], paths: ['/CreateAdministrator', '/TableAdministrator']
    },
    {
      id: 'collapseReports',
      icon: 'bi-bar-chart-line',
      label: 'Reports',
      submenus: ['New Report'], paths: ['/MasterReport']
    },
    {
      id: 'collapsePlans',
      icon: 'bi-card-checklist',
      label: 'Plans',
      submenus: ['Add new plan', 'View plans'], paths: ['/CreatePlan', '/PlanManagement']
    },
    {
      id: 'masterConfiguration',
      icon: 'bi-person-gear',
      label: 'Configurations',
      submenus: [], paths: []
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm) ||
    item.submenus.some(sub => sub.toLowerCase().includes(searchTerm))
  );

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
            <img className='img-logo' alt='logo' style={{ width: '185px', marginLeft: '10px' }} src={require('../images/logo.png')} />
          </div>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
        </div>

        {/* SearchBox */}
        <div className="search-box" style={{ marginTop: '30px' }}>
          <i class="bi bi-search" alt="Search Icon" style={{ fontSize: '17px', marginRight: '10px', color: 'white' }}></i>
          <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
        </div>

        {/* Sidebar content */}
        <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718' }}>
          {/* Renderizar opciones filtradas */}
          {filteredMenuItems.map(item => (
            <div key={item.id}>
              <div className="p-2 mt-2 sidebar-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => toggleCollapse(item.id)}>
                <i className={`bi ${item.icon} icons-size`}></i>
                <span>{item.label}</span>
                {item.submenus.length > 0 && (
                  <img
                    src={require('../images/arrow-icon.png')}
                    alt="Arrow"
                    className={`arrow-icon ${openMenuId === item.id ? 'rotate' : ''}`}
                  />
                )}
              </div>
              <div className={`collapse ${openMenuId === item.id ? 'show' : ''}`} id={item.id}>
                {item.submenus.map((submenu, index) => (
                  <div key={index} className="p-2 menu-item"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate(item.paths[index])}>
                    {submenu}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Log Out */}
        <div className="p-1 text-white">
          <div style={{ padding: '8px' }}>
            <div className='logout-container'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" style={{ fontSize: '30px', verticalAlign: 'middle' }}></i>
              <span style={{ marginLeft: '15px', verticalAlign: 'middle', lineHeight: '31px' }}>{generalSideBar.signOut}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMaster;