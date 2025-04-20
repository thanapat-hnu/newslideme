import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { RegistrationContext } from "../Context";
import axios from "axios";

function RegisterDriver2() {
  const navigator = useNavigate();
  const { personalData, setPersonalData, vehicleData, setVehicleData } =
    useContext(RegistrationContext);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  //   useEffect(() => {
  //     console.log("errorMessages:", errorMessages);
  //   }, [errorMessages]);

  //   useEffect(() => {
  //     console.log("fieldErrors:", fieldErrors);
  //   }, [fieldErrors]);

  useEffect(() => {
    const storedPersonalId = localStorage.getItem("personalId");
    if (storedPersonalId) {
      setVehicleData((prev) => ({
        ...prev,
        personalId: storedPersonalId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setVehicleData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setVehicleData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!vehicleData.licenseType)
      newErrors.licenseType = "กรุณากรอกประเภทใบขับขี่";
    if (!vehicleData.licenseNumber)
      newErrors.licenseNumber = "กรุณากรอกหมายเลขใบขับขี่";
    if (!vehicleData.licenseExpiryDate)
      newErrors.licenseExpiryDate = "กรุณากรอกวันหมดอายุใบขับขี่";
    // if (!vehicleData.licenseImage)
    //   newErrors.licenseImage = "กรุณาอัปโหลดรูปใบขับขี่";
    if (!vehicleData.vehicleType) newErrors.vehicleType = "กรุณากรอกประเภทรถ";
    if (!vehicleData.vehicleBrand) newErrors.vehicleBrand = "กรุณากรอกยี่ห้อรถ";
    if (!vehicleData.vehicleModel) newErrors.vehicleModel = "กรุณากรอกรุ่นรถ";
    if (!vehicleData.plateNumber)
      newErrors.plateNumber = "กรุณากรอกเลขทะเบียนรถ";
    // if (!vehicleData.vehicleImage) newErrors.vehicleImage = "กรุณาอัปโหลดรูปรถ";
    // if (!vehicleData.plateImage)
    //   newErrors.plateImage = "กรุณาอัปโหลดรูปป้ายทะเบียน";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/drivers/registerVehicle",
          vehicleData
        );
        setErrorMessages({});
        setFieldErrors({});
        alert(res.data.message);
        localStorage.removeItem("personalId");
        navigator("/driver/index");
      } catch (err) {
        const data = err.response?.data;
        if (data?.messages) {
          setErrorMessages(data.messages);
          //   console.log(errorMessages);
        }
        if (data?.fields) {
          setFieldErrors(data.fields);
          //   console.log(fieldErrors);
        }
      }
    } else {
      console.log("มีข้อผิดพลาด");
    }
  };

  return (
    <div
      className={styles.containerRegisterDriver}
      style={{ position: "relative" }}
    >
      {/* ปุ่มกลับ */}
      <button
        className={styles.btnBack}
        onClick={() => navigator("/driver/register")}
      >
        <b>＜กลับ</b>
      </button>

      {/* ฟอร์ม */}
      <div className={styles.formReg}>
        <h1 style={{ margin: "0", color: "#14BF61" }}>ข้อมูลรถและใบขับขี่</h1>

        {/* ประเภทใบขับขี่ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>ประเภทใบขับขี่:</label>
          <select
            name="licenseType"
            value={vehicleData.licenseType}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">-- กรุณาเลือกประเภทใบขับขี่ --</option>
            <option value="ใบขับขี่รถจักรยานยนต์">ใบขับขี่รถจักรยานยนต์</option>
            <option value="ใบขับขี่รถยนต์">ใบขับขี่รถยนต์</option>
          </select>
          {errors.licenseType && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.licenseType}
            </label>
          )}
        </div>

        {/* หมายเลขใบขับขี่ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>หมายเลขใบขับขี่:</label>
          <input
            type="number"
            name="licenseNumber"
            value={vehicleData.licenseNumber}
            onChange={handleChange}
            className={styles.input}
          />
          {fieldErrors.license_number && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errorMessages.license_number}
            </label>
          )}
        </div>

        {/* วันหมดอายุใบขับขี่ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>วันหมดอายุใบขับขี่:</label>
          <input
            type="date"
            name="licenseExpiryDate"
            value={vehicleData.licenseExpiryDate}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.licenseExpiryDate && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.licenseExpiryDate}
            </label>
          )}
        </div>

        {/* อัปโหลดรูปใบขับขี่ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>อัปโหลดรูปใบขับขี่:</label>
          <input
            type="file"
            name="licenseImage"
            onChange={handleFileChange}
            className={styles.input}
          />
          {errors.licenseImage && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.licenseImage}
            </label>
          )}
        </div>

        {/* ประเภทรถ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>ประเภทรถ:</label>
          <select
            name="vehicleType"
            value={vehicleData.vehicleType}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">-- กรุณาเลือกประเภทรถ --</option>
            <option value="รถจักรยานยนต์">รถจักรยานยนต์</option>
            <option value="รถยนต์">รถยนต์</option>
          </select>
          {errors.vehicleType && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.vehicleType}
            </label>
          )}
        </div>

        {/* ยี่ห้อรถ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>ยี่ห้อรถ:</label>
          <input
            type="text"
            name="vehicleBrand"
            value={vehicleData.vehicleBrand}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.vehicleBrand && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.vehicleBrand}
            </label>
          )}
        </div>

        {/* รุ่นรถ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>รุ่นรถ:</label>
          <input
            type="text"
            name="vehicleModel"
            value={vehicleData.vehicleModel}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.vehicleModel && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.vehicleModel}
            </label>
          )}
        </div>

        {/* เลขทะเบียนรถ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>เลขทะเบียนรถ:</label>
          <input
            type="text"
            name="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.plateNumber && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.plateNumber}
            </label>
          )}
          {fieldErrors.plate_number && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errorMessages.plate_number}
            </label>
          )}
        </div>

        {/* อัปโหลดรูปรถ */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>อัปโหลดรูปรถ:</label>
          <input
            type="file"
            name="vehicleImage"
            onChange={handleFileChange}
            className={styles.input}
          />
          {errors.vehicleImage && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.vehicleImage}
            </label>
          )}
        </div>

        {/* อัปโหลดรูปป้ายทะเบียน */}
        <div className={styles.coolInput}>
          <label className={styles.labelText}>อัปโหลดรูปป้ายทะเบียน:</label>
          <input
            type="file"
            name="plateImage"
            onChange={handleFileChange}
            className={styles.input}
          />
          {errors.plateImage && (
            <label className={styles.labelText} style={{ color: "red" }}>
              {errors.plateImage}
            </label>
          )}
        </div>

        {/* ปุ่มยืนยัน */}
        <button
          className={styles.btnLoginDriver}
          style={{ marginBottom: "10px" }}
          onClick={handleSubmit}
        >
          <b>ยืนยัน</b>
        </button>
      </div>
    </div>
  );
}

export default RegisterDriver2;
