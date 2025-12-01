// src/pages/RewardPage.tsx

import React, { useState, useEffect } from "react";
import { getRewards, validatePoints, exchangeReward, Reward } from "../api/gift";

const RewardPage: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setRewards(getRewards());

    const savedPoints = localStorage.getItem("userPoints");
    setUserPoints(savedPoints ? Number(savedPoints) : 0);
  }, []);

  const handleExchange = async (reward: Reward) => {
    if (!validatePoints(userPoints, reward.points)) {
      setMessage("포인트가 부족합니다.");
      return;
    }

    await exchangeReward(reward.id);
    
    const newPoints = userPoints - reward.points;
    setUserPoints(newPoints);
    localStorage.setItem("userPoints", String(newPoints));

    setMessage(`🎉 '${reward.name}' 교환 완료!`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>보상 교환하기</h2>
      <p>내 포인트: <strong>{userPoints}P</strong></p>

      {message && (
        <div style={{ 
          marginTop: "10px",
          padding: "12px",
          background: "#ffe4e1",
          borderRadius: "8px"
        }}>
          {message}
        </div>
      )}

      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        marginTop: "18px"
      }}>
        {rewards.map((r) => (
          <div key={r.id} style={{
            border: "1px solid #ddd",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            background: "#fff"
          }}>
            <img
              src={r.imageUrl}
              alt={r.name}
              style={{ width: "80px", height: "80px", marginBottom: "10px" }}
            />
            <h4>{r.name}</h4>
            <p>{r.description}</p>
            <p><strong>{r.points}P</strong></p>

            <button
              onClick={() => handleExchange(r)}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "10px",
                background: "#ff6f91",
                border: "none",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              교환하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardPage;
