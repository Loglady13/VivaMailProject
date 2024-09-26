import Swal from 'sweetalert2';
import { deleteItem } from '../services/provider.js';

const ModalDelete = async ({ item, collectionName, warningMessage, onSuccessMessage }) => {
  const result = await Swal.fire({
    title: `<div style="text-align: left;">Delete ${collectionName}<hr style="border: 1px solid #5A5555;"></div>`,
    html: `
      <div>
        <p>Are you sure you want to delete this ${collectionName}?</p>
        <p style="margin-bottom: 2px; ">${warningMessage}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#CB2A2A',
    cancelButtonColor: '#423F3F',
    showCloseButton: true,
    allowOutsideClick: false,
    width: '460px',
  });

  if (result.isConfirmed) {
    const success = await deleteItem(collectionName, item.id);

    if (success) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: onSuccessMessage,
        showConfirmButton: false,
        timer: 5000,
        toast: true,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: `There was an error deleting the ${collectionName}. Please try again later.`,
      });
    }
  }

  return result;
};


export default ModalDelete;
