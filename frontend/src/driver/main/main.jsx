import "boxicons";
import "./main.css";
import { useState } from "react";
// import Map from '../map/map';

function Main() {
  const [status, setStatus] = useState(false);
  const [income, setIncome] = useState(false);

  return (
    <div className="container-main">
      {/* รายได้,โปรไฟล์ */}
      <div className="btn-top">
        {/* รายได้ */}
        <button
          className="btn-income"
          onClick={() => {
            setIncome(!income);
          }}
        >
          <box-icon
            type={income ? "" : "solid"}
            name={income ? "x" : "bar-chart-alt-2"}
            color="#fff"
          ></box-icon>
          &nbsp;{income ? "" : "รายได้"}
        </button>
        {income ? (
          <>
            <button className="btn-income-value">
              <label htmlFor="" className="label-income">รายได้</label><br />
              <label htmlFor="" className="label-value">1,000</label>
              <label htmlFor="" className="label-icon">฿</label>
            </button>
          </>
        ) : (
          ""
        )}
        {/* โปรไฟล์ */}
        <label className="profile-img" />
      </div>
      {/* ปุ่มออนไลน์ */}
      <button
        className="btn-online"
        onClick={() => {
          setStatus(!status);
        }}
        style={
          status
            ? { backgroundColor: "#14BF61" }
            : { backgroundColor: "#232323" }
        }
      >
        <box-icon name="power-off" color="#ffffff"></box-icon>&nbsp;ออนไลน์
      </button>
      {/* ปุ่มด้านล่าง */}
      <div className="btn-bottom">
        {/* ปุ่ม ... */}
        <div className="btn-bottom-item1">
          <div className="btn-bottom-icon">
            <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
          </div>
          <label htmlFor="">btn1</label>
        </div>
        {/* ปุ่ม ... */}
        <div className="btn-bottom-item2">
          <div className="btn-bottom-icon">
            <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
          </div>
          <label htmlFor="">btn2</label>
        </div>
        {/* ปุ่ม ... */}
        <div className="btn-bottom-item3">
          <div className="btn-bottom-icon">
            <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
          </div>
          <label htmlFor="">btn3</label>
        </div>
        {/* ปุ่ม ... */}
        <div className="btn-bottom-item4">
          <div className="btn-bottom-icon">
            <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
          </div>
          <label htmlFor="">btn4</label>
        </div>
      </div>
      {/* แผนที่ */}
      <div id="map">{/* <Map /> */}</div>
    </div>
  );
}

export default Main;
