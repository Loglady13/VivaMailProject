import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, startAfter, startAt, doc, updateDoc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../services/credentials.js';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import TableComponent from '../shared-components/Table-component';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import ModalCreateClientMail from '../components/Modal-create-client-mail.jsx';
import '../Styles/Background-Table.css'
import Swal from 'sweetalert2';
import CreateClientMail from './Create-client-mail.jsx';
import { useNavigate } from 'react-router-dom';

const TableClientMail=()=>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    // To format the date to show it
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

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
                    <h4 style="margin-bottom: 45px; font-weight: bold;">Edit Client</h4>
                    <div style="margin-bottom: 25px;">
                        <label for="swal-input1" style="display: block; margin-bottom: 5px;">New client name</label>
                        <input id="swal-input1" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.nameClient}">
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label for="swal-input2" style="display: block; margin-bottom: 5px;">New client email</label>
                        <input id="swal-input2" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.emailClient}">
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
                const nameClient = Swal.getPopup().querySelector('#swal-input1').value;
                const emailClient = Swal.getPopup().querySelector('#swal-input2').value;
                
                // Check if any fields are empty
                if (!nameClient || !emailClient) {
                    Swal.showValidationMessage('Please enter the two fields');
                    return false; // Prevent submission if validation fails
                }

                try {
                    // Step 1: Check if the email is already used by another company
                    const emailClientRef = collection(db, "EmailClient");
                    const q = query(emailClientRef, where("emailClient", "==", emailClient));
                    const querySnapshot = await getDocs(q);

                    // Check if the email belongs to a different company
                    const emailExists = querySnapshot.docs.some(doc => doc.id !== item.id);

                    if (emailExists) {
                        // Show error message if the email is already used
                        Swal.showValidationMessage('This email is already used by another client.');
                        return false; // Prevent submission if email is taken
                    }

                    // Return the values if all checks pass
                    return { nameClient, emailClient};
                } catch (error) {
                    // Handle any errors during data checking
                    Swal.showValidationMessage('Error checking data. Please try again later.');
                    return false; // Prevent submission if an error occurs
                }
            }
        });

        if (formValues) {
            // Step 2: Update the company data if no conflicts
            const { nameClient, emailClient} = formValues;
            try {
                const docRef = doc(db, "EmailClient", item.id); // Reference to the document to update
                await updateDoc(docRef, {
                    nameClient: nameClient,
                    emailClient: emailClient,
                    lastUpdate: new Date(),
                });

                // Show success message after updating
                Swal.fire({
                    position: 'top-end', // Position in the top right corner
                    icon: 'success',
                    text: 'Client update done!',
                    showConfirmButton: false, // Remove the confirm button
                    timer: 5000, // Message will disappear after 5 seconds
                    toast: true, // Convert the alert into a toast notification
                });
            } catch (error) {
                // Handle any errors during the update
                await Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'There was an error updating the client. Please try again later.',
                });
            }
        }
    };

    const showModal = (modalType, item) => {
        switch (modalType) {
            case 'view':
                ModalViewMore({
                    title: 'Client Email Details',
                    fields: [
                        { label: 'Client name', key: 'nameClient' },
                        { label: 'Email client', key: 'emailClient' },
                        { label: 'Creation date', key: 'creationDate', format: formatTimestamp },
                        { label: 'Last update date', key: 'lastUpdate', format: formatTimestamp },
                    ],
                    data: item
                });
                break;
            case 'delete':
                ModalDelete({
                    item,
                    collectionName: 'EmailClient',
                    warningMessage: 'You will lose it forever',
                    onSuccessMessage: 'The client has been deleted!',
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
                tittle={'Clients'}
                collectionName="EmailClient" //Name of the Collection
                columnName={['Name', 'Email']} //Name to show y in table
                columnsToShow={['nameClient', 'emailClient']} //Name of the fields in firebase
                handleViewClick={handleViewClick}  
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleCreateClick={handleCreateClick}  
            />
            <ModalCreateClientMail isOpen={isModalOpen} onClose={handleModalClose}/>
        </div>
    );

}
export default TableClientMail;