import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/credentials';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../Styles/Create-client-mail.css'

const CreateClientMail = () => {

     /* To redirect to the home page from the cancel button */
    const navigate = useNavigate();

     /* To set inputs as empty after a creation */
    const defaultEntry = {
        nameClient: '',
        emailClient: '',
        idAdmin: ''
    };

    const [clientEmail, setClientEmail] = useState(defaultEntry);
    const [errors, setErrors] = useState({ nameClient: '', emailClient: '', idAdmin: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const captureInputs = (e) => {
        const { name, value } = e.target;
        setClientEmail({ ...clientEmail, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const checkIfClientEmailExists = async (emailClient) => {
        const q = query(collection(db, 'EmailClient'), where('emailClient', '==', emailClient));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const ValidateInputs = (isFileUpload = false) => {
        const newErrors = { nameClient: '', emailClient: '', idAdmin: '' };
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

            if (!clientEmail.idAdmin) {
                newErrors.idAdmin = 'Id Admin is required.';
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
                    const { nameClient, emailClient, idAdmin } = entry; // Extraer `nameClient`, `emailClient` y `idAdmin` de cada entrada.
    
                    if (!nameClient || !emailClient || !idAdmin) {
                        // Verificar si alguno de los campos es nulo o está vacío.
                        console.warn(`Incomplete entry in the Excel file, will be ignored: ${JSON.stringify(entry)}`);
                        // Mostrar una advertencia en la consola si la entrada está incompleta y continuar con la siguiente entrada.
                        success = false; // Marcar el éxito como `false` porque hay un error.
                        continue;
                    }
    
                    const emailExists = await checkIfClientEmailExists(emailClient);
                    // Verificar si el email ya existe en la base de datos.
                    if (emailExists) {
                        console.warn(`The email ${emailClient} already exists, will be ignored.`);
                        // Mostrar una advertencia en la consola si el email ya existe y continuar con la siguiente entrada.
                        success = false; // Marcar el éxito como `false` porque hay un error.
                        continue;
                    }
    
                    try {
                        // Intentar agregar un nuevo documento en la colección 'EmailClient' en la base de datos.
                        await addDoc(collection(db, 'EmailClient'), {
                            nameClient, // Nombre del cliente.
                            emailClient, // Email del cliente.
                            idAdmin, // ID del administrador.
                            creationDate: currentDate, // Fecha de creación.
                            lastUpdate: currentDate, // Última fecha de actualización.
                            state: false, // Estado inicial del cliente.
                        });
                        console.log(`Client ${nameClient} added successfully.`);
                        // Mostrar un mensaje de éxito en la consola si se agrega correctamente.
                    } catch (error) {
                        console.error(`Error adding client ${nameClient}:`, error);
                        // Mostrar un mensaje de error en la consola si ocurre un problema al agregar.
                        success = false; // Marcar el éxito como `false` debido al error.
                    }
                }
    
                if (success) {
                    // Si todo fue exitoso, mostrar un modal de éxito con SweetAlert2.
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        showCloseButton: true,
                        html: 'The clients have been successfully created',
                    }).then(() => setIsSuccess(true));
                    
                    navigate('/TableClientMail')// Marcar `isSuccess` como `true` después de cerrar el modal.
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
                const currentDate = new Date(); // Obtener la fecha y hora actuales.
                await addDoc(collection(db, 'EmailClient'), {
                    ...clientEmail, // Agregar los datos del cliente manual.
                    creationDate: currentDate, // Fecha de creación.
                    lastUpdate: currentDate, // Última fecha de actualización.
                    state: false, // Estado inicial del cliente.
                });
                setErrors({ nameClient: '', emailClient: '', idAdmin: '' });
                // Limpiar los errores después de agregar exitosamente.
                setClientEmail(defaultEntry); // Restablecer los datos del cliente.
                setIsSuccess(true); // Marcar `isSuccess` como `true` para indicar éxito.
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

    return (
        <div className='NewClient'>
            <SidebarAdmin />
            <div className="container-md" style={{ background: 'black', width: '50%', padding: '40px', borderRadius: '10px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '50px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="fs-2 text-white" style={{ textAlign: 'left' }}>New Client</p>
                </div>
                <form onSubmit={saveClientEmail} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="nameClient" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the name of the client</label>
                        <input onChange={captureInputs} value={clientEmail.nameClient} type="text" name='nameClient' className="form-control" style={{ width: '100%' }} />
                        {errors.nameClient && <div className='text-danger'>{errors.nameClient}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="emailClient" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Enter the email of the client</label>
                        <input onChange={captureInputs} value={clientEmail.emailClient} type="text" name='emailClient' className="form-control" aria-describedby="emailHelp" style={{ width: '100%' }} />
                        {errors.emailClient && <div className='text-danger'>{errors.emailClient}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="idAdmin" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Id Administrator</label>
                        <input onChange={captureInputs} value={clientEmail.idAdmin} type="text" name='idAdmin' className="form-control" style={{ width: '100%' }} />
                        {errors.idAdmin && <div className='text-danger'>{errors.idAdmin}</div>}
                    </div>
                    <div className="mb-3" style={{ width: '100%', maxWidth: '800px' }}>
                        <label htmlFor="excelFile" className="form-label fs-6 text-white" style={{ textAlign: 'center' }}>Upload Excel File (If you want to create more than one at time)</label>
                        <input type="file" id="excelFile" name="excelFile" className="form-control" style={{ width: '100%' }} accept=".xlsx, .xls" onChange={selectedExcel} />
                    </div>
                    {uploadedFile && (
                        <div style={{ marginTop: '10px' }}>
                            <span className="text-white">{uploadedFile.name}</span>
                            <button type="button" className="btn btn-danger ms-3" onClick={removeUploadedFile}>Remove</button>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '800px', marginTop: '18px', marginBottom: '-10px' }}>
                        <button type='button' className="btn btn-primary" style={{ backgroundColor: '#DE3232', border: 'none', margin: '5px', width: '90px', height: '40px' }} onClick={() => navigate('/HomeAdmin')}>Cancel</button>
                        <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#35D79C', border: 'none', margin: '5px', width: '90px', height: '40px' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClientMail;
