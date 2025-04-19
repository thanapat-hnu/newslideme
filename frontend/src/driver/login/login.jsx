import "./login.css"

function Login() {
    return (
        <div class="container-login">
            <button class="btn-back"><b>＜กลับ</b></button>
            <div class="formReg">
                <h1 style={{ margin: "0", color: "#14BF61" }}>สมัครสมาชิก</h1>
                <div class="coolinput">
                    <label for="input" class="text">ชื่อจริง : </label>
                    <input type="text" placeholder="ชื่อจริง..." name="input" class="input" />
                </div>
                <div class="coolinput">
                    <label for="input" class="text">นามสกุล : </label>
                    <input type="text" placeholder="นามสกุล..." name="input" class="input" />
                </div>
                <div class="coolinput">
                    <label for="input" class="text">วันเกิด </label>
                    <input type="text" placeholder="31/12/1999..." name="input" class="input" />
                </div>
                <div class="coolinput">
                    <label for="input" class="text">เบอร์โทร : </label>
                    <input type="text" placeholder="เบอร์โทร..." name="input" class="input" />
                </div>
                <div class="coolinput">
                    <label for="input" class="text">ทะเบียนรถ : </label>
                    <input type="text" placeholder="ทะเบียนรถ..." name="input" class="input" />
                </div>
                <div class="coolinput">
                    <label for="input" class="text">ประเภทรถ : </label>
                    <input type="text" placeholder="ประเภทรถ..." name="input" class="input" />
                </div>
            </div>
            <button className='btn-login' style={{ marginBottom: "10px" }}><b>ลงทะเบียน</b></button>
        </div>
    );
}

export default Login;