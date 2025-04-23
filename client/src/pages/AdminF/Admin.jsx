import { useEffect, useState } from "react";

const Admin = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // เรียก API login แบบ mock ไว้ตรงนี้ (ควรเก็บ user/pass จริงๆ มาจากหน้าก่อนหน้า)
    const login = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: "user", pass: "pass" }),
        });

        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        } else {
          console.log("Login failed");
        }
      } catch (err) {
        console.error("Error logging in:", err);
      }
    };

    login();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      {userInfo ? (
        <div>
          <p>Welcome, <strong>{userInfo.token}</strong>!</p>
          <p>Role: <strong>{userInfo.role}</strong></p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Admin;
