import React from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import TableComponent from '../shared-components/Table-component';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import Swal from 'sweetalert2';
import { collection, getDocs, query, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../services/credenciales.js';
import '../Styles/Create-company.css';
import { useNavigate } from 'react-router-dom';

const TableAdministrator = () => {
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

    const handleEditClick = async (item) => {
            // Fetch the available plans from the database
            let plans = [];
            try {
                const plansRef = collection(db, "Plan");
                const plansSnapshot = await getDocs(plansRef);
                plans = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error fetching plans: ", error);
            }

            // Step 2: Build the options for the drop-down
            const planOptions = plans.map(plan => 
                `<option value="${plan.namePlan}" ${plan.id === item.planId ? 'selected' : ''}>${plan.namePlan}</option>`
            ).join('');

            const { value: formValues } = await Swal.fire({
                html: `
                    <div style="text-align: left; margin-left: 38px; margin-top: 30px;">
                        <h4 style="margin-bottom: 45px; font-weight: bold;">Edit Administrator</h4>
                        <div style="margin-bottom: 25px;">
                            <label for="swal-input1" style="display: block; margin-bottom: 5px;">New administrator name</label>
                            <input id="swal-input1" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.nameAdmin}">
                        </div>
                        <div style="margin-bottom: 25px;">
                            <label for="swal-input2" style="display: block; margin-bottom: 5px;">New Administrator email</label>
                            <input id="swal-input2" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.email}">
                        </div>
                        <div style="margin-bottom: 25px;">
                            <label for="swal-select" style="display: block; margin-bottom: 5px;">Select new plan</label>
                            <select id="swal-select" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;">
                                ${planOptions}
                            </select>
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
                allowOutsideClick: false,
                width: '700px', 
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup',
                },
                preConfirm: async () => {
                    const name = Swal.getPopup().querySelector('#swal-input1').value;
                    const email = Swal.getPopup().querySelector('#swal-input2').value;
                    const planName = Swal.getPopup().querySelector('#swal-select').value;

                if (!name || !email) {
                    Swal.showValidationMessage('Please enter both fields');
                    return false;
                }

                try {
                    const companiesRef = collection(db, "Administrator");
                    const q = query(companiesRef, where("emailAdmin", "==", email));
                    const querySnapshot = await getDocs(q);

                    const emailExists = querySnapshot.docs.some(doc => doc.id !== item.id);

                    if (emailExists) {
                        Swal.showValidationMessage('This email is already used by another administrator.');
                        return false;
                    }

                    return { name, email, planName };
                } catch (error) {
                    Swal.showValidationMessage('Error checking data. Please try again later.');
                    return false;
                }
            }
        });

        if (formValues) {
            // Step 2: Update the company data if no conflicts
            const { name, email, planName } = formValues;
            try {
                const docRef = doc(db, "Administrator", item.id); // Reference to the document to update
                await updateDoc(docRef, {
                    nameAdmin: name,
                    email: email,
                    plan: planName,
                    lastUpdate: new Date(),
                });

                // Show success message after updating
                Swal.fire({
                    position: 'top-end', // Position in the top right corner
                    icon: 'success',
                    text: 'Administrator update done, refresh to see the changes!',
                    showConfirmButton: false, // Remove the confirm button
                    timer: 5000, // Message will disappear after 5 seconds
                    toast: true, // Convert the alert into a toast notification
                });
            } catch (error) {
                // Handle any errors during the update
                await Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'There was an error updating the administrator. Please try again later.',
                });
            }
        }
    };

    const handleCreateClick = () =>{
        navigate('/CreateAdministrator');
    };

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
        <div className='TableCompany'>
            <SidebarMaster />
            <TableComponent
                collectionName="Administrator" //Name of the Collection
                columnName={['Name', 'Email']} //Name to show y in table
                columnsToShow={['nameAdmin', 'email']} //Name of the fields in firebase
                handleViewClick={handleViewClick}  
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}  
                handleCreateClick={handleCreateClick}
            />
        </div>
    );
};

export default TableAdministrator;
