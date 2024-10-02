import React, {useState, useEffect} from 'react'; 
import {checkPlanExists, addPlan} from '../services/provider';
import Swal from 'sweetalert2';
import { createPlan, planManagement, create } from '../shared-components/WordsBank';

const ModalCreatePlan=({isOpen,onClose})=>{
    
     const defaultEntry = {
        namePlan: '',
        description: '',
        numberCompany:'',
        price: '',
        paymentFrecuency: 'year'  //initialize with default valu
    };

    const [plan, setPlan] = useState(defaultEntry);
    const [errors, setErrors] = useState({ namePlan: '', description: '', numberCompany: '',price:'' });
    const [isSuccess, setIsSuccess] = useState(false);

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setPlan({ ...plan, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateInputs = () => {
        const newErrors = { namePlan: '', description: '', numberCompany: '',price:'' };
        let isValid = true;
        
        if (!plan.namePlan.trim()) {
            newErrors.namePlan = 'The plan name is required.';
            isValid = false;
        } 
      
        if (!plan.description.trim()) {
            newErrors.description = 'The description is required.';
            isValid = false;
        }else if(plan.description.length>100){
            newErrors.description='Description must be 100 characters or less.'
            isValid=false;
        }

        if (!plan.numberCompany.trim()) {
            newErrors.numberCompany = 'The number company is required.';
            isValid = false;
        }else if (isNaN(plan.numberCompany)) {
            // Number validation
            newErrors.numberCompany = 'Must be a number.';
            isValid = false;
        }
    
        if (!plan.price.trim()) {
            newErrors.price = 'The price is required.';
            isValid = false;
        } else if (isNaN(plan.price)) {
            // Number validation
            newErrors.price = 'The price must be a number.';
            isValid = false;
        }
    
        if (!plan.paymentFrecuency) {
            newErrors.paymentFrecuency = 'The payment frequency is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                text: 'The plan has been successfully created',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
            }).then(() => setIsSuccess(false)); 
        }
    }, [isSuccess]);

    const savePlan = async (e) => {
        e.preventDefault();

        /* Does the verification of the inputs */
        if (!validateInputs()) {
            return;
        }

        try {
            const emailExists = await checkPlanExists(plan.namePlan);
            if (emailExists) {
                setErrors({ ...errors, namePlan: 'The plan name already exists.' });
                return;
            }
           
            await addPlan(plan);
            setErrors({namePlan: '', description: '', numberCompany: '',price:''});
            setPlan(defaultEntry);
            setIsSuccess(true);
            onClose();

        } catch (error) {
            console.log(error);
            setErrors({ ...errors, global: 'An error occurred while saving the plan' });
        }
    };

    // Reset inputs when modal closes
    const handleClose = () => {
        setPlan(defaultEntry); 
        setErrors({ namePlan: '', description: '', numberCompany: '',price:''}); 
        onClose(); 
    };

    return (
        <div className={`modal ${isOpen ? 'd-block' : 'd-none'}`} style={{ background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '50px' }}>
            <div className="modal-dialog" style={{ margin: 'auto', maxWidth: '100%', width: '640px' }}>
                <div className="modal-content" style={{ background: 'black', padding: '28px', borderRadius: '10px', marginBottom: '50px' }}>
                    <div class="modal-header" style={{ marginBottom: '10px' }}>
                        <span className="modal-title text-white fs-3">New Plan</span>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose} style={{ filter: 'invert(1)', marginBottom: '30px' }}></button>
                    </div>
                    <div className="modal-body">
                    <form onSubmit={savePlan}>
                        <div className="mb-3">
                            <label  className="form-label text-white">{createPlan.namePlan}</label>
                            <input type="text"  name="namePlan" className="form-control" onChange={captureInputs} value={plan.namePlan} ></input>
                            {errors.namePlan && <div className="text-danger">{errors.namePlan}</div>}
                        </div>
                        <div className="mb-3"> 
                            <label htmlFor="description" className="form-label fs-6 text-white" style={{ textAlign: 'center' }} >{createPlan.planDesc}</label>
                            <input type="text" name="description" className="form-control" style={{ width: '100%' }} onChange={captureInputs} value={plan.description}></input>
                            {errors.description && <div className="text-danger">{errors.description}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="numberCompany" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>
                            {createPlan.numberOfCompanies}</label>
                            <input type="text" name="numberCompany" className="form-control" style={{ width: '100%' }} onChange={captureInputs} value={plan.numberCompany}></input>
                            {errors.numberCompany && <div className="text-danger">{errors.numberCompany}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>
                                {createPlan.planPrice}</label>
                            <input type="text" name="price" className="form-control" style={{ width: '100%' }} onChange={captureInputs} value={plan.price}></input>
                            {errors.price && <div className="text-danger">{errors.price}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="paymentFrecuency" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>
                                {createPlan.paymentFrequency}</label>
                            <select name="paymentFrecuency" className="form-select" style={{ width: '100%'}} onChange={captureInputs} value={plan.paymentFrecuency}>
                                <option value="year">{planManagement.year}</option>
                                <option value="month">{planManagement.month}</option> 
                                <option value="week">{planManagement.week}</option>
                            </select>
                        </div>
                        {errors.global && <div className='text-danger mb-3'>{errors.global}</div>}
                        <div class="modal-footer" style={{ marginTop: '40px', marginBottom: '-28px' }}>
                                <button type="button" className="btn btn-danger" style={{ width: '80px', height: '40px', marginTop: '25px' }} onClick={handleClose}>{create.cancel}</button>
                                <button type="submit" className="btn btn-success" style={{ width: '80px', height: '40px', marginTop: '25px' }}>{create.add}</button>
                        </div>
                    </form>   
                    </div>
                </div>
            </div>
        </div>
    );

}
export default ModalCreatePlan;
