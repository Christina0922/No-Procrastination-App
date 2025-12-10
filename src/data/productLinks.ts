// src/data/productLinks.ts

export type CoupangProductLink = {
  id: string;
  label: string; // 화면에는 쓰지 않고, 내부 식별용/디버깅용
  url: string;
};

// 누님이 제공한 쿠팡 파트너스 링크만 사용
export const COUPANG_PRODUCT_LINKS: CoupangProductLink[] = [
  {
    id: "rotation-timer",
    label: "회전 타이머",
    url: "https://link.coupang.com/a/c9L672",
  },
  {
    id: "a5-planner",
    label: "A5 플래너",
    url: "https://link.coupang.com/a/c9L7YN",
  },
  {
    id: "focus-light-1",
    label: "집중 독서/공부 조명",
    url: "https://link.coupang.com/a/c9L8ES",
  },
  {
    id: "desk-organizer",
    label: "책상 정리함 세트",
    url: "https://link.coupang.com/a/c9L9eT",
  },
  {
    id: "time-bottle",
    label: "시간표시 물병",
    url: "https://link.coupang.com/a/c9L9EG",
  },
  {
    id: "supplement-organizer",
    label: "영양제 정리함",
    url: "https://link.coupang.com/a/c9MakU",
  },
  {
    id: "cable-organizer",
    label: "케이블 오거나이저",
    url: "https://link.coupang.com/a/c9Ma4W",
  },
  {
    id: "yoga-mat",
    label: "요가매트",
    url: "https://link.coupang.com/a/c9Mbz8",
  },
  {
    id: "stretch-band",
    label: "스트레칭 밴드",
    url: "https://link.coupang.com/a/c9MciU",
  },
  {
    id: "pomodoro-timer",
    label: "포모도로 타이머",
    url: "https://link.coupang.com/a/c9McIL",
  },
  {
    id: "six-ring-diary",
    label: "6공 다이어리",
    url: "https://link.coupang.com/a/c9Mdb8",
  },
  {
    id: "clear-book-stand",
    label: "투명 북스탠드",
    url: "https://link.coupang.com/a/c9MdKJ",
  },
  {
    id: "planner-checklist",
    label: "플래너 / 체크리스트",
    url: "https://link.coupang.com/a/c9Mecx",
  },
  {
    id: "focus-light-2",
    label: "집중용 조명",
    url: "https://link.coupang.com/a/c9MeB6",
  },
  {
    id: "chocolate",
    label: "초콜렛",
    url: "https://link.coupang.com/a/c9Me2f",
  },
];
