import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, startAfter, startAt, where} from 'firebase/firestore';
import { db } from '../services/credenciales.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

function TableComponent({ collectionName, columnName, columnsToShow, handleViewClick, handleEditClick, handleDeleteClick }) {
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

    const fetchTotalDocuments = async () => {
        const queryCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(queryCollection);
        return querySnapshot.size;
    };

    const fetchData = async (isNextPage = false, isPrevPage = false) => {
        setLoading(true);
        try {
            const queryCollection = collection(db, collectionName);  // Checks if the collection exists, if not, creates it
            let queryC;

            if (searchTerm) {
                // Handles search functionality
                queryC = query(queryCollection, where(columnsToShow[0], '>=', searchTerm), where(columnsToShow[0], '<=', searchTerm + '\uf8ff'), limit(pageSize));
            } else if (isNextPage && lastVisible) {
                // Handles next page functionality
                queryC = query(queryCollection, startAfter(lastVisible), limit(pageSize));
            } else if (isPrevPage && firstVisiblePages.length > 1) {
                // Handles previous page functionality
                queryC = query(queryCollection, startAt(firstVisiblePages[firstVisiblePages.length - 2]), limit(pageSize));
            } else {
                // Loads the first page
                queryC = query(queryCollection, limit(pageSize));
            }

            const queryGetCollection = await getDocs(queryC);
            if (!queryGetCollection.empty) {
                const documents = queryGetCollection.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                if (!isPrevPage) {
                    setData(documents);
                    setFirstVisible(queryGetCollection.docs[0]);
                    setFirstVisiblePages([...firstVisiblePages, queryGetCollection.docs[0]]);
                }
                setLastVisible(queryGetCollection.docs[queryGetCollection.docs.length - 1]); // Updates lastVisible
                setData(documents);

                const totalDocuments = await fetchTotalDocuments();
                setTotalPages(Math.ceil(totalDocuments / pageSize));
            } else {
                console.log('No data found');
            }
            setIsFirstPage(!isNextPage);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();  // Fetches data when component mounts or when collectionName or pageSize changes
    }, [collectionName, pageSize]);

    const loadNext = () => {
        if (currentPage < totalPages) {
            fetchData(true);  // Fetches next page data
            setCurrentPage(currentPage + 1);  // Increments the current page number
        }
    };

    const loadPrev = () => {
        if (currentPage > 1) {
            fetchData(false, true);  // Fetches previous page data
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
        fetchData();  // Fetches data with the new page size
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
            fetchData(false, false, searchTerm);  // Calls fetchData with the search term
            console.log(searchTerm);
        } else {
            // If the search field is empty, show all results
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);

            fetchData();  // Calls fetchData without any search term
        }
    };

    return (
        <div className="container mt-4">
            <h1 className='text-white'>{collectionName}</h1>

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
                                    <button onClick={() => handleViewClick(item)} className="btn btn-success btn-sm">
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

            <div className="d-flex justify-content-between align-items-center mt-3">
                <span className='font-weight-bold text-white'>Showing {currentPage} of {totalPages} pages</span>
                <div className='d-flex justify-content-between align-items-center'>
                    <button onClick={loadPrev} disabled={currentPage === 1 || loading} className="btn btn-light d-inline-block m-1" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                        Prev
                    </button>
                    <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control d-inline-block m-1" style={{ width: '30%', height: '38.5px',  textAlign: "center"  }}>
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
