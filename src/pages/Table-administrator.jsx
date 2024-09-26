import React from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import TableComponent from '../shared-components/Table-component';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import '../Styles/Background-Table.css'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { fetchPlans, checkEmailExists, updateAdmin } from '../services/provider.js';

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
        //deleteUserFromAuth(item.uid);
    };

    const handleEditClick = async (item) => {
        const handleEditClick = async (item) => {
            // Obtener planes desde Provider.js
            let plans = [];
            try {
                plans = await fetchPlans();
            } catch (error) {
                console.error("Error fetching plans: ", error);
            }
        
            // Construir las opciones para el drop-down
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
                        const emailExists = await checkEmailExists(email, item.id);
        
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
                const { name, email, planName } = formValues;
                try {
                    // Actualizar administrador desde Provider.js
                    await updateAdmin(item.id, { nameAdmin: name, email, plan: planName });
        
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        text: 'Administrator update done!',
                        showConfirmButton: false,
                        timer: 5000,
                        toast: true,
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: 'There was an error updating the administrator. Please try again later.',
                    });
                }
            }
        };
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
                    collectionName: 'User',
                    warningMessage: 'You will lose it forever',
                    onSuccessMessage: 'The administrator has been deleted!',
                });
                break;
            default:
                break;
        }
    };

    return (
        <div className='Background-Table'> 
            <SidebarMaster />
            <TableComponent
                tittle='Administrators'
                collectionName="User" //Name of the Collection
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
