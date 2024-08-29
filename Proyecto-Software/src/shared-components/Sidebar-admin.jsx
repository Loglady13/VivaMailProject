import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar.css';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';


const SidebarAdmin = () => {
    const navigate = useNavigate();
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
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" data-bs-scroll="true" style={{ backgroundColor: '#151718', width: '380px' }}>
                {/* Sidebar top */}
                <div className="offcanvas-header text-white" style={{ backgroundColor: '#222527', height: '85px' }}>
                    <div className="sidebar-infoAdmin" style={{ display: 'flex', justifyContent: 'center', alignItems: 'Center' }}>
                        Info del admin
                    </div>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
                </div>

                <div className="search-box" style={{ marginTop: '30px' }}>
                    <i class="bi bi-search" alt="Search Icon" style={{ fontSize: '18px', marginRight: '10px', color: 'white' }}></i>
                    <input type="text" placeholder="Search"/>
                </div>

                {/* Sidebar content */}
                <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718', marginTop: '5px' }}>
                    {/* First Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseCompany')}>
                        <i class="bi bi-building icons-size"></i>
                        <span>Company</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseCompany' ? 'rotate' : ''}`} />
                    </div>
                    {/* First Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseCompany' ? 'show' : ''}`} id="collapseCompany">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/NewCompany')}>
                            Add new company
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableCompany')}>
                            View companies
                        </div>
                    </div>

                    {/* Second Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseEmails')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-envelope icons-size"></i>
                        <span>Emails</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseEmails' ? 'rotate' : ''}`} />
                    </div>
                    {/* Second Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseEmails' ? 'show' : ''}`} id="collapseEmails">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateEmail')}>
                            New mail
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/MailList')}>
                            Mails sent
                        </div>
                    </div>

                    {/* Third Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseCampaigns')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-pencil-square icons-size"></i>
                        <span>Campaigns</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseCampaigns' ? 'rotate' : ''}`} />
                    </div>
                    {/* Third Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseCampaigns' ? 'show' : ''}`} id="collapseCampaigns">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateCampaign')}>
                            Add campaigns
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableCampaign')}>
                            View campaigns
                        </div>
                    </div>

                    {/* Fourth Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseClients')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-person-lines-fill icons-size"></i>
                        <span>Clients</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseClients' ? 'rotate' : ''}`} />
                    </div>
                    {/* Fourth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseClients' ? 'show' : ''}`} id="collapseClients">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateClientMail')}>
                            New client email
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableClientMail')}>
                            Clients mails
                        </div>
                    </div>

                    {/* Fifth Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseMailingGroups')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-inboxes icons-size"></i>
                        <span>Mailing groups</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseMailingGroups' ? 'rotate' : ''}`} />
                    </div>
                    {/* Fifth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseMailingGroups' ? 'show' : ''}`} id="collapseMailingGroups">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/CreateMailGroup')}>
                            New mailing group
                        </div>
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/TableMailGroup')}>
                            View mailing groups
                        </div>
                    </div>

                    {/* Sixth Option */}
                    <div className="p-2 sidebar-menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => toggleCollapse('collapseReports')}
                        style={{ marginTop: '9px' }}>
                        <i class="bi bi-bar-chart-line icons-size"></i>
                        <span>Reports</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" className={`arrow-icon ${openMenuId === 'collapseReports' ? 'rotate' : ''}`} />
                    </div>
                    {/* Sixth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseReports' ? 'show' : ''}`} id="collapseReports">
                        <div className="p-2 menu-item"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate('/AdministratorReport')}>
                            New report
                        </div>
                    </div>
                </div>

                {/* Log Out */}
                <div className="p-3 text-white">
                    <div className='logout-container'
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right" style={{ fontSize: '31px', verticalAlign: 'middle' }}></i>
                        <span style={{ marginLeft: '15px', verticalAlign: 'middle', lineHeight: '31px' }}>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;