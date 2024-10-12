// App.jsx
import React, { useState, useEffect } from "react";
import MemberCard from "./components/MemberCard";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    // Lấy dữ liệu từ API
    fetch('https://randomuser.me/api/?results=20')
      .then((response) => response.json())
      .then((data) => setUsers(data.results));
  }, []);

  const handleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index], // Lật hoặc không lật thẻ
    }));
  };

  return (
    <div className="App">
      <h1>Member List</h1>
      <div className="member-list">
        {users.map((user, index) => (
          <div
            key={user.login.uuid}
            className={`card-container ${flippedCards[index] ? 'flipped' : ''}`}
            onClick={() => handleFlip(index)}
          >
            <div className="card">
              {/* Mặt trước */}
              <div className="card-front">
                <img src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} />
                <h3>{`${user.name.first} ${user.name.last}`}</h3>
                <p>Gender: {user.gender}</p>
              </div>

              {/* Mặt sau */}
              <div className="card-back">
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Cell: {user.cell}</p>
                <p>Location: {`${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`}</p>
                <p>PostCode: {user.location.postcode}</p>
                <p>Date of Birth: {new Date(user.dob.date).toLocaleDateString()} (Age: {user.dob.age})</p>
                <p>Registered: {new Date(user.registered.date).toLocaleDateString()} (Age: {user.registered.age})</p>
                <p>Nationality: {user.nat}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;