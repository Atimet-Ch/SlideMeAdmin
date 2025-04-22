import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Ads() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // กรองสถานะ
  const [sortOrder, setSortOrder] = useState('new-old'); // การจัดเรียง

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/items');
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('startDate', form.startDate);
    formData.append('endDate', form.endDate);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/items/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/items', formData);
      }
      setForm({ name: '', startDate: '', endDate: '', image: null });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = item => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      startDate: item.startDate.slice(0, 16), // Include hours and minutes
      endDate: item.endDate.slice(0, 16), // Include hours and minutes
      image: null
    });
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:5000/api/items/${id}`);
    fetchItems();
  };

  // ฟังก์ชันฟิลเตอร์สถานะ
  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'กำลังจะเริ่ม';
    if (now >= start && now <= end) return 'เริ่มแล้ว';
    if (now > end) return 'หมดอายุแล้ว';
    return '';
  };

  // ฟังก์ชันฟิลเตอร์และจัดเรียง
  const currentDateTime = new Date().toISOString().slice(0, 16); // Get current date and time in ISO format (YYYY-MM-DDTHH:MM)

  // กรองสถานะ
  const filteredItems = items.filter(item => {
    if (statusFilter === '') return true; // ถ้าไม่มีฟิลเตอร์เลือกสถานะ ให้แสดงทั้งหมด
    return getStatus(item.startDate, item.endDate) === statusFilter;
  });

  // จัดเรียง
  const sortedItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    if (sortOrder === 'new-old') {
      return dateB - dateA; // ใหม่-เก่า
    } else {
      return dateA - dateB; // เก่า-ใหม่
    }
  });

  return (
    <div className="container">
      <h2>{editingId ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="ชื่อรายการ"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          min={currentDateTime}
          required
        />
        <input
          type="datetime-local"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          min={currentDateTime}
          required
        />
        <input type="file" name="image" onChange={handleChange} accept="image/*" />
        <button type="submit">{editingId ? 'อัปเดต' : 'บันทึก'}</button>
      </form>

      <hr />

      {/* ฟิลเตอร์สถานะ */}
      <div>
        <label>ฟิลเตอร์สถานะ: </label>
        <select onChange={e => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">ทั้งหมด</option>
          <option value="กำลังจะเริ่ม">กำลังจะเริ่ม</option>
          <option value="เริ่มแล้ว">เริ่มแล้ว</option>
          <option value="หมดอายุแล้ว">หมดอายุแล้ว</option>
        </select>
      </div>

      {/* ฟิลเตอร์จัดเรียง */}
      <div>
        <label>ฟิลเตอร์จัดเรียง: </label>
        <select onChange={e => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="new-old">ใหม่-เก่า</option>
          <option value="old-new">เก่า-ใหม่</option>
        </select>
      </div>

      <h3>รายการทั้งหมด</h3>
      <ul>
        {sortedItems.map(item => (
          <li key={item._id}>
            <p>📌 {item.name}</p>
            <p>📅 {new Date(item.startDate).toLocaleString()} - {new Date(item.endDate).toLocaleString()}</p>
            {item.image && (
              <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} width="200" />
            )}
            <br />
            <button onClick={() => handleEdit(item)}>แก้ไข</button>
            <button onClick={() => handleDelete(item._id)}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ads;
