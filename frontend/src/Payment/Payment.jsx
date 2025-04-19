import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Payment.css';
import thaiqr from '/thai_qr_payment.png';
import code from '/images.png';
import correct from '/5610944.png';
import promt from '/promtpay.png'
import warn from '/warning.png';
import map from '/3082383.png';
import mastercard from '/MasterCard_Logo.png';
import visa from '/visa-icon.png';
import map1 from '/7051742.png';

function Payment({ setPayment, carType, price, name, setPrice, mid, mid2 }) {
    const [currscreen, setcurrscreen] = useState('overview');
    // ใช้ useEffect เพื่อตรวจสอบ currscreen
    useEffect(() => {
        if (currscreen === 'done') {
            const timer = setTimeout(() => {
                setcurrscreen('method'); // เปลี่ยนกลับไปที่หน้าวิธีการชำระเงิน
                setPayment(false)
                setPrice(0)
            }, 5000); // หน่วงเวลา 5 วินาที

            // เคลียร์ timeout เมื่อคอมโพเนนต์ถูกทำลาย
            return () => clearTimeout(timer);
        }
    }, [currscreen]); // ใช้ currscreen เป็น dependency

    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDateModal, setShowDateModal] = useState(false);
    const [savecard, setsavecard] = useState([
        { id: 1, type: 'MasterCard', cardnumber: '****  1234', bank: 'ธนาคารกรุงเทพ', name: 'John Doe', exp: '01/2023' },
        { id: 2, type: 'Visa', cardnumber: '****  5678', bank: 'ธนาคารไทยพาณิชย์', name: 'Jane Smith', exp: '05/2025' },
        { id: 3, type: 'MasterCard', cardnumber: '****  9012', bank: 'ธนาคารกรุงไทย', name: 'Bob Johnson', exp: '09/2027' },
    ]);
    const [newcard, setnewcard] = useState({
        cardnumber: '',
        name: '',
        exp: '',
        cvv: '',
        bank: '' // เพิ่มสถานะสำหรับธนาคาร
    })
    const [selectedcard, setselectedcard] = useState(null);
    // Check if all required selections are made
    const isAllSelected = () => {
        return selectedDelivery && (
            (selectedDelivery === 'immediate') ||
            (selectedDelivery === 'scheduled' && selectedDate)
        ) && selectedcard;
    };
    const handleDeliverySelect = (type) => {
        setSelectedDelivery(type);
        if (type === 'scheduled') {
            setShowDateModal(true);
        } else {
            setSelectedDate(null);
        }
    };

    const handleDateSelect = (e) => {
        setSelectedDate(e.target.value);
        setShowDateModal(false);
    };

    const DateSelectionModal = () => {
        if (!showDateModal) return null;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>เลือกวันที่จัดส่ง</h3>
                    <input
                        type="date"
                        onChange={handleDateSelect}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    <button onClick={() => setShowDateModal(false)}>ยกเลิก</button>
                </div>
            </div>
        );
    };
    const banks = [
        { name: 'ธนาคารกรุงเทพ', },
        { name: 'ธนาคารไทยพาณิชย์' },
        { name: 'ธนาคารกรุงไทย' },
        { name: 'ธนาคารกสิกรไทย' },
        { name: 'ธนาคารออมสิน' },
    ];
    const getRandomBank = () => {
        const randomIndex = Math.floor(Math.random() * banks.length);
        return banks[randomIndex];
    };
    const [randomBank, setRandomBank] = useState(getRandomBank()); // สร้างสถานะสำหรับธนาคารที่สุ่มได้
    const handlecard = () => {
        if (validate()) {
            const cardType = getCardType(newcard.cardnumber); // ตรวจสอบประเภทบัตรจากหมายเลขที่กรอก
            setsavecard([...savecard, {
                id: savecard.length + 1,
                cardnumber: '**** ' + newcard.cardnumber.slice(-4),
                name: newcard.name,
                exp: newcard.exp,
                type: cardType,
                bank: newcard.bank // ใช้ชื่อธนาคารที่บันทึกไว้ 
            }]);
            setnewcard({ cardnumber: '', name: '', exp: '', cvv: '', bank: '' }); // รีเซ็ตข้อมูลบัตรใหม่
            setcurrscreen('method');
        } else {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
    }
    const validate = () => {
        const expPattern = /^(0[1-9]|1[0-2])\/\d{4}$/; // รูปแบบ MM/YYYY
        const cleanedCardNumber = newcard.cardnumber.replace(/\s+/g, '');
        return (
            cleanedCardNumber.length === 16 && // ตรวจสอบความยาวหมายเลขบัตรที่ไม่มีช่องว่าง
            newcard.name.length > 0 &&
            expPattern.test(newcard.exp) &&
            newcard.cvv.length === 3
        )
    }
    const getCardType = (cardNumber) => {
        if (cardNumber.startsWith('11')) {
            return 'MasterCard';
        } else if (cardNumber.startsWith('22')) {
            return 'Visa';
        } else {
            return 'Unknown';
        }
    };
    const handlePayment = () => {
        if (selectedcard) {
            if (selectedcard.type === 'QR') {
                // ถ้าเป็น QR ให้ไปที่หน้าจอ QR
                setcurrscreen('qr');
            } else {
                // ถ้าเป็นบัตร ให้ไปที่หน้าชำระเงินเสร็จสิ้น
                setcurrscreen('done');
            }
        } else {
            alert('กรุณาเลือกวิธีการชำระเงินก่อน');
        }
    }
    const renderoverview = () => {
        return (
            <div className="container-overview">
                <h2 className='overview-title'>Slide Me</h2>
                <div className='warn-container'>
                    <img className='warn' src={warn} alt="" />
                    <p className='warn-text'>โปรดตรวจสอบตำแหน่งให้ถูกต้อง</p>
                </div>
                {/* แสดงแผนที่ Edit */}
                <div className="container-maps">
                    <img className='map' src={map} alt="" />
                    <p className='map-text-up'>ตำแหน่งต้นทาง : หัวนอน</p>
                    <p className='map-line'>__________________________________________</p>
                </div>
                <div className="container-maps-1">
                    <img className='map-1' src={map1} alt="" />
                    <p className='map-text-down'>ตำแหน่งปลายทาง : ไซง่อน</p>
                    <p className='map-line'>__________________________________________</p>
                </div>
                <div className='line'>
                    __________________________________________
                </div>
                <div className='delivery'>
                    <h2 className='delivery-title'>ตัวเลือกการจัดส่ง</h2>
                    <div
                        className={`delivery-option-immediate ${selectedDelivery === 'immediate' ? 'selected' : ''}`}
                        onClick={() => handleDeliverySelect('immediate')}
                    >
                        <p>ทันที</p>
                    </div>
                    <div className='scheduled-delivery'>
                        <div
                            className={`delivery-option ${selectedDelivery === 'scheduled' ? 'selected' : ''}`}
                            onClick={() => handleDeliverySelect('scheduled')}
                        >
                            <p>ล่วงหน้า</p>
                            {selectedDate && (
                                <p className="selected-date">วันที่เลือก: {selectedDate}</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Need Edit Here */}
                <div className='summary'>
                    <h2 className='summary-title'>การสรุปรายการ</h2>
                    <p className='summary-line'>__________________________________</p>
                    <div>
                        <p className='summary-price'>ประเภทรถ({carType}) : <span className='summary-price-text2'>{price}฿</span></p>
                    </div>
                </div>
                <div className='total'>
                    <h2 className='total-title'>รายละเอียดการชำระเงิน</h2>
                    {selectedcard ? (
                        <div className="card-option-1" onClick={() => setcurrscreen('method')}>
                            {selectedcard.type === 'QR' ? (
                                <>
                                    <img className='img-qr-selected' src={promt} alt='QR' />
                                    <p className='selected-payment'>QR Payment</p>
                                </>
                            ) : (
                                <>
                                    <img className='imgcard-1' src={selectedcard.type === 'MasterCard' ? mastercard : visa} alt={selectedcard.type} />
                                    <p className='selected-card-num'>{selectedcard.cardnumber}</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* <img className='img-plus' src={plus} alt="plus-icon" /> */}
                            <button className='btn-add' onClick={() => setcurrscreen('method')}>เพิ่มช่องทางชําระเงิน</button>
                        </>
                    )}
                </div>
                {isAllSelected() && (
                    <div className='pay'>
                        <p className='pay-text'>เมื่อยืนยันการชำระเงินแล้วไม่สามารถแก้ไขข้อมูลได้</p>
                        <p className='pay-text-1'>กรุณาตรวจสอบข้อมูลอีกครั้ง</p>
                    </div>
                )}
                <div className='total-price'>
                    <p className='total-text'>ยอดรวมทั้งหมด</p>
                    <p className='total-amount'>{price}฿</p>
                    <button
                        className={`btn-pay ${!isAllSelected() ? 'disabled' : ''}`}
                        disabled={!isAllSelected()}
                        onClick={handlePayment}
                    >
                        ชำระเงิน
                    </button>
                </div>
                <DateSelectionModal />
            </div>
        )
    }
    const rendermethod = () => {
        const handlePaymentSelect = (method) => {
            if (method === 'qr') {
                setselectedcard({ type: 'QR', cardnumber: 'QR Payment' });
            } else {
                setselectedcard(method);
            }
            setcurrscreen('overview');
        };
        return (
            <div className="payment-method">
                <span id='go-back' className='bi bi-arrow-left' onClick={() => setcurrscreen('overview')}></span>
                <h1 className='payment-title'>วิธีการชําระเงิน</h1>
                <p className='payment-text'>เลือกวิธีการชําระเงิน</p>
                <div className="payment-selected">
                    {savecard.map((card) => (
                        <div key={card.id} className="card-option" onClick={() => handlePaymentSelect(card)}>
                            <img className='imgcard' src={card.type === 'MasterCard' ? mastercard : visa} alt={card.type} /> {/* แสดงโลโก้ที่ถูกต้อง */}
                            <p className='card-name'>{card.bank}</p>
                            <p className='card-num'>{card.cardnumber}</p>
                        </div>
                    ))}
                    <div className='btn-qr' onClick={() => handlePaymentSelect('qr')}>
                        <img className='img-qr' src={promt} alt='qr' />
                        <p className='qr'>QR Code</p>
                    </div>
                </div>
                <p className='payment-text'>เพิ่มวิธีการชําระเงิน</p>
                <div className='payment-add'>
                    {/* ใช้ openNewCardScreen แทนการตั้งค่า currscreen โดยตรง */}
                    <button className='btn-card' onClick={openNewCardScreen}><span className='bi bi-plus'></span>เพิ่มบัตร</button>
                    <p className='btn-paypal'><span className='bi bi-paypal'></span>Paypal</p>
                </div>
            </div>
        );
    }
    const handledelete = (id) => {
        setsavecard(savecard.filter((card) => card.id !== id))
        setselectedcard('')
        alert('บัตรถูกลบ')
    }
    // Use useEffect for QR timeout
    useEffect(() => {
        if (currscreen === 'qr') {
            const timer = setTimeout(() => {
                alert('หมดเวลาชำระเงิน'); // แจ้งเตือนเมื่อหมดเวลา
                setcurrscreen('overview'); // เปลี่ยนกลับไปที่หน้าหลัก
            }, 30000); // ตั้งเวลาเป็น 30 วินาที

            return () => clearTimeout(timer); // เคลียร์ timeout เมื่อคอมโพเนนต์ถูกทำลาย
        }
    }, [currscreen]); // ใช้ currscreen เป็น dependency

    // สร้างฟังก์ชัน renderqr สำหรับหน้า QR
    const renderqr = () => {
        return (
            <div className="prompt-container" onClick={() => setcurrscreen('done')}>
                <img className='img-qr-render' src={thaiqr} alt="" />
                <img className='img-code-render' src={code} alt="" />
                <p className='prompt-text'>กรุณาสแกน QR Code เพื่อชำระเงิน</p>
                <p className='prompt-text-user'>{name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {price}฿</p>
                {/* เพิ่มปุ่มเพื่อกลับไปที่หน้าชำระเงินเสร็จสิ้น */}
            </div>
        );
    };
    // สร้างฟังก์ชัน renderdone สำหรับหน้าชำระเงินเสร็จสิ้น
    const renderdone = () => {
        return (
            <div className="done-container">
                <img className='done-img' src={correct} alt="" />
                <h1 className='done-title'>ชำระเงินสำเร็จ</h1>
            </div>
        );
    };
    // สุ่มธนาคารเมื่อเปิดหน้าการเพิ่มบัตร
    const openNewCardScreen = () => {
        const randomBank = getRandomBank();
        setnewcard({ ...newcard, bank: randomBank.name }); // บันทึกชื่อธนาคารที่สุ่มได้
        setcurrscreen('newcard');
    };
    const formatCardNumber = (number) => {
        // ลบช่องว่างทั้งหมดออก
        const cleaned = number.replace(/\s+/g, '');
        // แบ่งหมายเลขออกเป็นกลุ่มๆ ทุก 4 ตัว
        const formatted = cleaned.match(/.{1,4}/g);
        return formatted ? formatted.join(' ') : '';
    };
    const rendernewcard = () => {
        const cardType = getCardType(newcard.cardnumber);
        // สร้างอาร์เรย์สำหรับเดือนและปี
        const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
        const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString());
        return (
            <div className='newcard-container'>
                <span id='back' onClick={() => setcurrscreen('method')} className='bi bi-arrow-left'></span>
                <h1 className='payment-title'>เพิ่มบัตร</h1>
                {/* <p>ธนาคารที่สุ่มได้: {randomBank.name} </p> */}
                <div className="payment-newcard">
                    <div className="card-number-container">
                        {cardType === 'MasterCard' && <img className='mastercard' src={mastercard} alt="MasterCard" />}
                        {cardType === 'Visa' && <img className='visa' src={visa} alt="Visa" />}
                        <label htmlFor="number" className='number-newcard'>Card Number: </label>
                        <input id='number' type="text" placeholder="เลขบัตร" value={newcard.cardnumber} maxLength={19} onChange={(e) => setnewcard({ ...newcard, cardnumber: formatCardNumber(e.target.value) })} />
                    </div>
                    <label htmlFor="holder">Holder: </label>
                    <input id='holder' type="text" placeholder="ชื่อบัตร" value={newcard.name} onChange={(e) => setnewcard({ ...newcard, name: e.target.value })} /> {/*เพิ่ม onChange เพื่ออัปเดตค่า newcard.name*/}
                    {/* Dropdown สำหรับเดือนหมดอายุ */}
                    <label htmlFor="exp-month">Exp: </label>
                    <select id="exp-month" value={newcard.expMonth} onChange={(e) => setnewcard({ ...newcard, exp: `${e.target.value}/${newcard.exp.slice(3)}` })}>
                        <option value="">เดือน</option>
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    {/* Dropdown สำหรับปีหมดอายุ */}
                    <select id="exp-year" value={newcard.exp.slice(3)} onChange={(e) => setnewcard({ ...newcard, exp: `${newcard.exp.slice(0, 2)}/${e.target.value}` })}>
                        <option value="">ปี</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <label htmlFor="cvv" className='cvv'>Security Code: </label>
                    <input id='cvv' type="password" placeholder="CVV" value={newcard.cvv} maxLength={3} onChange={(e) => setnewcard({ ...newcard, cvv: e.target.value })} /> {/*เพิ่ม onChange เพื่ออัปเดตค่า newcard.cvv*/}
                    <button className='addcard' onClick={() => {
                        handlecard();
                    }}>เพิ่มบัตร</button>
                </div>
            </div>
        )
    }
    return (
        <div className="contrainer">
            {currscreen === 'overview' && renderoverview()}
            {currscreen === 'method' && rendermethod()}
            {currscreen === 'newcard' && rendernewcard()}
            {currscreen === 'qr' && renderqr()}
            {currscreen === 'done' && renderdone()}
        </div>
    );
}
export default Payment;