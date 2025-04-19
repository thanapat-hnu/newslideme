import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'


import './footer.css'

function Footer() {

    const [page, setPage] = useState('home')

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/home') {
            setPage('home')
        } else if (location.pathname === '/list') {
            setPage('list')
        } else if (location.pathname === '/chat') {
            setPage('chat')
        } else if (location.pathname === '/profile') {
            setPage('profile')
        }
    })

    return (
        <div className='container-footer'>

            <button className='footer' onClick={() => {
                navigate('/home')
            }}>
                <i className={page === 'home' ? 'bi bi-house-door-fill act' : 'bi bi-house-door'}></i>
                <h5 className={page === 'home' ? 'act' : ''}>หน้าแรก</h5>
            </button>

            <button className='footer' onClick={() => {
                navigate('/list')
            }}>
                <i className={page === 'list' ? 'bi bi-file-earmark-text-fill act' : 'bi bi-file-earmark-text'}></i>
                <h5 className={page === 'list' ? 'act' : ''}>รายการ</h5>
            </button>

            <button className='footer' onClick={() => {
                navigate('/chat')
            }}>
                <i className={page === 'chat' ? 'bi bi-chat-left-text-fill act' : 'bi bi-chat-left-text'}></i>
                <h5 className={page === 'chat' ? 'act' : ''}>แชท</h5>
            </button>

            <button className='footer' onClick={() => {
                navigate('/profile')
            }}>
                <i className={page === 'profile' ? 'bi bi-person-badge-fill act' : 'bi bi-person-badge'}></i>
                <h5 className={page === 'profile' ? 'act' : ''}>โปรไฟล์</h5>
            </button>

        </div>
    );
}

export default Footer;