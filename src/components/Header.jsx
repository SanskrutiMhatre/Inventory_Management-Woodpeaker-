import React, { useState, useEffect } from 'react';
import { BsFillEnvelopeFill, BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        navigate('/notifications');
    };

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const response = await axios.get('http://localhost:5000/notifications');
                const unreadCount = response.data.filter(notification => !notification.read).length;
                setNotificationCount(unreadCount);
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        fetchNotificationCount();
    }, []);

    return (
        <header className='header'>
            
               
            <div className='header-right'>
                <div className='notification-icon' onClick={handleNotificationClick}>
                    <BsFillEnvelopeFill className='icon' />
             
                </div>
            </div>
        </header>
    );
}

export default Header;
