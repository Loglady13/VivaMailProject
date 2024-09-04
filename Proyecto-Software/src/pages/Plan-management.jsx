import React, { useEffect, useState } from 'react';
import SidebarMaster from '../shared-components/Sidebar-master';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/credenciales.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Styles/Plan-management.css';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import Swal from 'sweetalert2';

const PlanManagement = () => {
  const [dataCollection, setDataCollection] = useState([]);

  useEffect(() => {
      const getData = async () => {
          try {
              const querySnapshot = await getDocs(collection(db, 'Plan'));
              const docs = [];
              querySnapshot.forEach((doc) => {
                  docs.push({ ...doc.data(), id: doc.id });
              });
              setDataCollection(docs);
          } catch (error) {
              console.log(error);
          }
      };
      getData();
  }, []);

  const handleEditClick = async (item) => {
    const { value: formValues } = await Swal.fire({
      html: `
          <p style="font-size: 1.5rem; color: black; margin-bottom: 20px; text-align: left;">Edit Plan</p>
          <form id="edit-form" style="width: 100%; ;display: flex; flex-direction: column; align-items: center;">
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">Enter the name of the plan</label>
              <input type="text" id="namePlan" style="background: #D9D9D9; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.namePlan}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">Enter the description</label>
              <input type="text" id="description" style="background: #D9D9D9; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.description}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">Enter the number of companies for the plan</label>
              <input type="text" id="numberCompany" style="width: 100%; background: #D9D9D9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.numberCompany}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">Enter the price</label>
              <input type="text" id="price" style="width: 100%; background: #D9D9D9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" value="${item.price}">
            </div>
            <div style="width: 100%; max-width: 800px; margin-bottom: 15px;">
              <label for="paymentFrecuency" style="font-size: 1rem; font-weight: bold; color: black; text-align: left; display: block;">Select the payment frequency</label>
              <select id="paymentFrecuency" style="width: 100%; background: #D9D9D9;padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <option value="year" ${item.paymentFrecuency === 'year' ? 'selected' : ''}>Per year</option>
                <option value="month" ${item.paymentFrecuency === 'month' ? 'selected' : ''}>Per month</option>
                <option value="week" ${item.paymentFrecuency === 'week' ? 'selected' : ''}>Per week</option>
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
        }
  
        return { namePlan, description, numberCompany, price, paymentFrecuency };
      }
    });
  
    if (formValues) {
      const { namePlan, description, numberCompany, price, paymentFrecuency } = formValues;
      try {
        const docRef = doc(db, 'Plan', item.id);
        await updateDoc(docRef, {
          namePlan,
          description,
          numberCompany,
          price,
          paymentFrecuency
        });
  
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Plan updated successfully!',
          showConfirmButton: false,
          timer: 5000,
          toast: true
        });
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
          warningMessage: 'Mensaje de warning :c',
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
                                  <div className="card mb-4 mx-2 card-hover-effect" style={{ backgroundColor: '#151718', borderColor: cardStyle.backgroundColor, borderRadius: '10px', color: '#F5F5F5', minHeight: '370px', maxHeight: '500px' }}>
                                      <div className="card-body d-flex flex-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        <div className="flex-grow-1" style={{ marginLeft: '3px' }}>
                                            <h5 className="card-title" style={{ color: cardStyle.backgroundColor, marginTop: '25px' }}>{list.namePlan}</h5>
                                            <p className="card-text" style={{ marginTop: '15px' }}>
                                                {`${currencySymbol}${list.price} per ${list.paymentFrecuency}`}
                                            </p>
                                            <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap' }}>
                                                {list.description.split(',').map((desc, index) => (
                                                    <span key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                                                        <i className="bi bi-check" style={{ marginRight: '8px', color: cardStyle.backgroundColor, fontSize: '1.7rem', verticalAlign: 'middle' }}></i>
                                                        {desc.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column align-items-center" style={{ marginBottom: '10px' }}>
                                            <button onClick={() => handleEditClick(list)} className="btn btn-primary w-100" style={{ backgroundColor: cardStyle.backgroundColor, border: 'none', margin: '5px', height: '32px', maxWidth: '215px' }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(list)} className="btn btn-primary w-100" style={{ backgroundColor: cardStyle.backgroundColor, border: 'none', margin: '5px', height: '32px', maxWidth: '215px' }}>
                                                Delete
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
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#planCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
          </div>
      </div>
  );
};
export default PlanManagement;
