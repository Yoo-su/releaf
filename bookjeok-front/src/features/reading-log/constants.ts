export const READING_LOG_COLORS = {
  // 말차색 (메인) & 인사이트 페이지 색상 참조
  matcha: {
    dark: "#4b6043", // 차트 기본 색상
    medium: "#658354", // 차트 보조 색상
    light: "#7a9968", // 차트 3순위 색상
    bg: "#ebf2e8", // 연한 배경색
  },
  // 포인트 (머스타드)
  mustard: {
    dark: "#d4a72c",
    medium: "#e5b84c",
    light: "#f0d78c",
  },
  gray: {
    border: "#f3f4f6", // 회색 100
    text: "#374151", // 회색 700
    subText: "#9ca3af", // 회색 400
  },
} as const;

export const MAX_MEMO_LENGTH = 50;
