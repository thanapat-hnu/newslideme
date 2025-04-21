import React, { useState, useEffect } from "react";
import Calendars from "../calendar/calendar";
import "./local.css";
import axios from "axios";

function Locat({
  button,
  setButton,
  readLocal,
  readLocalB,
  setReadLocal,
  setReadLocalB,
  options,
  service,
  setService,
  showData,
  setShowData,
  getData,
  setGetData,
  formatDate,
  showService,
  setShowService,
  buttonText,
  showMenu,
  setShowMenu,
  setLocal
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [placeNameA, setPlaceNameA] = useState("ตำแหน่งต้นทาง");
  const [placeNameB, setPlaceNameB] = useState("ตำแหน่งปลายทาง");

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length < 3) return setSearchResults([]);
  
    try {
      const res = await axios.get("http://localhost:3000/api/search-location", {
        params: { keyword: value },
      });
  
      // 🔁 บันทึกคำค้นหา
      await axios.post("http://localhost:3000/api/search-log", {
        keyword: value,
      });
  
      const results = res.data.map((item) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
      }));
  
      setSearchResults(results);
    } catch (err) {
      console.error("❌ Search error:", err);
    }
  };

  const handleSelectPlace = (place) => {
    const newLoc = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    setSearchQuery("");
    setSearchResults([]);
    setLocal(newLoc); // วาร์ปไป
    if (button === "a") {
      setPlaceNameA(place.name);
    } else if (button === "b") {
      setPlaceNameB(place.name);
    }
  };

  return (
    <div
      className="container-locat"
      style={showMenu ? { display: "grid" } : { display: "none" }}
    >

      {/* 🔴 ปุ่มต้นทาง */}
      <button
        className="button"
        onClick={() => setButton(button === "a" ? "" : "a")}
        style={button === "a" ? { border: "1px solid #14BF61" } : {}}
        disabled={buttonText === "..."}
      >
        <div className="bg-i bg-red">
          <i className="bi bi-geo-alt-fill red"></i>
        </div>
        <h4 className="h4">{placeNameA}</h4>
      </button>

      {/* 🟢 ปุ่มปลายทาง */}
      <button
        className="button"
        onClick={() => setButton(button === "b" ? "" : "b")}
        style={button === "b" ? { border: "1px solid #14BF61" } : {}}
        disabled={buttonText === "..."}
      >
        <div className="bg-i bg-green">
          <i className="bi bi-geo-alt-fill green"></i>
        </div>
        <h4 className="h4">{placeNameB}</h4>
      </button>

      {/* 🔍 ช่อง search แสดงเฉพาะเมื่อเลือก a หรือ b */}
      {(button === "a" || button === "b") && (
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="ค้นหาสถานที่..."
            className="search-input"
          />
          {searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((place, index) => (
                <li key={index} onClick={() => handleSelectPlace(place)}>
                  {place.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ✅ ประเภทรถ & เวลา เหมือนเดิม */}
      <div className="sub-container-box">
        <button
          className="button-b"
          onClick={() => setButton(button === "c" ? "" : "c")}
          disabled={buttonText === "..."}
        >
          <div className="bg-i bg-green">
            <i className="bi bi-car-front-fill green"></i>
          </div>
          <h4 className="h4">{options === "" ? "เลือกประเภทรถ" : options}</h4>
        </button>

        <button
          className="button-c"
          onClick={() => {
            if (service) {
              setService(false);
            } else {
              setShowService(!showService);
              setService(true);
            }
          }}
          disabled={buttonText === "..."}
        >
          {service ? formatDate(showData) : "ตอนนี้"}
          <i className="bi bi-chevron-compact-down"></i>
        </button>
      </div>

      <div>
        <Calendars
          service={service}
          setService={setService}
          showData={showData}
          setShowData={setShowData}
          formatDate={formatDate}
          showService={showService}
          setShowService={setShowService}
        />
      </div>
    </div>
  );
}

export default Locat;
