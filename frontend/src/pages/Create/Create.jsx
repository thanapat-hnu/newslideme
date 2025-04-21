import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Create.css';

function Create() {
    const navigate = useNavigate();
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber; // ✅ รับเบอร์จาก OTP

    const [profileImage, setProfileImage] = useState('./img/profile.png');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        email: '',
    });
    const [animateClass, setAnimateClass] = useState('Create-fadeIn');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // แสดงภาพ
                setFormData((prevData) => ({
                    ...prevData,
                    profileImage: reader.result, // base64
                }));
            };
            reader.readAsDataURL(file); // แปลงเป็น base64
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleNext = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phoneNumber,
                    email: formData.email,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    gender: formData.gender,
                    profileImage: formData.profileImage,
                }),
            });
    
            const result = await response.json();
            console.log(result);
    
            if (result.success) {
                localStorage.setItem("phoneNumber", phoneNumber);
                navigate('/home', { state: { phoneNumber } }); // ✅ ไปหน้า home หลังสร้างโปรไฟล์
            } else {
                alert("เกิดข้อผิดพลาด: " + result.message);
            }
        } catch (error) {
            console.error("❌ API error:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };
    const handleBack = () => {
        setAnimateClass('Create-fadeOut');
        setTimeout(() => {
            navigate('/register');
        }, 500);
    };

    return (
        <div className={`Create-container ${animateClass}`}>
            <div className='Create-header'>
                <button className='back-btn' onClick={handleBack}>⭠</button>
                สร้างโปรไฟล์
            </div>

            <div className="profile-container">
                <label htmlFor="uploadImage">
                    <img src={profileImage} alt="Profile" className="profile-button" />
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>

            <div className='form-container'>
                <div>
                    <input
                        type="text"
                        id="firstname"
                        placeholder="ชื่อ"
                        value={formData.firstname}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="lastname"
                        placeholder="นามสกุล"
                        value={formData.lastname}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <select
                        id="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>เลือกเพศ</option>
                        <option value="ชาย">ชาย</option>
                        <option value="หญิง">หญิง</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div>
                <button className='create-next' onClick={handleNext}>
                    ถัดไป
                </button>
            </div>
        </div>
    );
}

export default Create;
