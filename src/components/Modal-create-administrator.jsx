import React, {useState, useEffect} from 'react'; 
import { subscribeToPlans, checkIfEmailExists, createAdministrator } from '../services/provider';
import Swal from 'sweetalert2';


const ModalCreateAdministrator = ({ isOpen, onClose }) => {
    

    /* To set inputs as empty after a creation */
    const defaultEntry = {
        adminName: '',
        email: '', 
        password: '',
        planAdmin: ''
    };

    const [admin, setAdmin] = useState(defaultEntry);
    const [errors, setErrors] = useState({adminName : '', password:'', email:'', planAdmin:''});
    const [isSuccess, setIsSuccess] = useState(false); 
    const [plans, setPlans] = useState([]); // Status for save plans

    useEffect(() => {
        // Escuchar en tiempo real los cambios en la colección de planes
        const plansQuery = subscribeToPlans(setPlans);
        // Limpiar el listener cuando el componente se desmonte
        return () => plansQuery();
    }, []);

    

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
        setErrors({...errors, [name]: ''})
    };
    
    const validateInputs = () => { 
        const newErrors = { nameAdmin: '', password: '', email: '', planAdmin: '' }; 
        let isValid = true;

        /* Verify the field is not empty */
        if (!admin.adminName) {
            newErrors.adminName = 'Administrator name is required.';
            isValid = false;
        }
        /* Verify the field is not empty and validate that the password has more than 8 numeric digits */
        if (!admin.password) {
            newErrors.password = 'Password is required.';
            isValid = false;
        } else if (admin.password.length < 8) { 
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }
        /* Verify the field is not empty and validate basic email formatting (must includ @ y .example) */
        if (!admin.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
            newErrors.email = 'Please enter a valid email format including @ and .example.';
            isValid = false;
        }
        if (!admin.planAdmin) {
            newErrors.planAdmin = 'Plan is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                showCloseButton: true,
                html: 'The Adminitrator has been successfully created',
            }).then(() => setIsSuccess(false)); // Resetting the status after displaying the alert
        }
    }, [isSuccess]);

    const saveAdministrator = async (e) => {
        e.preventDefault();
        /* Does the verification of the inputs */
        if (!validateInputs()) {
            return;
        }
        /* Does the verification of the email */
        const emailExists = await checkIfEmailExists(admin.email);
        if (emailExists) {
            setErrors({...errors, email: 'An administrator with this email already exists.'});
            return;
        }

        /* Saves Administrator */
        try {
            // Create an user in Firebase
            createAdministrator(admin);
            setErrors({ adminName:'', email:'', password:'', planAdmin: ''});
            setAdmin(defaultEntry);
            setIsSuccess(true); // Activate success alert
            onClose();
        } catch (error) {
            console.log(error);
            setErrors({...errors, global: 'An error occurred while saving an administrator'})
        }
    };

    // Reset inputs when modal closes
    const handleClose = () => {
        setAdmin(defaultEntry); // Reset the form fields
        setErrors({ adminName:'', email:'', password:'', planAdmin: ''}); // Clear errors
        onClose(); // Trigger the close passed down as a prop
    };


  return (
    <div className={`modal ${isOpen ? 'd-block' : 'd-none'}`} style={{ background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '50px' }}>
            <div className="modal-dialog" style={{ margin: 'auto', maxWidth: '100%', width: '640px' }}>
                <div className="modal-content" style={{ background: 'black', padding: '28px', borderRadius: '10px', marginBottom: '50px' }}>
                    <div class="modal-header" style={{ marginBottom: '10px' }}>
                        <span className="modal-title text-white fs-3">New Administrator</span>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose} style={{ filter: 'invert(1)', marginBottom: '30px' }}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={saveAdministrator}>
                            <div className="mb-3">
                                <label className="form-label text-white">Enter the administrator name</label>
                                <input onChange={captureInputs} value={admin.adminName} type="text" name='adminName' className="form-control" />
                                {errors.adminName && <div className='text-danger'>{errors.adminName}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Email Address</label>
                                <input onChange={captureInputs} value={admin.email} type="text" name='email' className="form-control" />
                                {errors.email && <div className='text-danger'>{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">Password</label>
                                <input onChange={captureInputs} value={admin.password} type="text" name='password' className="form-control" />
                                {errors.password && <div className='text-danger'>{errors.password}</div>}
                            </div>
                            <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                                <label htmlFor="planAdmin" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Select a plan</label>
                                <select onChange={captureInputs} value={admin.planAdmin} name='planAdmin' className="form-select" style={{ width: '100%' }}>
                                    <option value="">Select a plan</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.name}>{plan.namePlan}</option> // Asumiendo que el campo en la colección de planes es 'name'
                                    ))}
                                </select>
                                {errors.planAdmin && <div className='text-danger'>{errors.planAdmin}</div>}
                            </div>

                            {errors.global && <div className='text-danger mb-3'>{errors.global}</div>}

                            <div class="modal-footer" style={{ marginTop: '40px', marginBottom: '-28px' }}>
                                <button type="button" className="btn btn-danger" style={{ width: '80px', height: '40px', marginTop: '25px' }} onClick={handleClose}>Cancel</button>
                                <button type="submit" className="btn btn-success" style={{ width: '80px', height: '40px', marginTop: '25px' }}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default ModalCreateAdministrator;