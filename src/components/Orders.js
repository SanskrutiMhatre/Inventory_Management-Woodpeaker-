import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
    const [outOfStock, setOutOfStock] = useState([]);
    const [expiredItems, setExpiredItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const [showReorderTable, setShowReorderTable] = useState(false);
    const [contactInfo, setContactInfo] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const [outOfStockResponse, expiredItemsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/out-of-stock'),
                    axios.get('http://localhost:5000/expired-items')
                ]);

                setOutOfStock(outOfStockResponse.data);
                setExpiredItems(expiredItemsResponse.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        if (selectAll) {
            const newSelection = {};
            outOfStock.forEach(item => {
                newSelection[item.sku_id] = true;
            });
            setSelectedItems(newSelection);
        } else {
            setSelectedItems({});
        }
    }, [selectAll, outOfStock]);

    const handleQuantityChange = (sku_id, quantity) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [sku_id]: quantity
        }));
    };

    const handleReorder = () => {
        setShowReorderTable(true);
    };

    const handleProceed = () => {
        setShowReorderTable(true);
    };

    const handleFinalReorder = () => {
        const reorderedItems = Object.keys(selectedItems).map(sku_id => ({
            sku_id,
            quantity: quantities[sku_id] || 0
        }));

        const message = `Order Details:\n${reorderedItems.map(item => `SKU: ${item.sku_id}, Quantity: ${item.quantity}`).join('\n')}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${contactInfo.mobileNumber}&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };
    
    const handleContactInfoChange = (e) => {
        setContactInfo({ ...contactInfo, mobileNumber: e.target.value });
    };

    return (
        <div className="orders-container">
            <h1>Orders</h1>

            {!showReorderTable ? (
                <>
                    <div className="section">
                        <h2>Out of Stock</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={() => setSelectAll(!selectAll)}
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Strength</th>
                                    <th>Price</th>
                                    <th>Expiration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outOfStock.map(item => (
                                    <tr key={item.sku_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems[item.sku_id] || false}
                                                onChange={(e) => setSelectedItems({
                                                    ...selectedItems,
                                                    [item.sku_id]: e.target.checked
                                                })}
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.brand}</td>
                                        <td>{item.strength}</td>
                                        <td>${item.price}</td>
                                        <td>{item.expiration_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="section">
                        <h2>Expired Items</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={() => setSelectAll(!selectAll)}
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Strength</th>
                                    <th>Price</th>
                                    <th>Expiration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expiredItems.map(item => (
                                    <tr key={item.sku_id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems[item.sku_id] || false}
                                                onChange={(e) => setSelectedItems({
                                                    ...selectedItems,
                                                    [item.sku_id]: e.target.checked
                                                })}
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.brand}</td>
                                        <td>{item.strength}</td>
                                        <td>{item.price}</td>
                                        <td>{item.expiration_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={handleProceed}>Proceed</button>
                </>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Strength</th>
                                <th>Price</th>
                                <th>Edit Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(selectedItems).map(sku_id => (
                                <tr key={sku_id}>
                                    <td>{outOfStock.find(item => item.sku_id === sku_id)?.name || 'N/A'}</td>
                                    <td>{outOfStock.find(item => item.sku_id === sku_id)?.brand || 'N/A'}</td>
                                    <td>{outOfStock.find(item => item.sku_id === sku_id)?.strength || 'N/A'}</td>
                                    <td>{outOfStock.find(item => item.sku_id === sku_id)?.price || 'N/A'}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={quantities[sku_id]|| ''}
                                            onChange={(e) => handleQuantityChange(sku_id, parseInt(e.target.value, 10))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='orders'>
                        <input 
                            type="text"
                            placeholder="Enter Contractors Number"
                            onChange={handleContactInfoChange}
                        />
                        <button onClick={handleFinalReorder}>Submit Order via WhatsApp</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
