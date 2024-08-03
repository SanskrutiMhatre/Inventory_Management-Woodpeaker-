import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';

const MainCards = React.memo(({ stats }) => (
    <div className='main-cards'>
        <div className='card'>
            <div className='card-inner'>
                <h3>PRODUCTS</h3>
                <BsFillArchiveFill className='card_icon' />
            </div>
            <h1>{stats.total_products || 0}</h1>
        </div>
        <div className='card'>
            <div className='card-inner'>
                <h3>EXPIRED</h3>
                <BsFillGrid3X3GapFill className='card_icon' />
            </div>
            <h1>{stats.expired_products || 0}</h1>
        </div>
        <div className='card'>
            <div className='card-inner'>
                <h3>INSTOCK</h3>
                <BsPeopleFill className='card_icon' />
            </div>
            <h1>{stats.instock_products || 0}</h1>
        </div>
        <div className='card'>
            <div className='card-inner'>
                <h3>OUT OF STOCK</h3>
                <BsFillBellFill className='card_icon' />
            </div>
            <h1>{stats.outofstock_products || 0}</h1>
        </div>
    </div>
));

function Home() {
    const [medicines, setMedicines] = useState([]);
    const [stats, setStats] = useState({
        total_products: 0,
        expired_products: 0,
        instock_products: 0,
        outofstock_products: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medicinesResponse, statsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/medicines'), 
                    axios.get('http://localhost:5000/stats')       
                ]);
                setMedicines(medicinesResponse.data);
                setStats(statsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <MainCards stats={stats} />

                    <div className="container">
                        <h1 className="my-4">Products</h1>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Type</th>
                                    <th>Strength</th>
                                    <th>Expiration Date</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Availability Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((medicine, index) => (
                                    <tr key={index}>
                                        <td>{medicine.sku_id}</td>
                                        <td>{medicine.name}</td>
                                        <td>{medicine.brand}</td>
                                        <td>{medicine.type}</td>
                                        <td>{medicine.strength}</td>
                                        <td>{medicine.expiration_date}</td>
                                        <td>{medicine.price}</td>
                                        <td>{medicine.quantity}</td>
                                        <td>{medicine.availability_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </main>
    );
}

export default Home;
