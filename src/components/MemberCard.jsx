// components/MemberCard.jsx
import React, { useState } from "react";
import "./MemberCard.css";

function MemberCard({ member }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`card-container ${isFlipped ? "flipped" : ""}`} onClick={handleCardClick}>
      <div className="card">
        {/* Mặt trước của thẻ */}
        <div className="card-front">
          <h2>{`${member.name.first} ${member.name.last}`}</h2>
          <p>Gender: {member.gender}</p>
        </div>
        {/* Mặt sau của thẻ */}
        <div className="card-back">
          <p>Age: {member.dob.age}</p>
          <p>Address: {`${member.location.street.number} ${member.location.street.name}, ${member.location.city}, ${member.location.country}, ${member.location.postcode}`}</p>
          <p>Email: {member.email}</p>
        </div>
      </div>
    </div>
  );
}

export default MemberCard;