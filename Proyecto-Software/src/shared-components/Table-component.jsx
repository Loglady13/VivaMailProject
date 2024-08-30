import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, startAt, where } from 'firebase/firestore';
import db from '../services/credenciales.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

function TableComponent({collectionName, columnsToShow, orderField, ViewModal, EditModal, DeleteModal}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false); // Para verificar si aun sigue cargando datos
    const [lastVisible, setLastVisible] = useState(null); // Guarda el último documento visible para poder implementar la paginación, permitiendo que se carguen más datos en futuras consultas.
    const [firstVisible, setFirstVisible] = useState(null); 
    const [pageSize, setPageSize] = useState(5);  // Tamaño de la página predeterminado.
    const [isFirstPage, setIsFirstPage] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda en el search
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [firstVisiblePages, setFirstVisiblePages] = useState([]);  // Guarda el historial de primeros documentos visibles
    const [showModal, setShowModal] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const fetchTotalDocuments = async () => {
        const queryCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(queryCollection);
        return querySnapshot.size; // Número total de documentos
    };

    const fetchData = async (isNextPage = false, isPrevPage = false, search = '') => {
        setLoading(true); 
        try {

            const queryCollection = collection(db, collectionName);  // Busca si la coleccion existe, si no, la crea. 
            let queryC;

            if (search) {
                // Para la busqueda en el search
                queryC = query(queryCollection, where(orderField, '>=', search), where(orderField, '<=', search + '\uf8ff'), orderBy(orderField), limit(pageSize));

            } else if (isNextPage && lastVisible) {
                // Para la siguiente pagina
                queryC = query(queryCollection, orderBy(orderField), startAfter(lastVisible), limit(pageSize));
                //setCurrentPage(currentPage + 1);
            } else if (isPrevPage && firstVisiblePages.length > 1) {
                // Para la pagina de atras
                queryC = query(queryCollection, orderBy(orderField), startAt(firstVisiblePages[firstVisiblePages.length - 2]), limit(pageSize));
                //setCurrentPage(currentPage - 1);
            } else {
                //Primera pagina. 
                queryC = query(queryCollection, orderBy(orderField), limit(pageSize));
               //setCurrentPage(1);
            }

            const queryGetCollection = await getDocs(queryC); // Obtiene los datos de la colecciones

            if (!queryGetCollection.empty){
                const documents = queryGetCollection.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
            }));
              // Actualizamos los visores de la paginación
                if (!isPrevPage) {
                    setFirstVisible(queryGetCollection.docs[0]);
                    setFirstVisiblePages([...firstVisiblePages, queryGetCollection.docs[0]]);
                }
                setLastVisible(queryGetCollection.docs[queryGetCollection.docs.length - 1]); // Guarda el último documento visible en la página actual de resultados obtenidos desde Firebase.
                setData(documents); 

                const totalDocuments = await fetchTotalDocuments(); // Obtén el total de documentos
                setTotalPages(Math.ceil(totalDocuments / pageSize)); // Calcula el total de páginas
            } else {
                console.log('No hay nada :)');
            }

            // Para controlar la primera pagina. 
            setIsFirstPage(!isNextPage);
        } catch (err){
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Renderiza. 
    }, [collectionName, pageSize]); // Vuelve a ejecutar cuando collectionName o pageSize cambia

    const loadNext = () => {
        if (currentPage < totalPages) {
            fetchData(true);
            setCurrentPage(currentPage + 1);
        }
    };

    const loadPrev = () => { 
        if (currentPage > 1) {
            fetchData(false, true);
            setCurrentPage(currentPage - 1);
    
            // Elimina la última entrada del historial ya que estamos retrocediendo
            const newFirstVisiblePages = [...firstVisiblePages];
            newFirstVisiblePages.pop();
            setFirstVisiblePages(newFirstVisiblePages);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setData([]);  // Reseteamos los datos para cargar la nueva paginación desde el principio
        setLastVisible(null);  // Reseteamos el lastVisible para empezar desde la primera página
        fetchData();  // Volvemos a cargar la primera página
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Para la busqueda. 
    const handleSearchSubmit = (event) => {
        event.preventDefault();

        // Verificamos si hay algo en el término de búsqueda antes de ejecutar la consulta
        if (searchTerm.trim() !== '') {
            // Restablecemos la paginación cuando se realiza una búsqueda
            setSearchTerm('');
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);
    
            fetchData(false, false, searchTerm);  // Llamamos a fetchData con el término de búsqueda
        } else {
            // Si el campo de búsqueda está vacío, mostramos todos los resultados
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);
    
            fetchData();  // Llamamos a fetchData sin ningún término de búsqueda
        }
    };

    // Componentes de los botones de Ver, editar y eliminar. 
    const handleViewClick = (itemId) => {
        console.log("Ver documento con id:", itemId);
        setShowModal('view');
        setSelectedId(itemId);
    };

    const handleEditClick = (itemId) => {
        console.log("Editar documento con id:", itemId);
        setShowModal('edit');
        setSelectedId(itemId);
    };

    const handleDeleteClick = (itemId) => {
        console.log("Eliminar documento con id:", itemId);
        setShowModal('delete');
        setSelectedId(itemId);
    };

    const handleCloseClick = () => {
        setShowModal(null);
        setSelectedId(null);
    }; 
    
    return (
        <div className="container mt-4">
            <h1>{collectionName}</h1>
            
            {/* Barra de búsqueda */}
            <form onSubmit={handleSearchSubmit} className="form-inline mb-3 d-flex justify-content-end">
                <div className='input-group mb-3' style={{maxWidth:'300px'}}>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchTerm}
                        onChange={handleSearchChange} 
                        className="form-control"
                        style={{width: '20%'}}
                    />
                    <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-search" style={{top: '50%', right: '10px'}}></i>
                    </span>
                </div>
            </form>
        
            <div className="table-responsive rounded">
                <table className="table table-hover ">
                    <thead className="thead-dark">
                        <tr>
                            {columnsToShow.map((column) => (
                                <th className='text-white' style={{background:'#222527'}} key={column}>{column}</th>
                            ))}
                            <th className='text-white' style={{background:'#222527'}}>View More</th>
                            <th className='text-white' style={{background:'#222527'}}>Edit</th>
                            <th className='text-white' style={{background:'#222527'}}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                {columnsToShow.map((column) => (
                                    <td  key={column}>{item[column]}</td>
                                ))}
                                <td>
                                    <button onClick={() => handleViewClick(item.id)} className="btn btn-success btn-sm">
                                        <i className="bi bi-three-dots" style={{ fontSize: '18px', color: 'white' }}></i>
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(item.id)} className="btn btn-warning btn-sm">
                                        <i className="bi bi-pencil" style={{ fontSize: '18px', color: 'white' }}></i>
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteClick(item.id)} className="btn btn-danger btn-sm">
                                        <i className="bi bi-trash3" style={{ fontSize: '18px', color: 'white' }}></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
            {/* Mostrar el modal correspondiente según el estado y pasar el id */}
            {showModal === 'ver' && <ViewModal id={selectedId} onClose={handleCloseClick} />}
            {showModal === 'editar' && <EditModal id={selectedId} onClose={handleCloseClick} />}
            {showModal === 'eliminar' && <DeleteModal id={selectedId} onClose={handleCloseClick} />}
        
            <div className="d-flex justify-content-between align-items-center mt-3">
                <span className='font-weight-bold'>Showing {currentPage} of {totalPages} entries</span>
                <div className='d-flex justify-content-between align-items-center'>
                    <button onClick={loadPrev} disabled={currentPage === 1 || loading} className="btn btn-light d-inline-block" style={{background:'rgba(255, 255, 255, 0.5)' }}>
                        Prev
                    </button>
                    <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control d-inline-block" style={{ width: '22.5%', height: '38.5px'}}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <button onClick={loadNext} disabled={currentPage >= totalPages || loading} className="btn btn-light d-inline-block" style={{background:'rgba(255, 255, 255, 0.5)' }}>
                        Next
                    </button>
                </div>
            </div>
        </div>    
    );
}

export default TableComponent 