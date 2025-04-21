// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import './App.css';

import Layout from './layouts/layout/layout';
import Home from './pages/home/home';
import Profileedit from './pages/Profileedit/Profileedit';
import Login from './pages/Login/Login';
import Inputphone from './pages/Inputphone/Inputphone';
import OTP from './pages/OTP/OTP';
import Register from './pages/Register/Register';
import Create from './pages/Create/Create';
import List from './pages/list/list';
import History from './pages/history/history';
import Chat from './pages/chat/chat';
import Payment from './Payment/Payment';
import TesterD from './pages/TesterD/TesterD';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className='container-app'>
      <BrowserRouter basename="/slide_me2">
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
            <Route path="/tester-d" element={<TesterD />} />
          </Route>

          {/* auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/inputphone" element={<Inputphone />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/payment" element={<Payment />} />

          {/* fallback route (optional) */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
