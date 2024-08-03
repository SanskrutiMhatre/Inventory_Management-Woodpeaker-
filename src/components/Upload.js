import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Upload() {
    const [file, setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onFileUpload = () => {
        if (!file) {
            toast.response('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            toast.success('File uploaded successfully!');
            console.log('Response:', response);
        })
        .catch(error => {
            toast.error('Error uploading file!');
            console.error('Upload error:', error); // Log error for debugging
        });
    };

    return (
        <div className="upload-container">
            <h1 className="my-4">Upload Data</h1>
            <input type="file" accept=".xlsx, .xls" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload!</button>
            <ToastContainer />
        </div>
    );
}

export default Upload;
