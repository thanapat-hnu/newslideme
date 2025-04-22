import style from "./popupJob.module.css";
import { useState, useContext, useEffect } from "react";
import { RegistrationContext } from "../Context";

function PopupJob() {
  const [price, setPrice] = useState(0);
  const [data, setData] = useState({
    locationA: "กาญจนบุรี",
    locationB: "ชลบุรี",
  });

  const [description, setDescription] = useState({
    descriptionA: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    descriptionB: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  });

  const { status, setStatus } = useContext(RegistrationContext);

  const handleClose = () => {
    setStatus("");
  };

  const handleAccept = () => {
    setStatus("working");
  };

  //   useEffect(() => {}, []);

  return (
    <div className={style.container}>
      <button className={style.closeButton} onClick={handleClose}>
        ✖
      </button>
      <div className={style.priceSection}>
        <label className={style.price}>{price}&nbsp;</label>
        <label className={style.unit}>บาท</label>
      </div>

      {/* <hr className={style.hr} /> */}

      <div className={style.locationSection}>
        <div className={style.location}>
          <label className={style.dotGreen}></label>
          {data.locationA}
          <br />
          <label className={style.description}>
            {description.descriptionA}
          </label>
        </div>
        <div className={style.verticalLine}></div>
        <div className={style.location}>
          <label className={style.dotRed}></label>
          {data.locationB}
          <br />
          <label className={style.description}>
            {description.descriptionB}
          </label>
        </div>
      </div>

      <button className={style.confirmButton} onClick={handleAccept}>
        ยืนยัน
      </button>
    </div>
  );
}

export default PopupJob;
