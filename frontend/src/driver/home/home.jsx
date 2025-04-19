import './home.css'
// import 'bootstrap/dist/css/bootstrap.min.css';  

function DriverHome() {
    return (
        <div className='container-home'>
            <div className='title'>
                <h1 style={{ margin: "0" }}>SlideMe</h1>
            </div>

            <div className='reg-log'>
                <h3 style={{marginBottom: "20px"}}>ลงทะเบียนหรือเข้าสู่ระบบด้วย</h3>
                <button className='btnN' style={{marginBottom: "10px"}}><b>กดเข้าสู่ระบบ</b></button>
                <button className='btnN' style={{marginBottom: "10px"}}><b>สมัครสมาชิก</b></button>
            </div>
        </div>
    );
}

export default DriverHome;