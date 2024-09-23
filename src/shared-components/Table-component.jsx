import React, { useEffect, useState } from 'react';
import { fetchTotalDocuments, fetchData, subscribeToCollection } from '../services/provider.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

function TableComponent({ tittle, collectionName, columnName, columnsToShow, handleViewClick, handleEditClick, handleDeleteClick, handleCreateClick }) {
    const [data, setData] = useState([]);  // State to hold the fetched data
    const [loading, setLoading] = useState(false);  // Indicates if data is still being loaded
    const [lastVisible, setLastVisible] = useState(null);  // Stores the last visible document for pagination
    const [firstVisible, setFirstVisible] = useState(null);  // Stores the first visible document
    const [pageSize, setPageSize] = useState(5);  // Default page size
    const [isFirstPage, setIsFirstPage] = useState(true);  // Indicates if it's the first page
    const [searchTerm, setSearchTerm] = useState('');  // State for the search term
    const [currentPage, setCurrentPage] = useState(1);  // Current page number
    const [totalPages, setTotalPages] = useState(0);  // Total number of pages
    const [firstVisiblePages, setFirstVisiblePages] = useState([]);  // Stores the history of first visible documents

    const loadData = async (isNextPage = false, isPrevPage = false) => {
        setLoading(true);
        try {
            const result = await fetchData({ collectionName, searchTerm,columnsToShow, lastVisible,isNextPage,isPrevPage, firstVisiblePages, pageSize });
            setData(result.documents);
            setLastVisible(result.lastVisible);

            if (!isPrevPage) {
                setFirstVisiblePages([...firstVisiblePages, result.firstVisible]);
            }

            const totalDocuments = await fetchTotalDocuments(collectionName);
            setTotalPages(Math.ceil(totalDocuments / pageSize));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        subscribeToCollection(collectionName, setData, loadData);
    }, [collectionName, pageSize]);

    const loadNext = () => {
        if (currentPage < totalPages) {
            loadData(true);  // Fetches next page data
            setCurrentPage(currentPage + 1);  // Increments the current page number
        }
    };

    const loadPrev = () => {
        if (currentPage > 1) {
            loadData(false, true);  // Fetches previous page data
            setCurrentPage(currentPage - 1);  // Decrements the current page number

            // Removes the last entry from the history since we are going back
            const newFirstVisiblePages = [...firstVisiblePages];
            newFirstVisiblePages.pop();
            setFirstVisiblePages(newFirstVisiblePages);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));  // Updates the page size
        setData([]);  // Clears the current data
        setLastVisible(null);  // Resets lastVisible
        loadData();  // Fetches data with the new page size
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);  // Updates the search term
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Checks if the search term is not empty before executing the query
        if (searchTerm.trim() !== '') {
            // Resets pagination when a search is performed
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);
            loadData(false, false, searchTerm);  // Calls fetchData with the search term
        } else {
            // If the search field is empty, show all results
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);
            setCurrentPage(1);  // Reinicia el número de la página actual
            loadData();  // Calls fetchData without any search term

        }
    };

    return (
        <div className="container mt-4">
            <h1 className='text-white'>{tittle}</h1>

            <form onSubmit={handleSearchSubmit} className="form-inline mb-3 d-flex align-items-center justify-content-end" >
                <button onClick={() => { handleCreateClick() }} type="button" className="btn btn-success me-5" style={{ fontSize: '18px' }}>
                    <i className="bi bi-plus-square" style={{ color: 'white' }}></i>
                </button>

                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} className="form-control" />
                    <button className="input-group-text">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive rounded">
                    <table className="table table-hover">
                        <thead className="thead-dark text-center">
                            <tr>
                                {columnName.map((column) => (
                                    <th className='text-white' style={{ background: '#222527' }} key={column}>{column}</th>
                                ))}
                                <th className='text-white' style={{ background: '#222527', width: '8%' }}>More</th>
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
                                        <button onClick={() => handleViewClick(item)} className="btn btn-primary btn-sm">
                                            <i className="bi bi-three-dots" style={{ fontSize: '18px', color: 'white' }}></i>
                                        </button>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button onClick={() => handleEditClick(item)} className="btn btn-warning btn-sm">
                                            <i className="bi bi-pencil" style={{ fontSize: '18px', color: 'white' }}></i>
                                        </button>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button onClick={() => handleDeleteClick(item)} className="btn btn-danger btn-sm">
                                            <i className="bi bi-trash3" style={{ fontSize: '18px', color: 'white' }}></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <span className='font-weight-bold text-white'>Showing {currentPage} of {totalPages} pages</span>
                <div className='d-flex justify-content-between align-items-center'>
                    <button onClick={loadPrev} disabled={currentPage === 1 || loading} className="btn btn-light d-inline-block m-1" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        Prev
                    </button>
                    <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control d-inline-block m-1" style={{ width: '30%', height: '38.5px', textAlign: "center" }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <button onClick={loadNext} disabled={currentPage === totalPages || loading} className="btn btn-light d-inline-block m-1" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TableComponent;