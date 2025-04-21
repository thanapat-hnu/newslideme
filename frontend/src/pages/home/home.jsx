import { useState } from 'react';

import LongdoMap from '../map/LongdoMap';
import Locat from '../local/local';
import Confirm from '../buttonconfirm/confirm';
import Options from '../options/options';
import Pin from '../pin/pin';
import Finish from '../Finish/Finish';

import './home.css';

function Home() {
  const [button, setButton] = useState('');
  const [local, setLocal] = useState({  });
  const [readLocal, setReadLocal] = useState({ lat: 0, lng: 0 });
  const [readLocalB, setReadLocalB] = useState({ lat: 0, lng: 0 });
  const [options, setOptions] = useState('');
  const [service, setService] = useState(false);
  const [showService, setShowService] = useState(false);
  const [showData, setShowData] = useState(new Date());
  const [getData, setGetData] = useState('');
  const [buttonText, setButtonText] = useState('ค้นหาผู้ให้บริการ');
  const [showMarker, setShowMarker] = useState(null);
  const [showfinish, setShowFinish] = useState(null);
  const [showMenu, setShowMenu] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [mapHeight, setMapHeight] = useState('774px');
  const [payment, setPayment] = useState(false);
  const [towTruckData, setTowTruckData] = useState([]);
  const [name, setName] = useState('บริการลากจูดเร็วทันใจ');
  const [carType, setCarType] = useState('');
  const [carNumber, setCarNumber] = useState(555);
  const [price, setPrice] = useState(1500);
  const [mid, setMid] = useState('');
  const [mid2, setMid2] = useState('');

  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });

  return (
    <div className='container-home'>
      <LongdoMap
        readLocal={readLocal}
        readLocalB={readLocalB}
        showMarker={showMarker}
        setLocal={setLocal}
        local={local}
        mapHeight={mapHeight}
        towTruckData={towTruckData}
        name={name}
        carType={carType}
        carNumber={carNumber}
        price={price}
      />
      <Locat
        button={button}
        setButton={setButton}
        readLocal={readLocal}
        readLocalB={readLocalB}
        setReadLocal={setReadLocal}
        setReadLocalB={setReadLocalB}
        options={options}
        service={service}
        setService={setService}
        showData={showData}
        setShowData={setShowData}
        getData={getData}
        setGetData={setGetData}
        formatDate={formatDate}
        showService={showService}
        setShowService={setShowService}
        buttonText={buttonText}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setMid={setMid}
        setMid2={setMid2}
        setLocal={setLocal}
      />
      <Options
        button={button}
        setButton={setButton}
        setOptions={setOptions}
        towTruckData={towTruckData}
        setTowTruckData={setTowTruckData}
      />
      <Confirm
        local={local}
        button={button}
        setButton={setButton}
        readLocal={readLocal}
        setReadLocal={setReadLocal}
        readLocalB={readLocalB}
        setReadLocal2={setReadLocalB}
        options={options}
        setOptions={setOptions}
        service={service}
        setService={setService}
        getData={getData}
        setGetData={setGetData}
        showData={showData}
        showService={showService}
        setShowService={setShowService}
        buttonText={buttonText}
        setButtonText={setButtonText}
        showMarker={showMarker}
        setShowMarker={setShowMarker}
        setShowFinish={setShowFinish}
        showButton={showButton}
        setShowButton={setShowButton}
        setLocal={setLocal}
      />
      <Pin button={button} setButton={setButton} />
      <Finish
        showfinish={showfinish}
        setShowFinish={setShowFinish}
        mapHeight={mapHeight}
        setMapHeight={setMapHeight}
        payment={payment}
        setPayment={setPayment}
        name={name}
        carType={carType}
        carNumber={carNumber}
        price={price}
        setPrice={setPrice}
        mid={mid}
        mid2={mid2}
      />
    </div>
  );
}

export default Home;
