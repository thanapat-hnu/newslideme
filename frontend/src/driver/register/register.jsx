import "./register.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { RegistrationContext } from "../Context";

function RegisterDriver() {
  const navigator = useNavigate();
  const { personalData, setPersonalData } = useContext(RegistrationContext);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setPersonalData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("✅ ส่งข้อมูล", personalData);
      // navigator("/driver/register2");
    } else {
      console.log("❌ มีข้อผิดพลาด");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!personalData.firstName.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อจริง";
    }

    if (!personalData.lastName.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
    }

    if (!/^\d{13}$/.test(personalData.idCardNumber)) {
      newErrors.idCardNumber = "เลขบัตรประชาชนไม่ถูกต้อง (ต้อง 13 หลัก)";
    }

    if (!personalData.birthDate) {
      newErrors.birthDate = "กรุณาเลือกวันเกิด";
    }

    if (!/^\d{9,10}$/.test(personalData.phoneNumber)) {
      newErrors.phoneNumber = "เบอร์โทรไม่ถูกต้อง";
    }

    if (!/^\S+@\S+\.\S+$/.test(personalData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!personalData.address?.trim()) {
      newErrors.address = "กรุณากรอกที่อยู่";
    }

    if (!personalData.idCardImage) {
      newErrors.idCardImage = "กรุณาอัปโหลดรูปบัตรประชาชน";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="container-login">
      <button className="btn-back" onClick={() => navigator("/driver/index")}>
        <b>＜กลับ</b>
      </button>
      <div className="formReg">
        <h1 style={{ margin: "0", color: "#14BF61" }}>สมัครสมาชิก</h1>
        <div className="coolinput">
          <label className="text">ชื่อจริง:</label>
          <input
            type="text"
            placeholder="ชื่อจริง..."
            value={personalData.firstName}
            name="firstName"
            onChange={handleChange}
            className="input"
          />
          {errors.firstName && (
            <label className="text" style={{ color: "red" }}>
              {errors.firstName}
            </label>
          )}
        </div>
        {/* นามสกุล */}
        <div className="coolinput">
          <label htmlFor="input" className="text">
            นามสกุล :{" "}
          </label>
          <input
            type="text"
            placeholder="นามสกุล..."
            value={personalData.lastName}
            name="lastName"
            onChange={handleChange}
            className="input"
          />
          {errors.lastName && (
            <label className="text" style={{ color: "red" }}>
              {errors.lastName}
            </label>
          )}
        </div>
        {/* เลขบัตรประชาชน */}
        <div className="coolinput">
          <label htmlFor="input" className="text">
            เลขบัตรประชาชน :{" "}
          </label>
          <input
            type="number"
            placeholder="เลขบัตรประชาชน..."
            value={personalData.idCardNumber}
            name="idCardNumber"
            onChange={handleChange}
            className="input"
          />
          {errors.idCardNumber && (
            <label className="text" style={{ color: "red" }}>
              {errors.idCardNumber}
            </label>
          )}
        </div>
        {/* วันเกิด */}
        <div className="coolinput">
          <label htmlFor="input" className="text">
            วันเกิด{" "}
          </label>
          <input
            type="date"
            name="birthDate"
            onChange={handleChange}
            className="input"
            value={personalData.birthDate}
          />
          {errors.birthDate && (
            <label className="text" style={{ color: "red" }}>
              {errors.birthDate}
            </label>
          )}
        </div>
        {/* เบอร์โทร */}
        <div className="coolinput">
          <label htmlFor="input" className="text">
            เบอร์โทร :{" "}
          </label>
          <input
            type="number"
            placeholder="เบอร์โทร..."
            value={personalData.phoneNumber}
            name="phoneNumber"
            onChange={handleChange}
            className="input"
          />
          {errors.phoneNumber && (
            <label className="text" style={{ color: "red" }}>
              {errors.phoneNumber}
            </label>
          )}
        </div>
        {/* อีเมล */}
        <div className="coolinput">
          <label htmlFor="input" className="text">
            อีเมล :{" "}
          </label>
          <input
            type="text"
            placeholder="อีเมล..."
            value={personalData.email}
            name="email"
            onChange={handleChange}
            className="input"
          />
          {errors.email && (
            <label className="text" style={{ color: "red" }}>
              {errors.email}
            </label>
          )}
        </div>
        {/* ไฟล์รูป */}
        <div className="coolinput">
          <label htmlFor="input" className="text">
            รูปบัตรประชาชน :{" "}
          </label>
          <input
            type="file"
            name="idCardImage"
            className="input"
            onChange={(e) =>
              setPersonalData((prev) => ({
                ...prev,
                idCardImage: e.target.files[0],
              }))
            }
          />
          {errors.idCardImage && (
            <label className="text" style={{ color: "red" }}>
              {errors.idCardImage}
            </label>
          )}
        </div>
      </div>
      {/* ปุ่ม */}
      <button
        className="btn-login-driver"
        style={{ marginBottom: "10px" }}
        onClick={handleSubmit}
      >
        <b>ลงทะเบียน</b>
      </button>
    </div>
  );
}

export default RegisterDriver;
