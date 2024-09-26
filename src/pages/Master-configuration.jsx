import React, { useState } from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import '../Styles/Master-configuration.css';
import { masterConfiguration } from '../shared-components/WordsBank';

const MasterConfiguration=()=>{

  //Se debe manejar la logica de los intervalos (debe definirse después de que se agregue calendario)  
  //La logica de la notificaciones debe valorarse y agregarse en el backlog
 // Lista de notificaciones (empresas pendientes de aceptar/rechazar)
 const notifications = [
    { id: 1, company: 'DonutJarkeys' },
    { id: 2, company: 'SoftBakery' },
  ];

    return(
        <div className='master-configuration'>
            <div><SidebarMaster/></div>
            <div className= 'container-master-configuration' style={{ backgroundColor: 'rgba(223, 216, 226, 0.8)', width: '50%', padding: '40px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Sección para el intervalo de tiempo */}
                <div className="row justify-content-center mb-3" style={{ width: '100%', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column'}}>
                    <div className="col-12 col-md-8 col-lg-6 bg-white p-4 rounded shadow-sm" style={{ width: '100%'}}>
                    <h5 className="text-left mb-4" style={{fontWeight: '350'}}>{masterConfiguration.frequencySendingEmails}</h5>
                    <div className="form-group mt-3" style={{margin:'3%'}}>
                        <label htmlFor="timeInterval" className="form-label fs-6" style={{fontWeight: 'bold'}}>{masterConfiguration.enterInterval}</label>
                        <input type="text" className="form-control" id="timeInterval" />
                    </div>
                    </div>
                </div>

                {/* Sección para las notificaciones (empresas) */}
                <div className="row justify-content-center" style={{ width: '100%', maxWidth: '800px',marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="col-md-8 bg-white p-4 rounded shadow-sm" style={{ width: '100%' }}> 
                    <h5 className="text-left" style={{marginBottom:'4%',fontWeight: '350'}}>{masterConfiguration.applicationsForCompany}</h5>
                    {notifications.map((notification) => (
                        <div className="input-group mb-3" key={notification.id}>
                        {/* Div que muestra el nombre de la empresa */}
                        <div className="form-control mt-3" style={{ backgroundColor: '#f8f9fa'}}>
                            {notification.company}
                        </div>
                        <div className="input-group-append">
                            <button className="btn mt-3" style={{ backgroundColor: '#DE3232', color: '#fff', opacity: '0.7', borderRadius: '5px', padding: '8px 15px' }} type="button">
                            <i className="bi bi-x-circle"></i>
                            </button>
                            <button className="btn mt-3" style={{ backgroundColor: '#35D79C', color: '#fff', opacity: '0.7', borderRadius: '5px', padding: '8px 15px' }} type="button">
                            <i className="bi bi-check-circle"></i>
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        
    );

}
export default MasterConfiguration;