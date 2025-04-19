import React, { useEffect, useState } from 'react';
import './options.css';

function Options({ button, setButton, setOptions, towTruckData, setTowTruckData }) {

    useEffect(() => {
        fetch('./data.json')
            .then((response) => response.json())
            .then((data) => {
                setTowTruckData(data);  // Set the fetched data to state
            })
            .catch((error) => console.error('Error loading data:', error));
    }, []);

    return (
        <div style={button === 'c' ? { display: 'grid' } : { display: 'none' }} className="container-options">
            <button onClick={() => setButton('')} className="bg-black"></button>

            <div className="bg-selectcar" style={button === 'c' ? { display: 'grid' } : { display: 'none' }}>
                <div className="container-selectcar">
                    <div className="title">เลือกประเภทรถ</div>
                    <div className="selectcar">
                        {towTruckData.map((item) => (
                            <button
                                key={item.providerId}  // Ensure unique key for each button
                                onClick={() => {
                                    setOptions(item.towTruckType);  // Set the selected towTruckType
                                    setButton('');
                                }}
                                className="button-selectcar"
                            >
                                <div className="bg-icon">
                                    <i className="bi bi-car-front-fill"></i>
                                </div>
                                <div className="text">
                                    <p className="text">{item.towTruckType}</p>  {/* Render towTruckType dynamically */}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Options;
