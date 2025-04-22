import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./user.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [modalData, setModalData] = useState({
    show: false,
    userId: null,
    action: "",
    reason: "",
  });

  const [statusFilter, setStatusFilter] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      return data.map((user) => ({
        ...user,
        id: user.id || user._id || "",
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUser();

      // Auto reset status if block expired
      const now = new Date();
      const updatedUsers = data.map((user) => {
        if (
          user.status === "block" &&
          user.blockUntil &&
          new Date(user.blockUntil) < now
        ) {
          return { ...user, status: "approved", blockUntil: null };
        }
        return user;
      });

      setUsers(updatedUsers);
    };

    getUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/approve/${id}`, {
        method: "POST",
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, approved: true, status: "approved" }
            : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "block") {
      setModalData({ show: true, userId: id, action: "block", reason: "" });
    } else if (newStatus === "unblock") {
      const confirm = window.confirm("คุณต้องการปลดการ Block หรือไม่?");
      if (confirm) {
        updateUserStatus(id, "approved");
      }
    } else {
      updateUserStatus(id, newStatus);
    }
  };

  const updateUserStatus = async (id, status, reason = "") => {
    try {
      await fetch(`http://localhost:5000/users/status/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, status, reason } : user
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const confirmStatusChange = async () => {
    const { userId, action, reason } = modalData;

    try {
      if (action === "reject") {
        await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "DELETE",
        });
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } else if (action === "block") {
        await blockUserWithSetting(userId);
      } else {
        await fetch(`http://localhost:5000/api/users/status/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action, reason }),
        });
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: action, reason } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }

    setModalData({ show: false, userId: null, action: "", reason: "" });
  };

  const blockUserWithSetting = async (userId) => {
    const res = await fetch("http://localhost:5000/block/latest");
    const data = await res.json();

    const totalMs =
      ((data.days || 0) * 24 * 60 * 60 +
        (data.hours || 0) * 60 * 60 +
        (data.minutes || 0) * 60) *
      1000;

    const blockUntil = new Date(Date.now() + totalMs).toISOString();

    await fetch(`http://localhost:5000/users/block/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blockUntil,
        reason: modalData.reason,
      }),
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: "block", blockUntil, reason: modalData.reason }
          : user
      )
    );
  };

  const checkBlockStatus = (blockUntil) => {
    const currentTime = new Date();
    const blockDate = new Date(blockUntil);
    return blockDate > currentTime;
  };

  // const getStatusLabel = (status) => {
  //   switch (status) {
  //     case "approved":
  //       return "อนุมัติแล้ว";
  //     case "block":
  //       return "ถูกบล็อก";
  //     case "unblock":
  //       return "ปลดบล็อก";
  //     case "reject":
  //       return "ปฏิเสธ";
  //     default:
  //       return status;
  //   }
  // };

  const filteredUsers = users.filter((user) => {
    const uid = String(user.id);
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    
    // Filter by search term
    let matchesSearchTerm = uid.includes(searchTerm) || fullName.includes(searchTerm.toLowerCase());
  
    // Filter by status
    if (statusFilter) {
      if (statusFilter === "pending" && user.status !== "pending") matchesSearchTerm = false;
      if (statusFilter === "approved" && user.status !== "approved") matchesSearchTerm = false;
      if (statusFilter === "block" && user.status !== "block") matchesSearchTerm = false;
    }
  
    return matchesSearchTerm;
  });
  

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-4">User List</h1>
        <div>
          <label className="me-2">สถานะ:</label>
          <select
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            <option value="pending">รออนุมัติ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="block">กำลังถูกบล็อก</option>
          </select>
        </div>
        <input
          type="text"
          className="form-control w-25"
          placeholder="ค้นหา UID หรือชื่อ"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>UID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                ไม่พบข้อมูล
              </td>
            </tr>
          ) : (
            currentUsers.map((user) => {
              const isBlocked =
                user.status === "block" && checkBlockStatus(user.blockUntil);
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phone_number}</td>
                  <td>
                    {!user.approved ? (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleApprove(user.id)}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            setModalData({
                              show: true,
                              userId: user.id,
                              action: "reject",
                              reason: "",
                            })
                          }
                        >
                          ปฏิเสธ
                        </button>
                      </>
                    ) : isBlocked ? (
                      <select
                        className="form-select"
                        value="block"
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value)
                        }
                      >
                        <option value="block" disabled>
                          กำลังถูกบล็อก
                        </option>
                        <option value="unblock">Unblock</option>
                      </select>
                    ) : (
                      <select
                        className="form-select"
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value)
                        }
                      >
                        <option value="approved">อนุมัติแล้ว</option>
                        <option value="block">Block</option>
                      </select>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅️ ย้อนกลับ
          </button>
          <span>
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ถัดไป ➡️
          </button>
        </div>
      )}

      {modalData.show && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  ยืนยันการ{" "}
                  {modalData.action === "block"
                    ? "Block"
                    : modalData.action === "unblock"
                    ? "Unblock"
                    : modalData.action === "reject"
                    ? "ปฏิเสธ"
                    : modalData.action}
                </h5>
              </div>
              <div className="modal-body">
                <p>คุณแน่ใจหรือไม่ว่าต้องการ {modalData.action} ผู้ใช้นี้?</p>
                <textarea
                  className="form-control"
                  placeholder="กรุณาระบุเหตุผล"
                  value={modalData.reason}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setModalData({
                      show: false,
                      userId: null,
                      action: "",
                      reason: "",
                    })
                  }
                >
                  ยกเลิก
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmStatusChange}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
