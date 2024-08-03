import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import jsQR from 'jsqr';

const Scanner = () => {
    const [data, setData] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [medicineDetails, setMedicineDetails] = useState([]);
    const [billData, setBillData] = useState(null);

    const handleScan = (result) => {
        if (result) {
            setData(result.text);
            parseMedicineData(result.text);
        }
    };

    const handleError = (err) => {
        console.error('QR Code Error:', err);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                const img = document.createElement('img');
                img.src = imageData;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = context.getImageData(0, 0, img.width, img.height);

                    try {
                        const code = jsQR(imageData.data, img.width, img.height);

                        if (code) {
                            setData(code.data);
                            parseMedicineData(code.data);
                        } else {
                            alert('No QR code found.');
                        }
                    } catch (error) {
                        console.error('Error decoding QR code:', error);
                        alert('Failed to decode QR code. Please try a different image.');
                    }
                };
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const parseMedicineData = (data) => {
        try {
            const medicineEntries = data.split(';').map(entry => {
                const [name, strength, quantity] = entry.split(',').map(item => item.trim());

                return {
                    name,
                    strength,
                    quantity: parseInt(quantity, 10) || 0
                };
            });

            setMedicines(medicineEntries);
        } catch (error) {
            console.error('Error parsing medicine data:', error);
            setMedicines([]);
        }
    };

    const checkAvailability = async () => {
        try {
            const responses = await Promise.all(medicines.map(medicine => 
                axios.get('http://localhost:5000/search', { params: { q: medicine.name } })
            ));

            console.log('API responses:', responses);

            // Flatten the array of arrays
            const details = responses.map(response => response.data).flat();

            console.log('Parsed and flattened medicine details:', details);
            setMedicineDetails(details);
        } catch (error) {
            console.error('Error fetching medicine details:', error);
            setMedicineDetails([]);
        }
    };

    const removeRow = (index) => {
        setMedicineDetails(prevDetails => prevDetails.filter((_, i) => i !== index));
    };
    const generateBill = async () => {
        // Check if any medicine quantity is less than or equal to zero
        const hasNegativeQuantity = medicines.some(medicine => {
            const details = medicineDetails.find(detail => detail.name === medicine.name);
            return details && medicine.quantity > details.quantity;
        });
    
        if (hasNegativeQuantity) {
            alert('One or more medicines have insufficient quantity. Please check the availability and update the quantities.');
            return;
        }
    
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const formattedTime = date.toLocaleTimeString();
    
        const totalPrice = medicines.reduce((sum, medicine) => {
            const details = medicineDetails.find(detail => detail.name === medicine.name);
            const price = details ? details.price : 0;
            return sum + (medicine.quantity * price);
        }, 0);
    
        const bill = {
            date: formattedDate,
            time: formattedTime,
            items: medicines.map(medicine => {
                const details = medicineDetails.find(detail => detail.name === medicine.name);
                return {
                    name: medicine.name,
                    strength: medicine.strength,
                    quantity: medicine.quantity,
                    price: details ? details.price : 0
                };
            }),
            totalPrice
        };
    
        setBillData(bill);
    
        // Save bill data to the database
        try {
            const response = await axios.post('http://localhost:5000/save-bill', bill);
            console.log('Bill saved:', response.data);
        } catch (error) {
            console.error('Error saving bill:', error);
        }
    };

    const handlePrintBill = () => {
        if (billData) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Bill</title>');
            printWindow.document.write(`
                <style>
                    @media print {
                        .print-container {
                            width: 100%;
                            margin: 0 auto;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                        }
                        .print-container h1 {
                            text-align: center;
                            margin-bottom: 20px;
                            font-size: 24px;
                            border-bottom: 2px solid #000;
                            padding-bottom: 10px;
                        }
                        .print-container p {
                            margin: 5px 0;
                            font-size: 16px;
                        }
                        .print-container table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        .print-container table, .print-container th, .print-container td {
                            border: 1px solid black;
                        }
                        .print-container th, .print-container td {
                            padding: 12px;
                            text-align: left;
                            font-size: 14px;
                        }
                        .print-container th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                        }
                        .print-container tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        .print-container tr:nth-child(odd) {
                            background-color: #fff;
                        }
                        .print-container h2 {
                            text-align: right;
                            margin-top: 20px;
                            font-size: 18px;
                            border-top: 2px solid #000;
                            padding-top: 10px;
                        }
                        .print-container .total {
                            font-size: 16px;
                            font-weight: bold;
                            color: #333;
                        }
                        .print-container .section {
                            margin-bottom: 20px;
                        }
                        .print-container .section h2 {
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 5px;
                            font-size: 20px;
                        }
                        .print-container .footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                        }
                    }
                </style>
            `);
            printWindow.document.write('</head><body>');
            printWindow.document.write('<div class="print-container">');
            printWindow.document.write('<h1>Medical Bill</h1>');
            printWindow.document.write(`<p>Date: ${billData.date}</p>`);
            printWindow.document.write(`<p>Time: ${billData.time}</p>`);
            printWindow.document.write('<div class="section">');
            printWindow.document.write('<h2>Items</h2>');
            printWindow.document.write('<table>');
            printWindow.document.write('<thead><tr><th>Name</th><th>Strength</th><th>Quantity</th><th>Price</th></tr></thead>');
            printWindow.document.write('<tbody>');
            billData.items.forEach(item => {
                printWindow.document.write(`<tr><td>${item.name}</td><td>${item.strength}</td><td>${item.quantity}</td><td>${item.price.toFixed(2)}</td></tr>`);
            });
            printWindow.document.write('</tbody>');
            printWindow.document.write('</table>');
            printWindow.document.write('<p class="total">Total Price: ' + billData.totalPrice.toFixed(2) + '</p>');
            printWindow.document.write('</div>');
            printWindow.document.write('<div class="footer">Thank you for your purchase!</div>');
            printWindow.document.write('</div>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div>
           <QrReader
                onResult={handleScan}
                onError={handleError}
                constraints={{ facingMode: 'environment' }}
                style={{ width: '100%', maxWidth: '400px' }} // Adjust maxWidth as needed
                className="qr-reader"
            />

            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button className="button" onClick={handleFileUpload}>Upload QR Code</button>
            <br/><br/>
            <div className="button-container">
                <button className="button" onClick={checkAvailability}>Check Availability</button>
                <button className="button" onClick={generateBill}>Generate Bill</button>
            </div>

            {medicines.length > 0 && (
                <div>
                    <h2>Medicines</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Strength</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((medicine, index) => (
                                <tr key={index}>
                                    <td>{medicine.name}</td>
                                    <td>{medicine.strength}</td>
                                    <td>{medicine.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {medicineDetails.length > 0 && (
                <div>
                    <h2>Availability</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Strength</th>
                                <th>Price</th>
                                <th>Expiration</th>
                                <th>Status</th> 
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicineDetails.map((medicine, index) => (
                                <tr key={index}>
                                    <td>{medicine.name}</td>
                                    <td>{medicine.strength}</td>
                                    <td>{(medicine.price !== undefined ? medicine.price : 0).toFixed(2)}</td>
                                    <td>{medicine.expiration_date}</td> 
                                    <td>{medicine.availability_status}</td>
                                    <td>
                                        <button onClick={() => removeRow(index)}>Remove</button> {/* Remove button */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {billData && (
                <div>
                    <h2>Bill</h2>
                    <button onClick={handlePrintBill}>Print Bill</button>
                </div>
            )}
        </div>
    );
};

export default Scanner;
