import { getAuth, signOut } from 'firebase/auth';
import '../Styles/Sidebar.css';
import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';


const SidebarAdmin = () => {
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
                <i className="bi bi-list" style={{ fontSize: '30px' }}></i>
            </button>

            {/* Sidebar */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" data-bs-scroll="true" style={{ backgroundColor: '#151718', width: '380px' }}>
                {/* Sidebar top */}
                <div className="offcanvas-header text-white" style={{ backgroundColor: '#222527', height: '85px' }}>
                    <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'Center' }}>
                        Info del admin
                    </div>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: '5px' }}></button>
                </div>

                <div className="search-box" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#423F3F', borderRadius: '5px', padding: '5px 10px', width: '345px', marginTop: '30px', marginLeft: '15px' }}>
                    <i class="bi bi-search" alt="Search Icon" style={{ fontSize: '18px', marginRight: '10px', color: 'white' }}></i>
                    <input type="text" placeholder="Search" style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }} />
                </div>

                {/* Sidebar content */}
                <div className="offcanvas-body text-white" style={{ backgroundColor: '#151718', marginTop: '5px' }}>
                    {/* First Option */}
                    <div className="p-2"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                        onClick={() => toggleCollapse('collapseCompany')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <i class="bi bi-building" style={{ fontSize: '31px' }}></i>
                        <span style={{ marginLeft: '18px' }}>Company</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseCompany' ? 'rotate' : ''}`} />
                    </div>
                    {/* First Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseCompany' ? 'show' : ''}`} id="collapseCompany">
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            Add new company
                        </div>
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            View companies
                        </div>
                    </div>

                    {/* Second Option */}
                    <div className="p-2"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                        onClick={() => toggleCollapse('collapseEmails')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '9px' }}>
                        <i class="bi bi-envelope" style={{ fontSize: '31px' }}></i>
                        <span style={{ marginLeft: '18px' }}>Emails</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseEmails' ? 'rotate' : ''}`} />
                    </div>
                    {/* Second Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseEmails' ? 'show' : ''}`} id="collapseEmails">
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            New mail
                        </div>
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            Mails sent
                        </div>
                    </div>

                    {/* Third Option */}
                    <div className="p-2"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                        onClick={() => toggleCollapse('collapseCampaigns')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '9px' }}>
                        <i class="bi bi-pencil-square" style={{ fontSize: '31px' }}></i>
                        <span style={{ marginLeft: '18px' }}>Campaigns</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseCampaigns' ? 'rotate' : ''}`} />
                    </div>
                    {/* Third Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseCampaigns' ? 'show' : ''}`} id="collapseCampaigns">
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            Add campaigns
                        </div>
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            View campaigns
                        </div>
                    </div>

                    {/* Fourth Option */}
                    <div className="p-2"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                        onClick={() => toggleCollapse('collapseClients')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '9px' }}>
                        <i class="bi bi-person-lines-fill" style={{ fontSize: '31px' }}></i>
                        <span style={{ marginLeft: '18px' }}>Clients</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseClients' ? 'rotate' : ''}`} />
                    </div>
                    {/* Fourth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseClients' ? 'show' : ''}`} id="collapseClients">
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            New client email
                        </div>
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            Clients mails
                        </div>
                    </div>

                    {/* Fifth Option */}
                    <div className="p-2"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                        onClick={() => toggleCollapse('collapseMailingGroups')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '9px' }}>
                        <i class="bi bi-inboxes" style={{ fontSize: '31px' }}></i>
                        <span style={{ marginLeft: '18px' }}>Mailing groups</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseMailingGroups' ? 'rotate' : ''}`} />
                    </div>
                    {/* Fifth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseMailingGroups' ? 'show' : ''}`} id="collapseMailingGroups">
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            New mailing group
                        </div>
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            View mailing groups
                        </div>
                    </div>

                    {/* Sixth Option */}
                    <div className="p-2"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                        onClick={() => toggleCollapse('collapseReports')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '9px' }}>
                        <i class="bi bi-bar-chart-line" style={{ fontSize: '31px' }}></i>
                        <span style={{ marginLeft: '18px' }}>Reports</span>
                        <img src={require('../images/arrow-icon.png')} alt="Arrow" style={{ width: '25px', marginLeft: 'auto' }} className={`arrow-icon ${openMenuId === 'collapseReports' ? 'rotate' : ''}`} />
                    </div>
                    {/* Sixth Submenu */}
                    <div className={`collapse ${openMenuId === 'collapseReports' ? 'show' : ''}`} id="collapseReports">
                        <div className="p-2"
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c2f31'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#151718'}
                            style={{ marginLeft: '60px', cursor: 'pointer' }}>
                            New report
                        </div>
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

export default SidebarAdmin;