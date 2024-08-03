import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsSearch } from 'react-icons/bs';

const Products = () => {
    const [medicines, setMedicines] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        type: '',
        strength: '',
        expirationDate: '',
        price: '',
        availabilityStatus: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        brands: [],
        types: [],
        strengths: [],
        expirationDates: [],
        statuses: []
    });
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showBackButton, setShowBackButton] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/medicines', { params: filters });
                setMedicines(response.data);
                setShowBackButton(filters.brand || filters.type || filters.strength || filters.expirationDate || filters.price || filters.availabilityStatus);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchMedicines();
    }, [filters]);

    const fetchFilterOptions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/filter-options');
            const cleanFilterOptions = {
                brands: response.data.brands.filter(brand => brand.trim() !== ''),
                types: response.data.types.filter(type => type.trim() !== ''),
                strengths: response.data.strengths.filter(strength => strength.trim() !== ''),
                expirationDates: response.data.expirationDates.filter(date => date.trim() !== ''),
                statuses: response.data.statuses.filter(status => status.trim() !== '')
            };
            setFilterOptions(cleanFilterOptions);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };
    

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (event) => {
        if (event) event.preventDefault(); // Only call preventDefault if event is defined

        if (searchTerm.trim()) {
            try {
                const response = await axios.get('http://localhost:5000/search', {
                    params: { q: searchTerm }
                });
                setSearchResults(response.data);
                setShowBackButton(true);
            } catch (error) {
                console.error('Error searching for data:', error);
            }
        }
    };

    const handleBack = () => {
        setSearchTerm('');
        setSearchResults([]);
        setFilters({
            brand: '',
            type: '',
            strength: '',
            expirationDate: '',
            price: '',
            availabilityStatus: ''
        });
        setShowBackButton(false);
    };

    const handleEditClick = (medicine) => {
        setEditingId(medicine.sku_id);
        setEditData({ ...medicine });
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (sku_id) => {
        try {
            await axios.post('http://localhost:5000/update-medicine', { sku_id, ...editData });
            // Refresh the list after updating
            setEditingId(null);
            setEditData({});
            // Option 1: Use handleSearch if search is used
            handleSearch(); 
            // Option 2: Use fetchMedicines if you are not using search
            // fetchMedicines();
        } catch (error) {
            console.error('Error updating medicine:', error);
        }
    };

    return (
        <div className="container">
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by SKU ID or Name..."
                    className="search-input"
                />
                <button type="button" className="search-button" onClick={handleSearch}>
                    <BsSearch className='icon' />
                </button>
                {showBackButton && (
                    <button className={`back-button ${showBackButton ? 'show-back-button' : ''}`} onClick={handleBack}>Back</button>
                )}
            </div>

           
                <h2>Medicines</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>SKU ID</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Strength</th>
                            <th>Quantity</th>
                            <th>Expiration Date</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(searchResults.length > 0 ? searchResults : medicines).map((medicine) => (
                            <tr key={medicine.sku_id}>
                                <td>{medicine.sku_id}</td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        medicine.name
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <input
                                            type="text"
                                            name="brand"
                                            value={editData.brand}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        medicine.brand
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <input
                                            type="text"
                                            name="strength"
                                            value={editData.strength}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        medicine.strength
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={editData.quantity}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        medicine.quantity
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <input
                                            type="date"
                                            name="expiration_date"
                                            value={editData.expiration_date}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        medicine.expiration_date
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <input
                                            type="number"
                                            name="price"
                                            value={editData.price}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        medicine.price
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <select
                                            name="availability_status"
                                            value={editData.availability_status}
                                            onChange={handleChange}
                                        >
                                            <option value="instock">In Stock</option>
                                            <option value="outofstock">Out of Stock</option>
                                        </select>
                                    ) : (
                                        medicine.availability_status
                                    )}
                                </td>
                                <td>
                                    {editingId === medicine.sku_id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(medicine.sku_id)}
                                                className="btn btn-success btn-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEditClick(medicine)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
     
    );
};

export default Products;
