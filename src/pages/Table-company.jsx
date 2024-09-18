import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import '../Styles/Background-Table.css'
import Swal from 'sweetalert2';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId, removeCompanyFromUser, checkIfEmailCompanyExists, updateCompany, fetchCompanyData, fetchTotalDocumentsCompany} from '../services/provider.js';

const TableCompany = () => {

    const [data, setData] = useState([]); // Holds the data to display in the table
    const [loading, setLoading] = useState(false); // Indicates if data is being fetched
    const [lastVisible, setLastVisible] = useState(null); // Tracks the last document fetched for pagination
    const [fistVisible, setFirstVisible] = useState(null);
    const [pageSize, setPageSize] = useState(5); // Number of items per page
    const [isFirstPage, setIsFirstPage] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Tracks the current page number
    const [totalPages, setTotalPages] = useState(0); // Tracks the total number of pages
    const [searchTerm, setSearchTerm] = useState(''); // Tracks the search term input by the user
    const [firstVisiblePages, setFirstVisiblePages] = useState([]);  // Stores the history of first visible documents 

    const navigate = useNavigate();
    const userId = getCurrentUserId();

    const fetchData = async (isNextPage = false, isPrevPage = false) => {
        setLoading(true);
        try {
            const result = await fetchCompanyData(userId, pageSize, searchTerm, lastVisible, firstVisiblePages, isNextPage, isPrevPage);
            setData(result.documents);
            setFirstVisible(result.firstVisible);
            setLastVisible(result.lastVisible);

            const totalDocuments = await fetchTotalDocumentsCompany(userId);
            setTotalPages(Math.ceil(totalDocuments / pageSize));
            setIsFirstPage(!isNextPage);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId, pageSize]);

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
            fetchData(false, true);  // Fetches previous page data
            setCurrentPage(currentPage - 1);  // Decrements the current page number

            // Removes the last entry from the history since we are going back
            const newFirstVisiblePages = [...firstVisiblePages];
            newFirstVisiblePages.pop();
            setFirstVisiblePages(newFirstVisiblePages);
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
        // Checks if the search term is not empty before executing the query
        if (searchTerm.trim() !== '') {
            // Resets pagination when a search is performed
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);
            fetchData(false, false, searchTerm);  // Calls fetchData with the search term
        } else {
            // If the search field is empty, show all results
            setData([]);
            setLastVisible(null);
            setFirstVisible(null);
            setCurrentPage(1);  // Reinicia el número de la página actual
            fetchData();  // Calls fetchData without any search term

        }
    };

    // To format the date to show it
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    /* Call to the see more modal, each entry has its label (what it says is shown) and its value (in this case the name assigned to 
    the fields after the get query to the base) */
    const handleViewClick = (item) => {
        ModalViewMore({
            title: 'Company Details',
            fields: [
                { label: 'Company name', key: 'name' },
                { label: 'Legal identification number', key: 'legalID' },
                { label: 'Company email', key: 'email' },
                { label: 'Creation date', key: 'creationDate', format: formatTimestamp },
                { label: 'Last update date', key: 'lastUpdate', format: formatTimestamp },
                { label: 'State', key: 'state', format: (value) => (value ? 'Active' : 'Inactive') }
            ],
            data: item
        });
    };

    //Edit modal 
    const handleEditClick = async (item) => {
        const { value: formValues } = await Swal.fire({
            html: `
                <div style="text-align: left; margin-left: 38px; margin-top: 30px;">
                    <h4 style="margin-bottom: 45px; font-weight: bold;">Edit Company</h4>
                    <div style="margin-bottom: 25px;">
                        <label for="swal-input1" style="display: block; margin-bottom: 5px;">New company name</label>
                        <input id="swal-input1" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.name}">
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label for="swal-input2" style="display: block; margin-bottom: 5px;">New company email</label>
                        <input id="swal-input2" class="swal2-input" style="width: 92%; margin: 0; background: #FFFFFF;" value="${item.email}">
                    </div> 
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#35D79C',
            cancelButtonColor: '#DE3232',
            showCloseButton: true,
            background: '#DFD8E2',
            width: '650px',
            allowOutsideClick: false,
            customClass: {
                container: 'swal2-container',
                popup: 'swal2-popup',
            },
            preConfirm: async () => {
                const name = Swal.getPopup().querySelector('#swal-input1').value;
                const email = Swal.getPopup().querySelector('#swal-input2').value;

                // Check if any fields are empty
                if (!name || !email) {
                    Swal.showValidationMessage('Please enter both fields');
                    return false; // Prevent submission if validation fails
                }

                try {
                    // Check if the email is already used by another company
                    const emailExists = await checkIfEmailCompanyExists(email, item.id);

                    if (emailExists) {
                        // Show error message if the email is already used
                        Swal.showValidationMessage('This email is already used by another company.');
                        return false; // Prevent submission if email is taken
                    }

                    // Return the values if all checks pass
                    return { name, email };
                } catch (error) {
                    Swal.showValidationMessage('Error checking data. Please try again later.');
                    return false; // Prevent submission if an error occurs
                }
            }
        });

        if (formValues) {
            // Update the company data if no conflicts
            const updatedData = {
                name: formValues.name,
                email: formValues.email,
                lastUpdate: new Date(), // Set the update date
            };
            
            try {
                await updateCompany(item.id, updatedData);
                // Show success message after updating
                Swal.fire({
                    position: 'top-end', // Position in the top right corner
                    icon: 'success',
                    text: 'The company has been updated',
                    showConfirmButton: false, // Remove the confirm button
                    timer: 5000, // Message will disappear after 5 seconds
                    toast: true, // Convert the alert into a toast notification
                });
            } catch (error) {
                await Swal.fire({icon: 'error', title: 'Update Failed', text: 'There was an error updating the company. Please try again later.', });
            }
        }
    };

    /* Call to the delete modal, you need to pass de name of the collection, an extra warning message and the messagge you want
    to show when the action success*/
    const handleDeleteClick = (item) => {
        ModalDelete({
            item,
            collectionName: 'Company',
            warningMessage: 'You will lose everything',
            onSuccessMessage: 'The company has been deleted!',
        });
        removeCompanyFromUser(item.id);
    };

    const handleCreateClick = () => {
        navigate('/CreateCompany');
    };


    return (
        <div className='Background-Table'>
            <SidebarAdmin />
            <div className="container-md" >
                <h1 className='text-white' >Company</h1>    

                <form onSubmit={handleSearchSubmit} className="form-inline mb-3 d-flex align-items-center justify-content-end" >

                    <button type="button" className="btn btn-success me-5" style={{ fontSize: '18px' }} onClick={handleCreateClick}>
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
                                    <th className='text-white' style={{ background: '#222527', width: '26%' }}> Name </th>
                                    <th className='text-white' style={{ background: '#222527', width: '26%' }}> Email </th>
                                    <th className='text-white' style={{ background: '#222527', width: '26%' }}> State </th>
                                    <th className='text-white' style={{ background: '#222527', width: '8%' }}>More</th>
                                    <th className='text-white' style={{ background: '#222527', width: '8%' }}>Edit</th>
                                    <th className='text-white' style={{ background: '#222527', width: '8%' }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ textAlign: "center" }}>{item.name}</td>
                                        <td style={{ textAlign: "center" }}>{item.email}</td>
                                        <td style={{ textAlign: "center" }}>{item.state ? 'Active' : 'Inactive'}</td>
                                        <td className='text-center'>
                                            <button onClick={() => handleViewClick(item)} className="btn btn-primary btn-sm">
                                                <i className="bi bi-three-dots" style={{ fontSize: '18px', color: 'white' }}></i>
                                            </button>
                                        </td>
                                        <td className='text-center'>
                                            <button onClick={() => handleEditClick(item)} className="btn btn-warning btn-sm">
                                                <i className="bi bi-pencil" style={{ fontSize: '18px', color: 'white' }}></i>
                                            </button>
                                        </td>
                                        <td className='text-center'>
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
                {/* Pagination controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className='font-weight-bold text-white'>Showing {currentPage} of {totalPages} pages</span>
                    <div className='d-flex justify-content-between align-items-center'>
                        <button onClick={loadPrev} disabled={currentPage === 1 || loading} className="btn btn-light d-inline-block m-1" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                            Prev
                        </button>
                        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control d-inline-block m-1" style={{ width: '30%', height: '38.5px', textAlign: "center"  }}>
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
        </div>
    );
};

export default TableCompany;