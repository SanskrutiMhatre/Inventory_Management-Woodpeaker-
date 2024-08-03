import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css'; // Import global styles
import './style.css'; // Import additional styles


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
     
            <App />
    
    </React.StrictMode>
);
