// App.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "./App.css";

import Layout from "./src/layouts/layout/layout";
import Home from "./src/pages/home/home";
import Profileedit from "./src/pages/Profileedit/Profileedit";
import Login from "./src/pages/Login/Login";
import Inputphone from "./src/pages/Inputphone/Inputphone";
import OTP from "./src/pages/OTP/OTP";
import Register from "./src/pages/Register/Register";
import Create from "./src/pages/Create/Create";
import List from "./src/pages/list/list";
import History from "./src/pages/history/history";
import Chat from "./src/pages/chat/chat";
import Payment from "./src/pages/Payment/Payment";

import ServiceStatus from "./src/pages/servicestatus/ServiceStatus"; // ✅ เพิ่มตรงนี้

// import driver
import DriverHome from "./src/driver/home/home";
import RegisterDriver from "./src/driver/register/register";
import RegisterDriver2 from "./src/driver/register/register2";
import Main from "./src/driver/main/main";
import LoginDriver from "./src/driver/login/LoginDriver";
import Order from "./src/driver/Order/Order";
import HistoryDri from "./src/driver/Order/HistoryDri";
import DriverChat from "./src/driver/driverchat/driverchat";
import RabNgein from "./src/driver/rabngein/rabngein";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="container-app">
      <Router basename="/slide_me2">
        <Routes>
          {/* redirect หน้าแรกไป login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* layout routes */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/history" element={<History />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profileedit />} />
            <Route path="/servicestatus" element={<ServiceStatus />} />
          </Route>

          {/* auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/inputphone" element={<Inputphone />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/payment" element={<Payment />} />


          
          

          {/* driver routes */}
          <Route path="/driver/index" element={<DriverHome />} />
          <Route path="/driver/register" element={<RegisterDriver />} />
          <Route path="/driver/register2" element={<RegisterDriver2 />} />
          <Route path="/driver/main" element={<Main />} />
          <Route path="/driver/login" element={<LoginDriver />} />
          <Route path="/driver/orders" element={<Order />} />
          <Route path="/driver/history" element={<HistoryDri />} />
          <Route path="/driver/chat" element={<DriverChat />} />
          <Route path="/driver/rabngein" element={<RabNgein />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
