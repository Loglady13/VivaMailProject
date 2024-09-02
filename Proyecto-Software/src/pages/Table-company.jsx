import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, startAfter, startAt, doc, updateDoc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../services/credenciales.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarAdmin from '../shared-components/Sidebar-admin';
import '../Styles/Table-company.css';
import Swal from 'sweetalert2';
import ModalViewMore from '../shared-components/Modal-view-more.jsx';
import ModalDelete from '../shared-components/Modal-delete.jsx';


const TableCompany = () => {

    /*
        COSAS QUE FALTAN

        -EL MANEJO DEL ESTADO (SIMPLEMENTE ES CAMBIAR EL STATE EN LA BASE Y CON ESTADOS CAMBIO EL COLOR DEL BOTON)

    */

    const [data, setData] = useState([]); // Holds the data to display in the table
    const [loading, setLoading] = useState(false); // Indicates if data is being fetched
    const [lastVisible, setLastVisible] = useState(null); // Tracks the last document fetched for pagination
    const [pageSize, setPageSize] = useState(5); // Number of items per page
    const [currentPage, setCurrentPage] = useState(1); // Tracks the current page number
    const [totalPages, setTotalPages] = useState(0); // Tracks the total number of pages
    const [searchTerm, setSearchTerm] = useState(''); // Tracks the search term input by the user

    // Fetches the total number of documents in the collection to calculate total pages
    const fetchTotalDocuments = async () => {
        const queryCollection = collection(db, 'Company');
        const querySnapshot = await getDocs(queryCollection);
        return querySnapshot.size;
    };

    // Fetches data from Firestore, either with search, next, or previous page
    const fetchData = async (isNextPage = false, isPrevPage = false) => {
        setLoading(true); // Start loading
        try {
            const queryCollection = collection(db, 'Company');
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
                    name: doc.data().companyName,
                    email: doc.data().email,
                    legalID: doc.data().legalID,
                    state: doc.data().state,
                    creationDate: doc.data().creationDate,
                    lastUpdate: doc.data().lastUpdate,
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

    // Fetch data when component mounts or when pageSize changes
    useEffect(() => {
        fetchData();
    }, [pageSize]);

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

    //Modal Edit (This one can´t be a shared component because all  edit modals are too diferent)
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
            width: '700px',
            customClass: {
                container: 'swal2-container',
                popup: 'swal2-popup',
            },
            preConfirm: async () => {
                // Retrieve values from the inputs
                const name = Swal.getPopup().querySelector('#swal-input1').value;
                const email = Swal.getPopup().querySelector('#swal-input2').value;

                // Check if any fields are empty
                if (!name || !email) {
                    Swal.showValidationMessage('Please enter both fields');
                    return false; // Prevent submission if validation fails
                }

                try {
                    // Step 1: Check if the email is already used by another company
                    const companiesRef = collection(db, "Company");
                    const q = query(companiesRef, where("email", "==", email));
                    const querySnapshot = await getDocs(q);

                    // Check if the email belongs to a different company
                    const emailExists = querySnapshot.docs.some(doc => doc.id !== item.id);

                    if (emailExists) {
                        // Show error message if the email is already used
                        Swal.showValidationMessage('This email is already used by another company.');
                        return false; // Prevent submission if email is taken
                    }

                    // Return the values if all checks pass
                    return { name, email };
                } catch (error) {
                    // Handle any errors during data checking
                    Swal.showValidationMessage('Error checking data. Please try again later.');
                    return false; // Prevent submission if an error occurs
                }
            }
        });

        if (formValues) {
            // Step 2: Update the company data if no conflicts
            const { name, email } = formValues;
            try {
                const docRef = doc(db, "Company", item.id); // Reference to the document to update
                await updateDoc(docRef, {
                    companyName: name,
                    email: email,
                    lastUpdate: new Date(),
                });

                // Show success message after updating
                Swal.fire({
                    position: 'top-end', // Position in the top right corner
                    icon: 'success',
                    text: 'Company update done, refresh to see the changes!',
                    showConfirmButton: false, // Remove the confirm button
                    timer: 5000, // Message will disappear after 5 seconds
                    toast: true, // Convert the alert into a toast notification
                });
            } catch (error) {
                // Handle any errors during the update
                await Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'There was an error updating the company. Please try again later.',
                });
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
            onSuccessMessage: 'The company has been deleted, refresh to see the changes!',
        });
    };


    return (
        <div className='TableCompany'>
            <SidebarAdmin />
            <div className="container-md" style={{ width: '82%' }}>
                <h1 className='text-white' >Company</h1>

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
                                <th className='text-white' style={{ background: '#222527', width: '26%' }}> Name </th>
                                <th className='text-white' style={{ background: '#222527', width: '26%' }}> Email </th>
                                <th className='text-white' style={{ background: '#222527', width: '26%' }}> State </th>
                                <th className='text-white' style={{ background: '#222527', width: '8%' }}>View More</th>
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
                                        <button onClick={() => handleViewClick(item)} className="btn btn-success btn-sm">
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

                {/* Pagination controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className='font-weight-bold text-white'>Showing {currentPage} of {totalPages} entries</span>
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
        </div>
    );
};

export default TableCompany;
