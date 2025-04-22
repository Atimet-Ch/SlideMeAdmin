import { useState, useEffect } from "react";
import "./setting.css";

const Setting = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleConfirm = async () => {
    const res = await fetch("http://localhost:5000/block/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days, hours, minutes }),
    });
  
    if (res.ok) {
      alert(`บันทึกเวลาบล็อก: ${days} วัน ${hours} ชม. ${minutes} นาที`);
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };
  

  const handleCancel = () => {
    setDays(0);
    setHours(0);
    setMinutes(0);
  };

  useEffect(() => {
    const fetchSavedTime = async () => {
      const res = await fetch("http://localhost:5000/block/get");
      if (res.ok) {
        const data = await res.json();
        setDays(data.days);
        setHours(data.hours);
        setMinutes(data.minutes);
      }
    };
    fetchSavedTime();
  }, []);
  

  return (
    <div className="setting-container">
      <h1 className="heading">ตั้งวันที่ในการ Block ผู้ใช้งาน</h1>

      <div>
        <div className="container-items">
          <label className="whitespace-nowrap">วัน</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <label className="whitespace-nowrap">ชั่วโมง</label>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <label className="whitespace-nowrap">นาที</label>
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="buttons">
        <button
          onClick={handleCancel}
          className="btn btn-danger"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleConfirm}
          className="btn btn-primary"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};

export default Setting;
