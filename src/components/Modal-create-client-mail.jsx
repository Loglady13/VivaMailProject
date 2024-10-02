import React, {useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import { checkIfClientEmailExists, createClientMail } from '../services/provider';
import {createClient, create} from '../shared-components/WordsBank';
import * as XLSX from 'xlsx';
const ModalCreateClientMail = ({isOpen, onClose}) =>{

     /* To set inputs as empty after a creation */
     const defaultEntry = {
        nameClient: '',
        emailClient: ''
    };

    const [clientEmail, setClientEmail] = useState(defaultEntry);
    const [errors, setErrors] = useState({ nameClient: '', emailClient: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setClientEmail({ ...clientEmail, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const ValidateInputs = (isFileUpload = false) => {
        const newErrors = { nameClient: '', emailClient: ''};
        let isValid = true;
        const noNumbers = /^\D{3,}/;
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isFileUpload) {
            if (!clientEmail.nameClient) {
                newErrors.nameClient = 'Name client is required.';
                isValid = false;
            } else if (!noNumbers.test(clientEmail.nameClient)) {
                newErrors.nameClient = 'The field name client must have only letters';
                isValid = false;
            }

            if (!clientEmail.emailClient) {
                newErrors.emailClient = 'Email client is required.';
                isValid = false;
            } else if (!emailFormat.test(clientEmail.emailClient)) {
                newErrors.emailClient = 'Please enter a valid email format including @ and .example.';
                isValid = false;
            }
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
                html: 'The client has been successfully created',
            }).then(() => setIsSuccess(false)); // Resetting the status after displaying the alert
        }
    }, [isSuccess]);

    // Reset inputs when modal closes
    const handleClose = () => {
        setClientEmail(defaultEntry); // Reset the form fields
        setErrors({ nameClient:'', emailClient:''}); // Clear errors
        onClose(); // Trigger the close passed down as a prop
    };

    const saveClientEmail = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario al enviar.
    
        if (!ValidateInputs(selectedFile !== null)) {
            // Validar si el archivo seleccionado no es nulo.
            // Si la validación falla, salir de la función.
            return;
        }
    
        if (selectedFile) { // Verificar si se ha seleccionado un archivo.
            const reader = new FileReader(); // Crear un nuevo lector de archivos.
            reader.onload = async (event) => {
                // Cuando el archivo ha sido cargado (leído)...
                const data = new Uint8Array(event.target.result); // Convertir el archivo en un arreglo de bytes.
                const workbook = XLSX.read(data, { type: 'array' }); // Leer el archivo Excel en un objeto `workbook`.
                const sheetName = workbook.SheetNames[0]; // Obtener el nombre de la primera hoja de cálculo.
                const worksheet = workbook.Sheets[sheetName]; // Obtener la hoja de cálculo específica.
                const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convertir la hoja de cálculo en formato JSON.
    
                let success = true; // Indicador de éxito inicializado como `true`.
                const currentDate = new Date(); // Obtener la fecha y hora actuales.
    
                for (const entry of jsonData) { // Iterar sobre cada entrada en el JSON.
                    const { nameClient, emailClient} = entry; // Extraer `nameClient`, `emailClient` y `idAdmin` de cada entrada.
    
                    if (!nameClient || !emailClient) {
                        // Verificar si alguno de los campos es nulo o está vacío.
                        console.warn(`Incomplete entry in the Excel file, will be ignored: ${JSON.stringify(entry)}`);
                        // Mostrar una advertencia en la consola si la entrada está incompleta y continuar con la siguiente entrada.
                        success = false; // Marcar el éxito como `false` porque hay un error.
                        continue;
                    }
    
                    const emailExists = await checkIfClientEmailExists(clientEmail.emailClient);
                    // Verificar si el email ya existe en la base de datos.
                    if (emailExists) {
                        console.warn(`The email ${clientEmail.emailClient} already exists, will be ignored.`);
                        // Mostrar una advertencia en la consola si el email ya existe y continuar con la siguiente entrada.
                        success = false; // Marcar el éxito como `false` porque hay un error.
                        continue;
                    }
    
                    try {
                        createClientMail(entry);
                        setIsSuccess(true); // Activate success alert
                        onClose();
                        console.log(`Client ${nameClient} added successfully.`);
                        // Mostrar un mensaje de éxito en la consola si se agrega correctamente.
                    } catch (error) {
                        console.error(`Error adding client ${nameClient}:`, error);
                        // Mostrar un mensaje de error en la consola si ocurre un problema al agregar.
                        success = false; // Marcar el éxito como `false` debido al error.
                    }
                }
    
            };
            reader.readAsArrayBuffer(selectedFile); // Leer el archivo como un ArrayBuffer.
        } else { // Si no se seleccionó un archivo, manejar la entrada manual.
            const emailExists = await checkIfClientEmailExists(clientEmail.emailClient);
            // Verificar si el email del cliente ya existe.
            if (emailExists) {
                setErrors({ ...errors, emailClient: 'A client with this email already exists.' });
                // Establecer un mensaje de error si el email ya existe.
                return;
            }
    
            try {
                createClientMail(clientEmail);
                setIsSuccess(true); // Activate success alert
                onClose();
                setErrors({ nameClient: '', emailClient: ''});
                // Limpiar los errores después de agregar exitosamente.
                setClientEmail(defaultEntry); // Restablecer los datos del cliente.
            } catch (error) {
                console.log(error);
                setErrors({ ...errors, global: 'An error occurred while saving the client' });
                // Establecer un mensaje de error global si ocurre un problema al guardar.
            }
        }
    };
    
    const selectedExcel = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setUploadedFile(file);
    }

    const removeUploadedFile = () => {
        setUploadedFile(null);
        setSelectedFile(null);
        document.getElementById('excelFile').value = null;
    };

    return(
        <div className={`modal ${isOpen ? 'd-block' : 'd-none'}`} style={{ background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '50px' }}>
            <div className="modal-dialog" style={{ margin: 'auto', maxWidth: '100%', width: '640px' }}>
                <div className="modal-content" style={{ background: 'black', padding: '28px', borderRadius: '10px', marginBottom: '50px' }}>
                    <div class="modal-header" style={{ marginBottom: '10px' }}>
                        <span className="modal-title text-white fs-3">New Client</span>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose} style={{ filter: 'invert(1)', marginBottom: '30px' }}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={saveClientEmail}>
                            <div className="mb-3">
                                <label className="form-label text-white">{createClient.nameClient}</label>
                                <input onChange={captureInputs} value={clientEmail.nameClient} type="text" name='nameClient' className="form-control" />
                                {errors.nameClient && <div className='text-danger'>{errors.nameClient}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">{createClient.emailClient}</label>
                                <input onChange={captureInputs} value={clientEmail.emailClient} type="text" name='emailClient' className="form-control" />
                                {errors.emailClient && <div className='text-danger'>{errors.emailClient}</div>}
                            </div>
                            <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                                <label htmlFor="excelFile" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>{createClient.excelFile}</label>
                                <input type="file" id="excelFile" name="excelFile" className="form-control" style={{ width: '100%' }} accept=".xlsx, .xls" onChange={selectedExcel} />
                            </div>
                            {uploadedFile && (
                                <div style={{ marginTop: '10px' }}>
                                <span className="text-white">{uploadedFile.name}</span>
                                <button type="button" className="btn btn-danger ms-3" onClick={removeUploadedFile}>{create.remove}</button>
                            </div>
                            )}

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

export default ModalCreateClientMail