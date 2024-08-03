import React, { useState } from 'react';
import QRCode from 'qrcode.react';

import './Receipt.css'; // Import the CSS file

const Receipt = () => {
    const [patientName, setPatientName] = useState('');
    const [patientDate, setPatientDate] = useState('');
    const [items, setItems] = useState([
        { srNo: 1, description: '', morning: false, afternoon: false, evening: false, quantity: '', strength: '' }
    ]);
    const [showQRCode, setShowQRCode] = useState(false);

    const handleGenerateQRCode = () => {
        setShowQRCode(true);
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const handleAddMedicine = () => {
        setItems([...items, { srNo: items.length + 1, description: '', morning: false, afternoon: false, evening: false, quantity: '', strength: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'quantity' && isNaN(value)) {
            alert('Quantity must be a number');
            return;
        }
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleCheckboxChange = (index, field) => {
        const newItems = [...items];
        newItems[index][field] = !newItems[index][field];
        setItems(newItems);
    };

    const handleRemoveMedicine = (index) => {
        const newItems = items.filter((item, itemIndex) => itemIndex !== index);
        setItems(newItems.map((item, itemIndex) => ({ ...item, srNo: itemIndex + 1 })));
    };

    // Format the QR code value
    const qrCodeValue = items.map(item => 
        `${item.description || 'No Name'},${item.strength || 'No Strength'},${item.quantity || '0'}`
    ).join('; ');

    return (
        <div className="container">
            <div className="receipt-container">
                <div className="row invoice row-printable">
                    <div className="col-md-12">
                        <div className="panel panel-default plain" id="dash_0">
                            <div className="panel-body p30 invoice">
                                <div className="row">
                                    {/* Left Column - Hospital Logo */}
                                    <div className="col-lg-2">
                                        <div className="invoice-logo">
                                            <img src="/Capture.PNG" alt="Hospital Logo" />
                                        </div>
                                    </div>
                                    {/* Right Column - Hospital Details */}
                                    <div className="col-lg-2 col-lg-offset-1">
                                        <div className="invoice-from">
                                            <h4>Jupiter Hospital</h4>
                                            <p>Service Rd, Eastern Express Hwy, next to Viviana Mall, Thane, Maharashtra 400601</p>
                                        </div>
                                    </div>
                                    {/* Patient Information */}
                                    <div className="col-lg-4">
                                        <div className="invoice-to">
                                            <h4>Patient Information</h4>
                                            <div className="patient-info">
                                                <div className="form-group">
                                                    <label>Patient Name:</label>
                                                    <input 
                                                        type="text" 
                                                        value={patientName} 
                                                        onChange={(e) => setPatientName(e.target.value)} 
                                                        className="form-control" 
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Date:</label>
                                                    <input 
                                                        type="date" 
                                                        value={patientDate} 
                                                        onChange={(e) => setPatientDate(e.target.value)} 
                                                        className="form-control" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Horizontal Line */}
                                    <div className="col-lg-12">
                                        <hr />
                                    </div>
                                    {/* Title for Medicines */}
                                    <div className="col-lg-12">
                                        <div className="invoice-details mt25">
                                            <div className="well">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center">Sr. No.</th>
                                                            <th className="text-center">Description</th>
                                                            <th className="text-center">Strength</th>
                                                            <th className="text-center">Quantity</th>
                                                            <th className="text-center">Morning</th>
                                                            <th className="text-center">Afternoon</th>
                                                            <th className="text-center">Evening</th>
                                                            <th className="text-center">Remove</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="text-center">{item.srNo}</td>
                                                                <td>
                                                                    <input 
                                                                        type="text" 
                                                                        value={item.description} 
                                                                        onChange={(e) => handleInputChange(index, 'description', e.target.value)} 
                                                                        className="form-control" 
                                                                        placeholder="Enter medicine name"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="text" 
                                                                        value={item.strength} 
                                                                        onChange={(e) => handleInputChange(index, 'strength', e.target.value)} 
                                                                        className="form-control" 
                                                                        placeholder="Enter strength"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="text" 
                                                                        value={item.quantity} 
                                                                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)} 
                                                                        className="form-control" 
                                                                        placeholder="Enter quantity"
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={item.morning} 
                                                                        onChange={() => handleCheckboxChange(index, 'morning')} 
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={item.afternoon} 
                                                                        onChange={() => handleCheckboxChange(index, 'afternoon')} 
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={item.evening} 
                                                                        onChange={() => handleCheckboxChange(index, 'evening')} 
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <button className="btn btn-danger" onClick={() => handleRemoveMedicine(index)}>
                                                                        <i className="fas fa-trash">Remove</i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button className="btn btn-primary" onClick={handleAddMedicine}>
                                                    Add Another Medicine
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Generate QR Code Button and Print Button */}
                <div className="generate-btn-container text-center">
                    <button className="btn btn-default ml15 btn-generate-qrcode" onClick={handleGenerateQRCode}>
                        <i className="fa fa-qrcode mr5"></i> Generate QR Code
                    </button>
                    <button className="btn btn-primary ml15" onClick={handlePrintReceipt}>
                        <i className="fa fa-print mr5"></i> Print
                    </button>
                    {/* Display QR Code */}
                    {showQRCode && (
                        <div style={{ marginTop: '20px' }}>
                            <QRCode value={qrCodeValue} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Receipt;
