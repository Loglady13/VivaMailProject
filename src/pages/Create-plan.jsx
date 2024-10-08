import React, { useState, useEffect } from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import '../Styles/Create-plan.css';
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createPlan, planManagement, create } from '../shared-components/WordsBank';
import {checkPlanExists, addPlan} from '../services/provider'

const CreatePlan=()=>{

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        namePlan: '',
        description: '',
        numberCompany:'',
        price: '',
        paymentFrecuency: 'year'  //initialize with default value
    });
    
    const data=(e)=>{
        const{name, value}= e.target;    
        setFormData({...formData,[name]:value})
    }

    const save=async(e)=>{
        e.preventDefault();
        if (await validate()) {
            try {
                await addPlan(formData);
                setIsSuccess(true);
            } catch (error) {
                setErrors({ ...errors, global: error.message });
            }
        }
    }



    const  validate = async () => {
        let errors = {};
        let valid = true;
         /* Verify the field is not empty */
        if (!formData.namePlan.trim()) {
          errors.namePlan = 'The plan name is required.';
          valid = false;
        } else if (await checkPlanExists(formData.namePlan)) { //validate if the name of plan exist
            errors.namePlan = 'The plan name already exists.';
            valid = false;
        }
    
        if (!formData.description.trim()) {
          errors.description = 'The description is required.';
          valid = false;
        }else if(formData.description.length>100){
            errors.description='Description must be 100 characters or less.'
            valid=false;
        }

        if (!formData.numberCompany.trim()) {
            errors.numberCompany = 'The number company is required.';
            valid = false;
        }else if (isNaN(formData.numberCompany)) {
            // Number validation
            errors.numberCompany = 'Must be a number.';
            valid = false;
          }
    
        if (!formData.price.trim()) {
          errors.price = 'The price is required.';
          valid = false;
        } else if (isNaN(formData.price)) {
          // Number validation
          errors.price = 'The price must be a number.';
          valid = false;
        }
    
        if (!formData.paymentFrecuency) {
          errors.paymentFrecuency = 'The payment frequency is required.';
          valid = false;
        }
    
        setErrors(errors);
        return valid;
    };

    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                showCloseButton: true,
                html: 'The plan has been successfully created',
            }).then(() => setIsSuccess(false)); // Resetting the status after displaying the alert
        }
    }, [isSuccess]);


    return(
        <div className='create-new-plan'>
            <div><SidebarMaster/></div>
            <div className='container-create-plan' style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '50px', display: 'flex', flexDirection: 'column' }}>
                <p className="fs-2 text-white" style={{ marginBottom: '20px', textAlign: 'left' }}>{createPlan.newPlan}</p>
                <div className='form-create-plan'>
                    <form onSubmit={save} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className='"mb-3"' style={{ width: '100%', maxWidth: '800px' }}>
                            <label htmlFor="namePlan" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>{createPlan.namePlan}</label>
                            <input type="text"  name="namePlan" className="form-control" style={{ width: '100%' }} onChange={data} value={formData.namePlan} ></input>
                            {errors.namePlan && <div className="text-danger">{errors.namePlan}</div>}
                        </div>
                        <div className='"mb-3"' style={{ width: '100%', maxWidth: '800px' }}> 
                            <label htmlFor="description" className="form-label fs-6 text-white" style={{ textAlign: 'center' }} >{createPlan.planDesc}</label>
                            <input type="text" name="description" className="form-control" style={{ width: '100%' }} onChange={data} value={formData.description}></input>
                            {errors.description && <div className="text-danger">{errors.description}</div>}
                        </div>
                        <div  className='"mb-3"' style={{ width: '100%', maxWidth: '800px' }}>
                            <label htmlFor="numberCompany" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>
                            {createPlan.numberOfCompanies}</label>
                            <input type="text" name="numberCompany" className="form-control" style={{ width: '100%' }} onChange={data} value={formData.numberCompany}></input>
                            {errors.numberCompany && <div className="text-danger">{errors.numberCompany}</div>}
                        </div>
                        <div  className='"mb-3"' style={{ width: '100%', maxWidth: '800px' }}>
                            <label htmlFor="price" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>
                                {createPlan.planPrice}</label>
                            <input type="text" name="price" className="form-control" style={{ width: '100%' }} onChange={data} value={formData.price}></input>
                            {errors.price && <div className="text-danger">{errors.price}</div>}
                        </div>
                        <div className='"mb-3"' style={{ width: '100%', maxWidth: '800px' }}>
                            <label htmlFor="paymentFrecuency" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>
                                {createPlan.paymentFrequency}</label>
                            <select name="paymentFrecuency" className="form-select" style={{ width: '100%'}} onChange={data} value={formData.paymentFrecuency}>
                                <option value="year">{planManagement.year}</option>
                                <option value="month">{planManagement.month}</option> 
                                <option value="week">{planManagement.week}</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '18px', marginBottom: '-10px' }}>
                            <button type='button' className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }} onClick={() => navigate('/HomeMaster')}>{create.cancel}</button>
                            <button className="btn btn-primary" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>{create.add}</button>
                        </div>
                    </form>      
                </div>
            </div> 
        </div>
    );

}
export default CreatePlan;