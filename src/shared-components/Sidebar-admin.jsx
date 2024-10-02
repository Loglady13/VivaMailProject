import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar-admin.css'
import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../services/provider';
import { sidebarAdmin, generalSideBar } from './WordsBank';

const SidebarAdmin = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const info = await getUserInfo();
                    if (info) {
                        setUserInfo({
                            name: info.nameAdmin || 'Nombre no disponible',
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

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("Sesión cerrada exitosamente");
                navigate('/Login');
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
            id: 'Companies',
            icon: 'bi-building',
            label: 'Companies',
            submenus: [], paths: ['/TableCompany']
        }, 
        {
            id: 'collapseEmails',
            icon: 'bi-envelope', label: 'Emails', submenus: ['New mail', 'Mails sent'], paths: ['/CreateEmail', '/MailList']
        },
        {
            id: 'Campaigns',
            icon: 'bi-pencil-square',
            label: 'Campaigns',
            submenus: [], paths: ['/TableCampaign']
        },
        {
            id: 'Clients',
            icon: 'bi-person-lines-fill',
            label: 'Clients',
            submenus: [], paths: ['/TableClientMail']
        },
        {
            id: 'MailingGroups',
            icon: 'bi-inboxes',
            label: 'Mailing groups',
            submenus: [], paths: ['/TableMailGroup']
        },
        {
            id: 'Reports',
            icon: 'bi-bar-chart-line',
            label: 'Reports',
            submenus: [], paths: ['/AdministratorReport']
        }
    ];

    // Filtrar las opciones según el término de búsqueda
    const filteredMenuItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm) ||
        item.submenus.some(sub => sub.toLowerCase().includes(searchTerm))
    );

    const handleMenuClick = (item) => {
        if (item.submenus.length === 0 && item.paths.length > 0) {
          // Si no tiene submenús, redirigir a la ruta especificada
          navigate(item.paths[0]);
        } else {
          toggleCollapse(item.id); // Si tiene submenús, abre/cierra el dropdown
        }
      };  

    return (
        <div className="sidebar">
            <button className="btn btn-dark btn-sidebar" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                <i className="bi bi-list" style={{ fontSize: '30px' }}></i>
            </button>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" data-bs-scroll="true" style={{ backgroundColor: '#151718', width: '370px' }}>
                <div className="offcanvas-header text-white" style={{ backgroundColor: '#222527', height: '85px' }}>
                    <div className="sidebar-infoAdmin" style={{ display: 'flex', justifyContent: 'center', alignItems: 'Center' }}>
                        <i className="bi bi-person-circle" alt="User Icon" style={{ fontSize: '38px', color: 'white', marginLeft: '12px' }}></i>
                        <div style={{ marginLeft: '19px' }}>
                            <div><strong>{userInfo.name}</strong></div>
                            <div>{userInfo.email}</div>
                        </div>
                    </div>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
                </div>

                {/* SearchBox */}
                <div className="search-box" style={{ marginTop: '28px' }}>
                    <i className="bi bi-search" alt="Search Icon" style={{ fontSize: '17px', marginRight: '10px', color: 'white' }}></i>
                    <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange}/>
                </div>

                {/* Sidebar content */}
                <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718' }}>
                    {/* Renderizar opciones filtradas */}
                    {filteredMenuItems.map(item => (
                        <div key={item.id}>
                            <div className="p-2 mt-2 sidebar-menu"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleMenuClick(item)}>
                                <i className={`bi ${item.icon} icons-size`}></i>
                                <span>{item.label}</span>
                                {item.submenus.length > 0 &&(
                                    <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === item.id ? 'rotate' : ''}`} />
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

export default SidebarAdmin;
