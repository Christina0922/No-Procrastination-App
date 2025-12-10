// src/utils/coupang.ts

import { COUPANG_PRODUCT_LINKS, CoupangProductLink } from "../data/productLinks";

/**
 * 날짜 + 시간 기반의 "가짜 랜덤" 인덱스를 만드는 함수.
 * - 같은 사용자에게는 같은 시(hour) 동안 항상 같은 상품이 노출됨.
 * - 시간이 바뀌면 다른 상품이 나올 수 있음.
 * - 별도 저장소(localStorage) 사용 없이, 순수 계산으로 해결.
 */
export function getHourlyRandomProductLink(): CoupangProductLink {
  const now = new Date();

  // YYYYMMDDHH 형태의 숫자를 seed로 사용
  const seed =
    now.getFullYear() * 1000000 +
    (now.getMonth() + 1) * 10000 +
    now.getDate() * 100 +
    now.getHours();

  const index = Math.abs(seed) % COUPANG_PRODUCT_LINKS.length;
  return COUPANG_PRODUCT_LINKS[index];
}
