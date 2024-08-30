import React, { useState } from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import TableComponent from '../shared-components/Table-component';


const TableAdministrator=()=>{
     // Modales vacíos para placeholders
     const ViewModal = ({ onClose }) => {
        return null;
    };

    const EditModal = ({ onClose }) => {
        return null;
    };

    const DeleteModal = ({ onClose }) => {
        return null;
    };

    return(
        <div>
            <SidebarMaster/>
            <TableComponent
                    collectionName="Company"  // Nombre de la colección en tu base de datos Firebase
                    columnName={['Company', 'Email']} // Nombre de las columnas
                    columnsToShow={['companyName', 'email']}  // Las columnas que deseas mostrar
                    ViewModal={ViewModal}  // Componente modal para visualizar
                    EditModal={EditModal}  // Componente modal para editar
                    DeleteModal={DeleteModal}  // Componente modal para eliminar
            />
        </div>
        
    );

}
export default TableAdministrator;