// src/components/CoupangBanner.tsx

import React from "react";
import { getHourlyRandomProductLink } from "../utils/coupang";

const CoupangBanner: React.FC = () => {
  const product = getHourlyRandomProductLink();
  const randomProduct = product?.url || "";

  return (
    <div style={{ marginTop: "16px", marginBottom: "0" }}>
      <div
        style={{
          padding: "14px",
          textAlign: "center",
          background: "#ffb6c1",
          color: "#333",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "16px"
        }}
        onClick={() => window.open(randomProduct, "_blank")}
      >
        미루지 않게 도와주는 습관템 보러가기
      </div>
      <p
        style={{
          fontSize: "11px",
          color: "#999",
          textAlign: "center",
          marginTop: "8px",
          marginBottom: "0",
          lineHeight: "1.4",
          padding: "0"
        }}
      >
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
};

export default CoupangBanner;



