import React, { useState } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import TableComponent from '../shared-components/Table-component';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import ModalCreateMailGroup from '../components/Modal-create-mail-group.jsx'
import { updateMailingGroup } from '../services/provider.js';
import '../Styles/Background-Table.css'
import Swal from 'sweetalert2';

import { db } from '../services/credentials.js';
import { collection, getDocs, query, doc, updateDoc, where } from 'firebase/firestore';
import { wait } from '@testing-library/user-event/dist/utils/index.js';

const TableMailGroup = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewClick = (item) => {
        // Calls the modal display function from TableComponent
        showModal('view', item);
    };

    const handleDeleteClick = (item) => {
        // Calls the modal removal function from the TableComponent
        showModal('delete', item);
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Closes the modal
    };

    const handleCreateClick = () => {
        setIsModalOpen(true); // Opens the modal
    };

    const handleEditClick = async (item) => {
        const { value: formValues } = await Swal.fire({
            html: `
                <div style="text-align: left; margin-left: 38px; margin-top: 30px;">
                    <h4 style="margin-bottom: 45px; font-weight: bold;">Edit Mailing Group</h4>
                    <div style="margin-bottom: 25px;">
                        <label for="swal-input1" style="display: block; margin-bottom: 5px;">New mailing group name</label>
                        <input id="swal-input1" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.nameEmailGroup}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#35D79C',
            cancelButtonColor: '#DE3232',
            showCloseButton: true,
            background: '#DFD8E2',
            width: '650px',
            allowOutsideClick: false,
            customClass: {
                container: 'swal2-container',
                popup: 'swal2-popup',
            },
            preConfirm: async () => {
                // Retrieve values from the inputs
                const nameEmailGroup = Swal.getPopup().querySelector('#swal-input1').value;

                // Check if any fields are empty
                if (!nameEmailGroup) {
                    Swal.showValidationMessage('Please enter the two fields');
                    return false; // Prevent submission if validation fails
                }

                try {

                    return { nameEmailGroup };
                } catch (error) {
                    // Handle any errors during data checking
                    Swal.showValidationMessage('Error checking data. Please try again later.');
                    return false; // Prevent submission if an error occurs
                }
            }
        });

        if (formValues) {
            const updateData = {
                nameEmailGroup: formValues.nameEmailGroup,
                lastUpdate: new Date(), // Set the update date
            }

            try {
                await updateMailingGroup(item.id, updateData);

                Swal.fire({
                    position: 'top-end', // Position in the top right corner
                    icon: 'success',
                    text: 'The company has been updated',
                    showConfirmButton: false, // Remove the confirm button
                    timer: 5000, // Message will disappear after 5 seconds
                    toast: true, // Convert the alert into a toast notification
                });

            } catch (error) {
                await Swal.fire({ icon: 'error', title: 'Update Failed', text: 'There was an error updating the Mailing group. Please try again later.', });
            }
        }
    };

    // To format the date to show it
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const formatEmails = (emails) => {
        if (!Array.isArray(emails) || emails.length === 0) return ''; // If it is not an array or is empty, returns an empty string
        return emails.join('\n'); // Join emails with line breaks
    };

    const showModal = (modalType, item) => {
        switch (modalType) {
            case 'view':
                ModalViewMore({
                    title: 'Mailing Group Details',
                    fields: [
                        { label: 'Group name ', key: 'nameEmailGroup' },
                        { label: 'Number of members', key: 'numberMembers' },
                        { label: 'Creation date', key: 'creationDate', format: formatTimestamp },
                        { label: 'Last update date', key: 'lastUpdate', format: formatTimestamp },
                        { label: 'Members', key: 'emails', format: formatEmails }
                    ],
                    data: item
                });
                break;
            case 'delete':
                ModalDelete({
                    item,
                    title: 'Mail Group',
                    collectionName: 'EmailGroup',
                    warningMessage: 'You will lose it forever',
                    onSuccessMessage: 'The group has been deleted!',
                });
                break;
            default:
                break;
        }
    };

    return (
        <div className='Background-Table'>
            <SidebarAdmin />
            <TableComponent
                tittle={'Mailing Groups'}
                collectionName="EmailGroup" //Name of the Collection
                columnName={['Name Group']} //Name to show y in table
                columnsToShow={['nameEmailGroup']} //Name of the fields in firebase
                handleViewClick={handleViewClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleCreateClick={handleCreateClick}
            />
            <ModalCreateMailGroup isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
    );

}
export default TableMailGroup;