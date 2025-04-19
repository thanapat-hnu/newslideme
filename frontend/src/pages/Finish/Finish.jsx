import React, { useState } from 'react';
import './Finish.css';
import Payment from '../../Payment/Payment';

function Finish({
  showfinish,
  mapHeight,
  setMapHeight,
  payment,
  setPayment,
  name = 'ไม่ระบุชื่อบริการ',
  price = 0,
  carType,
  setPrice,
  mid,
  mid2
}) {
  const [height, seHeight] = useState('390px');
  const [statepm, setStatePm] = useState(false);
  const [stateTruck, setStateTruck] = useState(false);
  const [statefinish, setStatefinish] = useState(false);

  const getLineWidth = () => {
    let baseWidth = 80;
    if (statepm) baseWidth += 80;
    if (stateTruck) baseWidth += 80;
    if (statefinish) baseWidth += 80;
    return Math.max(baseWidth - 80, 80) + 'px';
  };

  const handleButtonClick = () => {
    if (!statepm) {
      setPayment(true);
      setStatePm(true);
    } else if (!stateTruck) {
      setStateTruck(true);
    } else if (!statefinish) {
      setStatefinish(true);
    }
  };

  return (
    <div
      style={{
        height: height,
        display: showfinish === true ? 'flex' : 'none',
      }}
      className="container-finish"
    >
      <div className="bg-finish">
        <div className="bg-finish3">
          <button
            onClick={() => {
              if (height === 180) {
                seHeight(390);
                setMapHeight('385px');
              } else {
                setMapHeight('597px');
                seHeight(180);
              }
            }}
            className="bg-finish10"
          >
            <i
              className={
                height === 180
                  ? 'bi bi-chevron-compact-up'
                  : 'bi bi-chevron-compact-down'
              }
            ></i>
          </button>
          <div className="font20">ขั้นตอน</div>
          <div className="font16">ระยะเวลาที่รอ 30 นาทีโดยประมาณ</div>
        </div>

        <div className="bg-finish2">
          <div className="bg-finish11">
            <i className="bi bi-check-lg"></i>
          </div>
          <div className={'bg-finish12 ' + (statepm ? 'green1' : '')}>
            <i className="bi bi-credit-card-fill"></i>
          </div>
          <div
            className={
              'bg-finish13 ' +
              (stateTruck ? 'green1' : statepm ? 'yellow1' : '')
            }
          >
            <i className="bi bi-car-front-fill"></i>
          </div>
          <div
            className={
              'bg-finish14 ' +
              (statefinish ? 'green1' : stateTruck ? 'yellow1' : '')
            }
          >
            <i className="bi bi-flag-fill"></i>
          </div>
          <div className="line1"></div>
          <div
            style={{
              width: getLineWidth(),
            }}
            className="line2"
          ></div>
        </div>

        <div
          style={{
            display: height <= 180 ? 'none' : 'flex',
          }}
          className="bg-finish5"
        >
          <div className="bg-finish4">
            <i className="bi bi-person-circle"></i>
          </div>
          <div>{name}</div>
          <div className="bg-finish7">
            <button
              onClick={() => {
                console.log('chat');
              }}
              className="bg-finish4"
            >
              <i className="bi bi-chat-text-fill"></i>
            </button>
            <button
              onClick={() => {
                console.log('call');
              }}
              className="bg-finish4"
            >
              <i className="bi bi-telephone-fill"></i>
            </button>
          </div>
        </div>

        <div
          style={{
            display: height <= 180 ? 'none' : 'flex',
          }}
          className="bg-finish6"
        >
          <span>ยอดที่ต้องชำระ</span>
          <span>{price}฿</span>
        </div>

        <button
          style={{
            display: height <= 180 ? 'none' : 'flex',
          }}
          className="btn btn-success"
          onClick={handleButtonClick}
        >
          {statefinish
            ? 'เสร็จสิ้น'
            : stateTruck
            ? 'ถึงที่หมาย'
            : statepm
            ? 'เริ่มงาน'
            : 'ชำระเงิน'}
        </button>

        {payment === true && (
          <Payment
            setPayment={setPayment}
            carType={carType}
            price={price}
            name={name}
            setPrice={setPrice}
            mid={mid}
            mid2={mid2}
          />
        )}
      </div>
    </div>
  );
}

export default Finish;
