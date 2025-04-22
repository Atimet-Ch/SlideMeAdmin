import { useState, useEffect } from "react";
import axios from "axios";

const Notification = () => {
  const [incidents, setIncidents] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("/api/incidents")
      .then(response => setIncidents(response.data))
      .catch(error => console.error("There was an error fetching incidents", error));
  }, []);

  const handleAccept = (id) => {
    axios.put(`/api/incidents/accept/${id}`)
      .then(response => {
        setIncidents(incidents.map(incident => incident._id === id ? response.data : incident));
      })
      .catch(error => console.error("There was an error accepting the incident", error));
  };

  const handleReject = (id) => {
    const reason = rejectionReasons[id];
    if (!reason) {
      alert("กรุณาระบุเหตุผลในการปฏิเสธ");
      return;
    }
    axios.put(`/api/incidents/reject/${id}`, { reason })
      .then(response => {
        setIncidents(incidents.map(incident => incident._id === id ? response.data : incident));
      })
      .catch(error => console.error("There was an error rejecting the incident", error));
  };

  const handleReasonChange = (id, value) => {
    setRejectionReasons(prev => ({ ...prev, [id]: value }));
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === "all") return true;
    return incident.status === filter;
  });

  return (
    <div>
      <h1>แจ้งเตือนเหตุการณ์</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="filter">แสดงรายการ: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          <option value="accepted">รับเรื่องแล้ว</option>
          <option value="rejected">ถูกปฏิเสธ</option>
        </select>
      </div>

      {filteredIncidents.length === 0 ? (
        <p>ไม่มีรายการในหมวดนี้</p>
      ) : (
        <ul>
          {filteredIncidents.map((incident) => (
            <li
              key={incident._id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3>{incident.title}</h3>
              <p>{incident.detail}</p>
              <p>
                <strong>ผู้แจ้ง:</strong> {incident.reportedBy}
              </p>
              <p>
                <strong>สถานะ:</strong>{" "}
                {incident.status === "pending"
                  ? "รอดำเนินการ"
                  : incident.status === "accepted"
                  ? "รับเรื่องแล้ว"
                  : "ถูกปฏิเสธ"}
              </p>

              {incident.status === "pending" && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button className="btn btn-primary"
                    onClick={() => handleAccept(incident._id)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    รับเรื่อง
                  </button>
                  <input
                    type="text"
                    placeholder="เหตุผลในการปฏิเสธ"
                    value={rejectionReasons[incident._id] || ""}
                    onChange={(e) =>
                      handleReasonChange(incident._id, e.target.value)
                    }
                    style={{ marginRight: "0.5rem" }}
                  />
                  <button className="btn btn-danger" onClick={() => handleReject(incident._id)}>ปฏิเสธ</button>
                </div>
              )}

              {incident.status === "rejected" && incident.reason && (
                <p><strong>เหตุผลที่ปฏิเสธ:</strong> {incident.reason}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;