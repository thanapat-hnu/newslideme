
import React, { useEffect, useState } from 'react';
import { Marker, Popup, } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router';
// import '../Notification/Notification.css';

// const notifications = [
//     "ค้นพบ <strong>ไรเดอร์</strong> ที่ให้บริการแล้ว !!",
//     "<strong>ไรเดอร์</strong> อยู่ในระหว่างการเดินทาง !",
//     "<strong>ไรเดอร์</strong> ใกล้ถึงที่หมายของคุณแล้ว !",
//     "<strong>ไรเดอร์</strong> ได้มาถึงที่หมายแล้ว !!"
// ];

function Markers({ readLocal, readLocalB, showMarker, setShowMarker,
    showfinish, setShowFinish, showMenu, setShowMenu, setShowButton,
    setMapHeight, towTruckData, setTowTruckData,
    name, carType, carNumber, price
}) {




    // const [currentNotification, setCurrentNotification] = useState(null);

    // const triggerNotification = (index) => {
    //     setCurrentNotification(index);

    //     const audio = new Audio('public/livechat-129007.mp3');
    //     audio.play().catch((error) => {
    //         console.error("เสียงไม่สามารถเล่นได้:", error);
    //     });

    //     setTimeout(() => {
    //         setCurrentNotification(null);
    //     }, 3000);
    // };


    const Icon1 = new L.DivIcon({
        className: 'marker-red',
        html: '<i class="bi bi-geo-alt-fill"></i>'
    })

    const Icon2 = new L.DivIcon({
        className: 'marker-green',
        html: '<i class="bi bi-geo-alt-fill"></i>'
    })

    const Icon3 = new L.Icon({
        iconUrl: '../public/pin1.png',
        iconSize: [35, 50],
        iconAnchor: [11, 26],
        popupAnchor: [7, -20]
    })

    useEffect(() => {
        fetch('./data.json')
            .then((response) => response.json())
            .then((data) => {
                setTowTruckData(data);  // Set the fetched data to state
            })
            .catch((error) => console.error('Error loading data:', error));
    }, []);


    return (
        <div>
            {readLocal.lat !== 0 && readLocal.lng !== 0 && (
                <Marker position={[readLocal.lat, readLocal.lng]} icon={Icon1}>


                </Marker>
            )}

            {readLocalB.lat !== 0 && readLocalB.lng !== 0 &&
                (<Marker position={[readLocalB.lat, readLocalB.lng]} icon={Icon2} />)
            }

            {showMarker === true &&
                (<Marker position={[readLocal.lat + 0.0009, readLocal.lng - 0.0009]} icon={Icon3}>
                    <Popup>
                        <div className='popup'>
                            <div>
                                <img className='profile' src="https://www.thaimediafund.or.th/wp-content/uploads/2024/04/blank-profile-picture-973460_1280.png" alt="" />
                                <div>

                                    <p className='price'>
                                        <span>{name}</span>
                                    </p>

                                    <p className='price'>
                                        <span>รุ่นรถ :</span>
                                        <span>{carType}</span>
                                    </p>

                                    <p className='price'>
                                        <span>ทะเบียนรถ :</span>
                                        <span>{carNumber}</span>
                                    </p>
                                    <p className='price'>
                                        <span>ราคา :</span>
                                        <span>{price}BAHT</span>
                                    </p>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => {
                                                setShowFinish(true)
                                                setShowMenu(false)
                                                setShowMarker(false)
                                                setShowButton(false)
                                                setMapHeight('385px')
                                                // triggerNotification(0)
                                            }}
                                        >
                                            เลือก</button>
                                        {/* {currentNotification !== null && (
                                            <div className="notification-popup">
                                                <img src="public/LOGO_main.png" alt="Logo" className="logo" />
                                                <p dangerouslySetInnerHTML={{ __html: notifications[currentNotification] }}></p>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>)
            }



        </div>
    );
}

export default Markers;