import React, { useEffect, useState } from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Styles/Plan-management.css';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import Swal from 'sweetalert2';
import { planManagement, tableComponent } from '../shared-components/WordsBank.js';
import {fetchPlans, updatePlan} from '../services/provider.js';

const PlanManagement = () => {
  const [dataCollection, setDataCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
        const data = await fetchPlans();
        setDataCollection(data);
        setLoading(false);
    };
    fetchData();
  }, []);

  const handleEditClick = async (item) => {
    const { value: formValues } = await Swal.fire({
      html: `
          <p style="font-size: 1.5rem; color: black; margin-bottom: 20px; text-align: left;">${planManagement.editPlan}</p>
          <form id="edit-form" style="width: 100%; ;display: flex; flex-direction: column; align-items: center;">
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">${planManagement.namePLan}</label>
              <input type="text" id="namePlan" style="background: #D9D9D9; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.namePlan}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">${planManagement.descriptionPlan}</label>
              <input type="text" id="description" style="background: #D9D9D9; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.description}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">${planManagement.numberCompanies}</label>
              <input type="text" id="numberCompany" style="width: 100%; background: #D9D9D9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.numberCompany}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">${planManagement.price}</label>
              <input type="text" id="price" style="width: 100%; background: #D9D9D9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.price}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label for="paymentFrecuency" style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">${planManagement.payment}</label>
              <select id="paymentFrecuency" style="width: 100%; background: #D9D9D9;padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <option value="year" ${item.paymentFrecuency === 'year' ? 'selected' : ''}>${planManagement.year}</option>
                <option value="month" ${item.paymentFrecuency === 'month' ? 'selected' : ''}>${planManagement.month}</option>
                <option value="week" ${item.paymentFrecuency === 'week' ? 'selected' : ''}>${planManagement.week}</option>
              </select>
            </div>
          </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#35D79C',
      cancelButtonColor: '#DE3232',
      background: '#F5F5F5',
      showCloseButton: true,
      allowOutsideClick: false,
      preConfirm: () => {
        const form = document.getElementById('edit-form');
        const namePlan = form.querySelector('#namePlan').value;
        const description = form.querySelector('#description').value;
        const numberCompany = form.querySelector('#numberCompany').value;
        const price = form.querySelector('#price').value;
        const paymentFrecuency = form.querySelector('#paymentFrecuency').value;
  
        if (!namePlan || !description || !numberCompany || !price || !paymentFrecuency) {
          Swal.showValidationMessage('Please fill out all fields');
          return false;
        }else if (description.length>100){ 
          Swal.showValidationMessage('Description must be 100 characters or less');
          return false;
        } else if (!/^\d+$/.test(numberCompany)) { 
          Swal.showValidationMessage('Number of companies must be a number');
          return false;
        } else if (!/^\d+(\.\d+)?$/.test(price)) { 
          Swal.showValidationMessage('Price must be a number');
          return false;
        }
  
        return { namePlan, description, numberCompany, price, paymentFrecuency };
      }
    });
  
    if (formValues) {
      try {
        await updatePlan(item.id, formValues);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Plan updated successfully!',
          showConfirmButton: false,
          timer: 5000,
          toast: true
        });

      // Update status without reloading the page
      setDataCollection((prevData) =>
        prevData.map((plan) => (plan.id === item.id ? { ...plan, ...formValues } : plan))
      );

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'There was an error updating the plan. Please try again later.'
        });
      }
    }
  };


  const handleDeleteClick = (item) => {
      ModalDelete({
          item,
          collectionName: 'Plan', 
          warningMessage: 'You will lose it forever',
          onSuccessMessage: 'The plan has been deleted, refresh to see the changes!',
      });
  };

  const groupCards = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
      }
      return result;
  };

  const groupedPlans = groupCards(dataCollection, 3);
  const currencySymbol = '$';

  const colors = [
      { backgroundColor: '#D02F7C', color: '#fff' },
      { backgroundColor: '#35D79C', color: '#fff' },
      { backgroundColor: '#7839CD', color: '#fff' }
  ];

  return (
      <div className="plan-management">
          <div><SidebarMaster /></div>
          <div className="mb-3 d-flex align-items-center justify-content-end">
            <button type="button" className="btn btn-success" style={{ fontSize: '18px', marginRight: '21vw'}}>
            <i className="bi bi-plus-square" style={{ color: 'white' }}></i>
            </button>
          </div>
          {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">{tableComponent.loading}</span>
                    </div>
                </div>
            ) : (
              <div className="container-md" style={{ width: '82%', marginTop: '2%' }}>
            <div id="planCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {groupedPlans.map((group, idx) => (
                      <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={idx}>
                        <div className="row justify-content-center">
                          {group.map((list, index) => {
                            const colorIndex = index % colors.length;
                            const cardStyle = colors[colorIndex];
                            return (
                              <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={list.id}>
                                  <div className="card mb-4 mx-2 card-hover-effect" style={{ backgroundColor: '#151718', borderColor: cardStyle.backgroundColor, borderRadius: '10px', color: '#F5F5F5', minHeight: '370px', maxHeight: '600px' }}>
                                      <div className="card-body d-flex flex-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        <div className="flex-grow-1" style={{ marginLeft: '3px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            <h5 className="card-title" style={{ color: cardStyle.backgroundColor, marginTop: '25px' }}>{list.namePlan}</h5>
                                            <p className="card-text" style={{ marginTop: '15px' }}>
                                                {`${currencySymbol}${list.price} per ${list.paymentFrecuency}`}
                                            </p>
                                            <div>
                                              {list.description.split(',').map((desc, index) => (
                                                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                                      <i className="bi bi-check" style={{ color: cardStyle.backgroundColor, fontSize: '1.7rem', marginRight: '0.5rem' }}></i>
                                                      <span style={{ flex: '1', wordWrap: 'break-word', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '100%' }}>
                                                          {desc.trim()}
                                                      </span>
                                                  </div>
                                              ))}
                                        </div>
                                        </div>
                                        <div className="d-flex flex-column align-items-center" style={{ marginBottom: '10px', marginTop: 'auto'  }}>
                                            <button onClick={() => handleEditClick(list)} className="btn btn-primary w-100" style={{ backgroundColor: cardStyle.backgroundColor, border: 'none', margin: '5px', height: '32px', maxWidth: '215px' }}>
                                                {tableComponent.edit}
                                            </button>
                                            <button onClick={() => handleDeleteClick(list)} className="btn btn-primary w-100" style={{ backgroundColor: cardStyle.backgroundColor, border: 'none', margin: '5px', height: '32px', maxWidth: '215px' }}>
                                                {tableComponent.delete}
                                            </button>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                            );
                            })}
                        </div>
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#planCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">${tableComponent.previous}</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#planCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">${tableComponent.next}</span>
                </button>
            </div>
          </div>
              
            )}
          
      </div>
  );
};
export default PlanManagement;
