import { useEffect, useState } from "react";

function Service() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <div>
      <h1>Car List</h1>
      <ul>
        {cars.map((car) => (
          <li key={car._id}>
            {car.title} — Completed: {car.completed}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Service;
