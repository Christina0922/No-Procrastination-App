// src/components/CoupangRandomLink.tsx

import React from "react";
import { getHourlyRandomProductLink } from "../utils/coupang";

const CoupangRandomLink: React.FC<any> = () => {
  const product = getHourlyRandomProductLink();

  const handleClick = () => {
    if (!product?.url) return;

    // 쿠팡 상품 상세 페이지를 새 탭으로 열기
    window.open(product.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="coupang-random-link-wrapper">
      <button
        type="button"
        className="coupang-banner-button"
        onClick={handleClick}
      >
        미루지 않게 도와주는 습관템 보러가기
      </button>
    </div>
  );
};

export default CoupangRandomLink;
