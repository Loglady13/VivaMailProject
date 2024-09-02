import React from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import TableComponent from '../shared-components/Table-component';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';

const TableAdministrator = () => {

    // To format the date to show it
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const handleViewClick = (item) => {
        // Llama a la función de visualización del modal desde el TableComponent
        showModal('view', item);
    };

    const handleDeleteClick = (item) => {
        // Llama a la función de eliminación del modal desde el TableComponent
        showModal('delete', item);
    };

    const handleEditClick = (item) => {
        return null;
    }

    const showModal = (modalType, item) => {
        switch (modalType) {
            case 'view':
                ModalViewMore({
                    title: 'Administrator Details',
                    fields: [
                        { label: 'Administrator ID', key: 'id' },
                        { label: 'Administrator name', key: 'nameAdmin' },
                        { label: 'Email', key: 'email' },
                        { label: 'Plan', key: 'plan' },
                        { label: 'Last update date', key: 'creationDate', format: formatTimestamp },
                        { label: 'Last update date', key: 'lastUpdate', format: formatTimestamp },
                    ],
                    data: item
                });
                break;
            case 'delete':
                ModalDelete({
                    item,
                    collectionName: 'Administrator',
                    warningMessage: 'You will lose it forever',
                    onSuccessMessage: 'The administrator has been deleted, refresh to see the changes!',
                });
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <SidebarMaster />
            <TableComponent
                collectionName="Administrator"
                columnName={['Name', 'Email']}
                columnsToShow={['nameAdmin', 'email']}
                handleViewClick={handleViewClick}  // Pasar función para manejar vista
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}  // Pasar función para manejar eliminación
            />
        </div>
    );
};

export default TableAdministrator;
