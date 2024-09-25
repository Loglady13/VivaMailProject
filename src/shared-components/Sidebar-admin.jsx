import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar.css';
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
            <button className="btn btn-dark btn-sidebar" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                <i className="bi bi-list" style={{ fontSize: '30px' }}></i>
            </button>

            {/* Sidebar */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" data-bs-scroll="true" style={{ backgroundColor: '#151718', width: '370px' }}>
                {/* Sidebar top */}
                <div className="offcanvas-header text-white" style={{ backgroundColor: '#222527', height: '85px' }}>
                    <div className="sidebar-infoAdmin" style={{ display: 'flex', justifyContent: 'center', alignItems: 'Center' }}>
                        <i class="bi bi-person-circle" alt="User Icon" style={{ fontSize: '38px', color: 'white', marginLeft: '12px' }}></i>
                        <div style={{ marginLeft: '19px' }}>
                            <div><strong>{userInfo.name}</strong></div>
                            <div>{userInfo.email}</div>
                        </div>
                    </div>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
                </div>

                <div className="search-box" style={{ marginTop: '30px' }}>
                    <i class="bi bi-search" alt="Search Icon" style={{ fontSize: '17px', marginRight: '10px', color: 'white' }}></i>
                    <input type="text" placeholder="Search" />
                </div>

                {/* Sidebar content */}
                <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718', marginTop: '5px' }}>
                    {/* First Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseCompany')}>
                        <i class="bi bi-building icons-size"></i>
                        <span>{sidebarAdmin.company}</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseCompany' ? 'rotate' : ''}`} />
                    </div>
                    {/* First Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseCompany' ? 'show' : ''}`} id="collapseCompany">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateCompany')}>
                            {sidebarAdmin.addCompany}
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableCompany')}>
                            {sidebarAdmin.companies}
                        </div>
                    </div>

                    {/* Second Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseEmails')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-envelope icons-size"></i>
                        <span>{sidebarAdmin.emails}</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseEmails' ? 'rotate' : ''}`} />
                    </div>
                    {/* Second Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseEmails' ? 'show' : ''}`} id="collapseEmails">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateEmail')}>
                            {sidebarAdmin.newMail}
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/MailList')}>
                            {sidebarAdmin.clientsMails}
                        </div>
                    </div>

                    {/* Third Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseCampaigns')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-pencil-square icons-size"></i>
                        <span>{sidebarAdmin.campaign}</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseCampaigns' ? 'rotate' : ''}`} />
                    </div>
                    {/* Third Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseCampaigns' ? 'show' : ''}`} id="collapseCampaigns">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateCampaign')}>
                            {sidebarAdmin.addCampaign}
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableCampaign')}>
                            {sidebarAdmin.viewCampaign}
                        </div>
                    </div>

                    {/* Fourth Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseClients')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-person-lines-fill icons-size"></i>
                        <span>{sidebarAdmin.clients}</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseClients' ? 'rotate' : ''}`} />
                    </div>
                    {/* Fourth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseClients' ? 'show' : ''}`} id="collapseClients">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateClientMail')}>
                            {sidebarAdmin.newClient}
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableClientMail')}>
                            {sidebarAdmin.clientsMails}
                        </div>
                    </div>

                    {/* Fifth Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseMailingGroups')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-inboxes icons-size"></i>
                        <span>{sidebarAdmin.mailingGroups}</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseMailingGroups' ? 'rotate' : ''}`} />
                    </div>
                    {/* Fifth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseMailingGroups' ? 'show' : ''}`} id="collapseMailingGroups">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateMailGroup')}>
                                {sidebarAdmin.mailiGroups}
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableMailGroup')}>
                            {sidebarAdmin.viewGroups}
                        </div>
                    </div>

                    {/* Sixth Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseReports')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-bar-chart-line icons-size"></i>
                        <span>{sidebarAdmin.report}</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseReports' ? 'rotate' : ''}`} />
                    </div>
                    {/* Sixth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseReports' ? 'show' : ''}`} id="collapseReports">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/AdministratorReport')}>
                            {sidebarAdmin.newreport}
                        </div>
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
                            <span style={{ marginLeft: '15px', verticalAlign: 'middle', lineHeight: '31px' }}>{generalSideBar.signOut}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;