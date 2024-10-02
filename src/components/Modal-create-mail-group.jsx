import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { checkIfMailingGroupExists, createEmailGroup } from '../services/provider'; // Suponiendo que este es el servicio correcto

const ModalCreateGroup = ({ isOpen, onClose }) => {
    const defaultEntry = {
        nameEmailGroup: '',
    };

    const defaultErrors = { nameEmailGroup: '', global: '' };
    const [mailingGroup, setMailingGroup] = useState(defaultEntry);
    const [errors, setErrors] = useState(defaultErrors);

    const resetForm = () => {
        setMailingGroup(defaultEntry);
        setErrors(defaultErrors);
    };

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setMailingGroup({ ...mailingGroup, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Limpiar errores al escribir
    };

    const validateInputs = () => {
        const newErrors = { ...defaultErrors };
        let isValid = true;

        if (!mailingGroup.nameEmailGroup) {
            newErrors.nameEmailGroup = 'Group name is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const checkGroupExists = async () => {
        try {
            const exists = await checkIfMailingGroupExists(mailingGroup.nameEmailGroup);
            return exists;
        } catch (error) {
            console.error("Error checking if group exists:", error);
            setErrors({ ...errors, global: 'Error checking group existence.' });
            return true; // Asume que existe en caso de error para evitar duplicados
        }
    };

    const saveGroup = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        const groupExists = await checkGroupExists();
        if (groupExists) {
            setErrors({ ...errors, nameEmailGroup: 'A group with this name already exists.' });
            return;
        }

        try {
            /* Saves the group and reset the inputs */
            await createEmailGroup(mailingGroup);
            resetForm();
            onClose(); 

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                text: 'The group has been successfully created',
                showConfirmButton: false,
                timer: 5000,
                toast: true,
            });
            resetForm();
            onClose(); // Cerrar el modal en éxito
        } catch (error) {
            console.error("Error saving group:", error);
            setErrors({ ...errors, global: 'An error occurred while saving the group.' });
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'd-block' : 'd-none'}`} style={{ background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '50px' }}>
            <div className="modal-dialog" style={{ margin: 'auto', maxWidth: '100%', width: '640px' }}>
                <div className="modal-content" style={{ background: 'black', padding: '28px', borderRadius: '10px', marginBottom: '50px' }}>
                    <div className="modal-header" style={{ marginBottom: '10px' }}>
                        <span className="modal-title text-white fs-3">New Mailing Group</span>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose} style={{ filter: 'invert(1)', marginBottom: '30px' }}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={saveGroup}>
                            <div className="mb-3">
                                <label className="form-label text-white">Enter the group name</label>
                                <input onChange={captureInputs} value={mailingGroup.nameEmailGroup} type="text" name='nameEmailGroup' className="form-control" />
                                {errors.nameEmailGroup && <div className='text-danger'>{errors.nameEmailGroup}</div>}
                            </div>

                            {errors.global && <div className='text-danger mb-3'>{errors.global}</div>}

                            <div className="modal-footer" style={{ marginTop: '40px', marginBottom: '-28px' }}>
                                <button type="button" className="btn btn-danger" style={{ width: '80px', height: '40px', marginTop: '25px' }} onClick={handleClose}>Cancel</button>
                                <button type="submit" className="btn btn-success" style={{ width: '80px', height: '40px', marginTop: '25px' }}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateGroup;
