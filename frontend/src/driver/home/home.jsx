import './home.css'
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';  

function DriverHome() {

    const navigator = useNavigate();
    return (
        <div className='container-home'>
            <div className='title'>
                <h1 style={{ margin: "0" }}>SlideMe</h1>
            </div>

            <div className='reg-log'>
                <h3 style={{marginBottom: "20px"}}>ลงทะเบียนหรือเข้าสู่ระบบด้วย</h3>
                <button className='btnN' style={{marginBottom: "10px"}} onClick={() => navigator('/driver/main')}><b>กดเข้าสู่ระบบ</b></button>
                <button className='btnN' style={{marginBottom: "10px"}} onClick={() => navigator('/driver/register')}><b>สมัครสมาชิก</b></button>
            </div>
        </div>
    );
}

export default DriverHome;