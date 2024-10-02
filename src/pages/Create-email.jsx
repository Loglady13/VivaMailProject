import React, { useState } from 'react';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor de texto
import ReactQuill from 'react-quill'; // Importar el editor de texto
import '../Styles/Email-management.css';

const CreateEmail=()=>{

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [body, setBody] = useState('');

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean'],                                       // remove formatting button
      ];

    const modules = {
        toolbar: toolbarOptions
      };
    

    
    const handleSave = () => {
      // Lógica para guardar el correo
      console.log('Guardado');
    };
  
    const handleSend = () => {
      // Lógica para enviar el correo
      console.log('Enviado');
    }

    
    return (
        <div className='NewEmail'>
            <SidebarAdmin />
            
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', border:'none', borderRadius:'5px',  }}> 
                <h1 style={{color:'white', marginBottom:'10px'}}>New Email</h1>
                <input
                    type="text"
                    placeholder="From"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius:'5px' }}
                />
                <input
                    type="text"
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius:'5px' }}
                />
                <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ width: '65%', padding: '10px', marginRight: '5px', marginBottom: '10px', borderRadius:'5px'}}
                    />
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ width: '35%', padding: '10px', marginLeft: '5px', marginBottom: '10px', borderRadius:'5px'}}
                    />
                </div>
                <div style={{  backgroundColor:'white'  }} className='divraro'>
                    <ReactQuill
                        module={modules}
                        style={{ width: 'auto', height: '210px'}}
                    />
                </div>

               

                
                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop:'60px' }} >
                    <button className="btn btn-light d-inline-block m-1" onClick={handleSave} style={{ padding: '10px 20px', background: '#333', color: '#fff', marginRight:'5px', border:'none' }}>
                        Save
                    </button>
                    <button className="btn btn-light d-inline-block m-1" onClick={handleSend} style={{ padding: '10px 20px', background: '#6a1b9a', color: '#fff', marginLeft:'5px', border:'none' }}>
                        Send
                    </button>
                </div>
            </div>
        </div>
        
    );
};
export default CreateEmail;