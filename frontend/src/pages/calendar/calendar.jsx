import React, { useEffect, useState } from 'react';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './calendar.css'

function Calendars({ service, setService, showData, setShowData, formatDate, showService, setShowService }) {

    const [selectedDate, setSelectedDate] = useState(showData);

    useEffect(() => {
        setSelectedDate(showData); // ใช้ showData เป็นค่าเริ่มต้นของ selectedDate
    }, [showData]); // รีเฟรชเมื่อ showData เปลี่ยนแปลง

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate); // อัพเดต selectedDate เมื่อผู้ใช้เลือกวันที่
        setShowData(newDate); // ส่งวันที่ที่เลือกไปยัง parent component
        console.log(formatDate(newDate))
    };



    return (
        <div
            style={{ display: (showService ? 'flex' : 'none') }}
            className='container-calendars'
        >
            <button
                onClick={() => {
                    setShowService(false)
                    setService(false)
                }
                }
                className='calendar-back'>

            </button>
            <div className='calendar'>
                <div className='ly'>
                    <h4 className='titles'>เลือกวันที่และเวลา</h4>
                    <div className='date'>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendars;