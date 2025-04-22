// src/driver/home/main/main.jsx
import { useState, useContext, useEffect } from "react";
import "boxicons";
import styles from "./main.module.css";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { RegistrationContext } from "../Context";
import DriverMap from "../drivermap/DriverMap";
import PopupJob from "../popupJob/popupJob";
import Working from "../working/working";
import axios from "axios";

const socket = io("http://localhost:3000");

// testcommit
function Main() {
  const [income, setIncome] = useState(false);
  const navigator = useNavigate();
  const {
    location,
    setLocation,
    status,
    setStatus,
    order,
    setOrder,
    personal,
    setPersonal,
  } = useContext(RegistrationContext);

  const [isProfile, setIsProfile] = useState(false);
  const getLocationAddress = async (latLngString) => {
    try {
      const matches = latLngString.match(/lat:([\d.]+),lng:([\d.]+)/);
      if (!matches) {
        console.error("Invalid lat,lng format:", latLngString);
        return null;
      }

      const [, lat, lng] = matches;
      console.log("Extracted coordinates:", { lat, lng });

      const response = await axios.get(
        "http://localhost:3000/api/reverse-geocode-longdo",
        {
          params: { lat, lng },
        }
      );

      // แปลงข้อมูลที่ได้จาก Longdo API เป็น string
      const addressData = response.data;
      const formattedAddress = [
        addressData.road,
        addressData.subdistrict,
        addressData.district,
        addressData.province,
        addressData.postcode,
      ]
        .filter(Boolean)
        .join(" ");

      console.log("Formatted address:", formattedAddress);
      return {
        coordinates: { lat, lng },
        formattedAddress,
      };
    } catch (error) {
      console.error("Error getting address:", error);
      return {
        coordinates: null,
        formattedAddress: "ไม่สามารถระบุที่อยู่ได้",
      };
    }
  };

  useEffect(() => {
    socket.on("sendJob", async (data) => {
      console.log("Received job data:", data);
      setStatus("sending"); // เพิ่มบรรทัดนี้เพื่อให้แน่ใจว่า popup จะแสดง

      try {
        const res = await axios.get("http://localhost:3000/api/orders", {
          params: { order_id: data.orderId },
        });

        const orderData = res.data.order;
        // setOrder({});
        console.log("Order data:", orderData);

        // แปลงพิกัดเป็นที่อยู่
        const origin = await getLocationAddress(orderData.origin);
        const destination = await getLocationAddress(orderData.destination);

        console.log("Processed addresses:", { origin, destination });

        if (origin && destination) {
          setOrder({
            ...orderData,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            order_datetime: res.data.order_datetime,
            order_id: res.data.order_id,
            phone: res.data.phone,
            shop_name: res.data.shop_name,
            vehicle_type: res.data.vehicle_type,
            origin: {
              coordinates: origin.coordinates,
              address: origin.formattedAddress,
            },
            destination: {
              coordinates: destination.coordinates,
              address: destination.formattedAddress,
            },
          });
        }
      } catch (err) {
        console.error("Error processing order:", err);
      }
    });

    socket.on("jobRequest", (data) => {
      console.log("Received job request:", data);
      setLocation(data);
    });

    getPersonalInfo();

    return () => {
      socket.off("jobRequest");
      socket.off("sendJob");
    };
  }, []);

  const handleOnline = () => {
    setStatus("sending");
  };

  const getPersonalInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/drivers/getPersonal",
        {
          params: {
            email: personal.email, // replace with actual email
          },
        }
      );
      console.log("xxxxxxxxxxx:",response.data);
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  return (
    <div className={styles.containerMain}>
      {/* รายได้, โปรไฟล์ */}
      <div className={styles.btnTop}>
        {/* รายได้ */}
        <button className={styles.btnIncome} onClick={() => setIncome(!income)}>
          <box-icon
            type={income ? "" : "solid"}
            name={income ? "x" : "bar-chart-alt-2"}
            color="#fff"
          ></box-icon>
          &nbsp;{income ? "" : "รายได้"}
        </button>

        {income && (
          <button className={styles.btnIncomeValue}>
            <label className={styles.labelIncome}>รายได้</label>
            <br />
            <label className={styles.labelValue}>1,000</label>
            <label className={styles.labelIcon}>฿</label>
          </button>
        )}

        {/* โปรไฟล์ */}
        <button
          className={styles.profileImg}
          onClick={() => setIsProfile(!isProfile)}
        ></button>
        {isProfile && <div className={styles.profilePopup}>ชื่อ นามสกุล</div>}
      </div>

      {/* ปุ่มด้านล่าง */}
      <div className={styles.btnBottom}>
        <div className={styles.btnBottomItem1}>
          <div className={styles.btnBottomIcon}>
            <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
          </div>
          <label>btn1</label>
        </div>

        <div
          className={styles.btnBottomItem2}
          onClick={() => navigator("/driver/orders")}
        >
          <div className={styles.btnBottomIcon}>
            <box-icon name="task" color="#fff"></box-icon>
          </div>
          <label>งานที่รับ</label>
        </div>

        {/* {["btn3", "btn4"].map((labelText, i) => (
          <div key={i + 3} className={styles[`btnBottomItem${i + 3}`]}>
            <div className={styles.btnBottomIcon}>
              <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
            </div>
            <label>{labelText}</label>
          </div>
        ))} */}
      </div>

      {/* แผนที่ */}
      <div className={styles.map} id="map">
        <DriverMap />
      </div>

      {status === "sending" && <PopupJob />}
      {status === "working" && <Working />}
    </div>
  );
}

export default Main;
