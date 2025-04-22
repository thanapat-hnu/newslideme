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
import RabNgein from "../rabngein/rabngein";

const socket = io("http://localhost:3000");

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
    fff,
    setFff,
  } = useContext(RegistrationContext);

  const [isProfile, setIsProfile] = useState(false);
  const token = localStorage.getItem("driverToken");

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
      setStatus("sending");

      try {
        const res = await axios.get("http://localhost:3000/api/orders", {
          params: { order_id: data.orderId },
        });

        const orderData = res.data.order;
        console.log("Order data:", orderData);

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

    return () => {
      socket.off("jobRequest");
      socket.off("sendJob");
    };
  }, []);

  const handleOnline = () => {
    setStatus("sending");
  };

  const decryptToken = async (token) => {
    if (!token) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/drivers/decode-token",
        { token }
      );

      const decodedEmail = response.data.data?.email;
      if (!decodedEmail) {
        console.warn("Decoded token has no email.");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:3000/api/drivers/getPersonal",
          {
            params: { email: decodedEmail },
          }
        );

        setPersonal({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          id: res.data.id,
          id_card_number: res.data.id_card_number,
          birth_date: res.data.birth_date,
          phone_number: res.data.phone_number,
          email: res.data.email,
          id_card_image: res.data.id_card_image,
          created_at: res.data.created_at,
        });

        socket.emit("idPersonal", res.data.id);

        // socket.on("idPersonal", (data) => {
        //   console.log("Received idPersonal:", data);
        // })

      } catch (err) {
        console.error("Error fetching personal info:", err);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleProfileClick = () => {
    setIsProfile((prev) => !prev);
    if (!isProfile) {
      decryptToken(token);
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
          onClick={handleProfileClick}
        ></button>
        {isProfile && (
          <div className={styles.profilePopup}>
            {personal.first_name} {personal.last_name}
          </div>
        )}
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
      </div>

      {/* แผนที่ */}
      <div className={styles.map} id="map">
        <DriverMap />
      </div>

      {status === "sending" && <PopupJob />}
      {status === "working" && <Working />}
      {fff && <RabNgein />}
    </div>
  );
}

export default Main;
