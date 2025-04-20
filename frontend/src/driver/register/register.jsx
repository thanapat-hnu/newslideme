import "./register.css"
import { useNavigate } from "react-router-dom";

function RegisterDriver() {

    const navigator = useNavigate();

    return (
        <div className="container-login">
            <button className="btn-back" onClick={() => navigator('/driver/index')}><b>＜กลับ</b></button>
            <div className="formReg">
                <h1 style={{ margin: "0", color: "#14BF61" }}>สมัครสมาชิก</h1>
                <div className="coolinput">
                    <label htmlFor="input" className="text">ชื่อจริง : </label>
                    <input type="text" placeholder="ชื่อจริง..." name="input" className="input" />
                </div>
                <div className="coolinput">
                    <label htmlFor="input" className="text">นามสกุล : </label>
                    <input type="text" placeholder="นามสกุล..." name="input" className="input" />
                </div>
                <div className="coolinput">
                    <label htmlFor="input" className="text">วันเกิด </label>
                    <input type="text" placeholder="31/12/1999..." name="input" className="input" />
                </div>
                <div className="coolinput">
                    <label htmlFor="input" className="text">เบอร์โทร : </label>
                    <input type="text" placeholder="เบอร์โทร..." name="input" className="input" />
                </div>
                <div className="coolinput">
                    <label htmlFor="input" className="text">ทะเบียนรถ : </label>
                    <input type="text" placeholder="ทะเบียนรถ..." name="input" className="input" />
                </div>
                <div className="coolinput">
                    <label htmlFor="input" className="text">ประเภทรถ : </label>
                    <input type="text" placeholder="ประเภทรถ..." name="input" className="input" />
                </div>
            </div>
            <button className='btn-login-driver' style={{ marginBottom: "10px" }}><b>ลงทะเบียน</b></button>
        </div>
    );
}

export default RegisterDriver;