import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, startAfter, startAt } from 'firebase/firestore';
import { db } from '../services/credenciales.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

function TableComponent({ collectionName, columnName, columnsToShow, ViewModal, EditModal, DeleteModal }) {
    const [data, setData] = useState([]); // Holds the data to display in the table
    const [loading, setLoading] = useState(false); // Indicates if data is being fetched
    const [lastVisible, setLastVisible] = useState(null); // Tracks the last document fetched for pagination
    const [pageSize, setPageSize] = useState(5); // Number of items per page
    const [currentPage, setCurrentPage] = useState(1); // Tracks the current page number
    const [totalPages, setTotalPages] = useState(0); // Tracks the total number of pages
    const [searchTerm, setSearchTerm] = useState(''); // Tracks the search term input by the user
    const [showModal, setShowModal] = useState(null); // Controls which modal (view, edit, delete) is displayed
    const [selectedId, setSelectedId] = useState(null); // Tracks the ID of the selected item for modals

    // Fetches the total number of documents in the collection to calculate total pages
    const fetchTotalDocuments = async () => {
        const queryCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(queryCollection);
        return querySnapshot.size;
    };

    // Fetches data from Firestore, either with search, next, or previous page
    const fetchData = async (isNextPage = false, isPrevPage = false) => {
        setLoading(true); // Start loading
        try {
            const queryCollection = collection(db, collectionName);
            let queryC;

            if (searchTerm) {
                queryC = query(queryCollection, limit(pageSize)); // Search scenario
            } else if (isNextPage && lastVisible) {
                queryC = query(queryCollection, startAfter(lastVisible), limit(pageSize)); // Pagination: Next page
            } else if (isPrevPage && currentPage > 1) {
                queryC = query(queryCollection, startAt(lastVisible), limit(pageSize)); // Pagination: Previous page
            } else {
                queryC = query(queryCollection, limit(pageSize)); // Initial load
            }

            const queryGetCollection = await getDocs(queryC);
            if (!queryGetCollection.empty) {
                const documents = queryGetCollection.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLastVisible(queryGetCollection.docs[queryGetCollection.docs.length - 1]); // Set last visible document for pagination
                setData(documents);

                const totalDocuments = await fetchTotalDocuments();
                setTotalPages(Math.ceil(totalDocuments / pageSize)); // Calculate total pages
            } else {
                console.log('No data found');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch data when component mounts or when collectionName or pageSize changes
    useEffect(() => {
        fetchData();
    }, [collectionName, pageSize]);

    // Load the next page of data
    const loadNext = () => {
        if (currentPage < totalPages) {
            fetchData(true);
            setCurrentPage(currentPage + 1); // Increment current page
        }
    };

    // Load the previous page of data
    const loadPrev = () => {
        if (currentPage > 1) {
            fetchData(false, true);
            setCurrentPage(currentPage - 1); // Decrement current page
        }
    };

    // Handle the change in page size (number of items per page)
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value)); // Update page size
        setData([]); // Clear existing data
        setLastVisible(null); // Reset last visible for fresh fetch
        fetchData(); // Fetch new data
    };

    // Update search term as user types
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle search form submission
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setData([]); // Clear existing data
        setLastVisible(null); // Reset last visible for fresh fetch
        fetchData(); // Fetch new data based on search term
    };

    // Open the view modal with the selected item ID
    const handleViewClick = (itemId) => {
        setShowModal('view');
        setSelectedId(itemId);
    };

    // Open the edit modal with the selected item ID
    const handleEditClick = (itemId) => {
        setShowModal('edit');
        setSelectedId(itemId);
    };

    // Open the delete modal with the selected item ID
    const handleDeleteClick = (itemId) => {
        setShowModal('delete');
        setSelectedId(itemId);
    };

    // Close any open modal
    const handleCloseClick = () => {
        setShowModal(null);
        setSelectedId(null);
    };

    return (
        <div className="container mt-4">
            <h1>{collectionName}</h1>

            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="form-inline mb-3 d-flex justify-content-end">
                <div className='input-group mb-3' style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </form>

            {/* Data table */}
            <div className="table-responsive rounded">
                <table className="table table-hover">
                    <thead className="thead-dark text-center">
                        <tr>
                            {columnName.map((column) => (
                                <th className='text-white' style={{ background: '#222527' }} key={column}>{column}</th>
                            ))}
                            <th className='text-white' style={{ background: '#222527', width: '8%' }}>View More</th>
                            <th className='text-white' style={{ background: '#222527', width: '8%' }}>Edit</th>
                            <th className='text-white' style={{ background: '#222527', width: '8%' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                {columnsToShow.map((column) => (
                                    <td key={column} style={{ textAlign: "center" }}>{item[column]}</td>
                                ))}
                                <td style={{ textAlign: "center" }}>
                                    <button onClick={() => handleViewClick(item.id)} className="btn btn-success btn-sm">
                                        <i className="bi bi-three-dots" style={{ fontSize: '18px', color: 'white' }}></i>
                                    </button>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <button onClick={() => handleEditClick(item.id)} className="btn btn-warning btn-sm">
                                        <i className="bi bi-pencil" style={{ fontSize: '18px', color: 'white' }}></i>
                                    </button>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <button onClick={() => handleDeleteClick(item.id)} className="btn btn-danger btn-sm">
                                        <i className="bi bi-trash3" style={{ fontSize: '18px', color: 'white' }}></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals for view, edit, delete */}
            {showModal === 'view' && <ViewModal id={selectedId} onClose={handleCloseClick} />}
            {showModal === 'edit' && <EditModal id={selectedId} onClose={handleCloseClick} />}
            {showModal === 'delete' && <DeleteModal id={selectedId} onClose={handleCloseClick} />}

            {/* Pagination controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <span className='font-weight-bold'>Showing {currentPage} of {totalPages} entries</span>
                <div className='d-flex justify-content-between align-items-center'>
                    <button onClick={loadPrev} disabled={currentPage === 1 || loading} className="btn btn-light d-inline-block" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        Prev
                    </button>
                    <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control d-inline-block" style={{ width: '22.5%', height: '38.5px' }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <button onClick={loadNext} disabled={currentPage === totalPages || loading} className="btn btn-light d-inline-block" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TableComponent;
