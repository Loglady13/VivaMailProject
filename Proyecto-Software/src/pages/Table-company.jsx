import React from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import TableComponent from '../shared-components/Table-component';


const TableCompany = () => {

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

    return (
        <div>
            <SidebarAdmin />
            <div>
                <TableComponent
                    collectionName="Company"  // Nombre de la colección en tu base de datos Firebase
                    columnsToShow={['Name', 'Email']}  // Las columnas que deseas mostrar
                    orderField="companyName"  // Campo por el cual ordenar los datos
                    ViewModal={ViewModal}  // Componente modal para visualizar
                    EditModal={EditModal}  // Componente modal para editar
                    DeleteModal={DeleteModal}  // Componente modal para eliminar
                />
            </div>
        </div>
    );
};

export default TableCompany;