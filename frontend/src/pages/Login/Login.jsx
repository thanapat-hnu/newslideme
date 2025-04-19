import React from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate
import { CSSTransition } from 'react-transition-group'; // นำเข้า CSSTransition
import './Login.css';

function Login() {
    const navigate = useNavigate(); // สร้างตัวแปร navigate

    // ฟังก์ชันเมื่อกดปุ่มเข้าสู่ระบบด้วยเบอร์มือถือ
    const handlePhoneLogin = () => {
        // เริ่มอนิเมชั่น fade-out ก่อนเปลี่ยนหน้า
        document.querySelector('.Login-container').classList.add('fade-out');
        setTimeout(() => {
            navigate('/inputphone');
        }, 500); // ดีเลย์เพื่อให้อนิเมชั่นทำงาน
    };

    // ฟังก์ชันเมื่อกดปุ่มสร้างบัญชีใหม่
    const handleRegister = () => {
        // เริ่มอนิเมชั่น fade-out ก่อนเปลี่ยนหน้า
        document.querySelector('.Login-container').classList.add('fade-out');
        setTimeout(() => {
            navigate('/register');
        }, 500); // ดีเลย์เพื่อให้อนิเมชั่นทำงาน
    };

    return (
        <div className="Login-container">
            <img className="logo" src="./img/slide me logo.png" alt="Logo" />
            <div className="login-form">
                <button className="btn-login" onClick={handlePhoneLogin}>
                    <img className="phone" src="./img/phone.png" alt="Phone" />
                    เข้าสู่ระบบด้วยเบอร์มือถือ
                </button>
            </div>
            <div>
                <button className="btn-register" onClick={handleRegister}>
                    สร้างบัญชีใหม่
                </button>
            </div>
        </div>
    );
}

export default Login;
