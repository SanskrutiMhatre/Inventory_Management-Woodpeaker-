import React, { useEffect, useState } from 'react';
import axios from 'axios';


const History = () => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-bills');
                console.log('Fetched bills:', response.data);
                setBills(response.data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };

        fetchBills();
    }, []);

    return (
        <div className="history-container">
            <h1>Bill History</h1>
            {bills.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Item Name</th>
                            <th>Strength</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill, index) => (
                            <React.Fragment key={index}>
                                {Array.isArray(bill.items) && bill.items.length > 0 ? (
                                    bill.items.map((item, i) => (
                                        <tr key={i}>
                                            {i === 0 && (
                                                <>
                                                    <td rowSpan={bill.items.length}>
                                                        {bill.id || 'N/A'}
                                                    </td>
                                                    <td rowSpan={bill.items.length}>
                                                        {new Date(bill.date).toLocaleDateString() || 'Invalid Date'}
                                                    </td>
                                                    <td rowSpan={bill.items.length}>
                                                        {bill.time || 'N/A'}
                                                    </td>
                                                </>
                                            )}
                                            <td>{item.name || 'N/A'}</td>
                                            <td>{item.strength || 'N/A'}</td>
                                            <td>{item.quantity || 'N/A'}</td>
                                            <td>{item.price ? item.price.toFixed(2) : 'N/A'}</td>
                                            <td>{(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No items available</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan="7" className="total-price">
                                       Final Total Price:
                                    </td>
                                    <td>${bill.total_price ? bill.total_price.toFixed(2) : 'N/A'}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-bills">No bills available.</p>
            )}
        </div>
    );
};

export default History;
