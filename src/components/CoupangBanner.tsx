// src/components/CoupangBanner.tsx

import React from "react";
import { productLinks } from "../data/productLinks";

const CoupangBanner: React.FC = () => {
  const randomProduct =
    productLinks[
      Math.floor(Math.random() * productLinks.length)
    ];

  return (
    <div
      style={{
        margin: "16px 0",
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
      미루지 않을 아이템(쿠팡) 보러가기
    </div>
  );
};

export default CoupangBanner;

