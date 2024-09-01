import React from 'react';
import Swal from 'sweetalert2';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/credenciales.js';

const ModalDelete = ({ item, collectionName, onSuccessMessage }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `<div style="text-align: left; ">Delete ${collectionName}<hr style="border: 1px solid #5A5555;"></div>`,
      html: `
        <div>
          <p>Are you sure you want to delete this ${collectionName}: <strong>${item.name}?</strong></p>
          <p>You will lose everything!</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#CB2A2A',
      cancelButtonColor: '#423F3F',
      showCloseButton: true,
    });

    if (result.isConfirmed) {
      try {
        const itemRef = doc(db, collectionName, item.id);
        await deleteDoc(itemRef);

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: onSuccessMessage,
          showConfirmButton: false,
          timer: 5000,
          toast: true,
        });
      } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: `There was an error deleting the ${collectionName}. Please try again later.`,
        });
      }
    }
  };

  return (
    <button onClick={handleDelete} className="btn btn-danger btn-sm">
      <i className="bi bi-trash3" style={{ fontSize: '18px', color: 'white' }}></i>
    </button>
  );
};

export default ModalDelete;
