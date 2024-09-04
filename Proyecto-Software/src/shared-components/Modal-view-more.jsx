// CustomModal.js
import React from 'react';
import Swal from 'sweetalert2';

const ModalViewMore = ({ title, fields, data }) => {
  const generateHtmlContent = () => {
    return `
      <style>
        .swal2-container .info-row {
          display: flex;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
          align-items: center;
        }
        .swal2-container .info-row:nth-child(even) {
          background-color: #F5F5F5;
        }
        .swal2-container .label {
          font-weight: bold;
          width: 40%;
          margin-right: 10px;
          text-align: left;
          padding-left: 10px;
        }
        .swal2-container .value {
          flex: 1;
          text-align: left;
          padding-left: 40px;
          padding-right: 10px;
        }
      </style>
      <div class="container p-3">
        <h4 class="text-left mb-4" style="text-align: left;"><strong>${title}</strong></h4>
        <div class="bg-white rounded">
          ${fields.map(field => `
            <div class="info-row">
              <span class="label">${field.label}</span>
              <span class="value">${field.format ? field.format(data[field.key]) : data[field.key]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  Swal.fire({
    html: generateHtmlContent(),
    showConfirmButton: false,
    showCloseButton: true,
    allowOutsideClick: false,
    background: '#DFD8E2',
    width: '750px'
  });
};

export default ModalViewMore;
