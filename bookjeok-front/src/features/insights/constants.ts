import { ReviewReactionType } from "@/features/review/types";

// 색상 팔레트: 말차색 + 크림 + 머스타드
export const COLORS = {
  // 말차색 (메인)
  matcha: {
    dark: "#4b6043",
    medium: "#658354",
    light: "#7a9968",
  },
  // 크림/베이지 (서브)
  cream: {
    light: "#faf7f2",
    medium: "#f5f0e6",
    dark: "#e8dfd0",
  },
  // 머스타드 (포인트)
  mustard: {
    light: "#f0d78c",
    medium: "#e5b84c",
    dark: "#d4a72c",
  },
} as const;

export const CHART_COLORS = {
  primary: COLORS.matcha.dark,
  secondary: COLORS.mustard.dark,
  tertiary: COLORS.matcha.medium,
  quaternary: COLORS.mustard.medium,
  quinary: COLORS.matcha.light,
  senary: COLORS.mustard.light,
} as const;

// 막대 차트 색상
export const BAR_CHART_COLORS = [
  COLORS.matcha.dark,
  COLORS.matcha.medium,
  COLORS.matcha.light,
  COLORS.mustard.dark,
  COLORS.mustard.medium,
  COLORS.mustard.light,
  COLORS.matcha.dark,
  COLORS.matcha.medium,
  COLORS.matcha.light,
  COLORS.mustard.dark,
  COLORS.mustard.medium,
  COLORS.mustard.light,
];

// 리액션 타입별 색상
export const REACTION_COLORS: Record<string, string> = {
  [ReviewReactionType.LIKE]: "#e07a5f", // 따뜻한 코랄
  [ReviewReactionType.INSIGHTFUL]: COLORS.mustard.dark,
  [ReviewReactionType.SUPPORT]: COLORS.matcha.medium,
};

// 활동 추이 차트 색상
export const TREND_COLORS = {
  sales: COLORS.matcha.dark,
  reviews: COLORS.mustard.dark,
};

// 가격 구간 레이블
export const PRICE_RANGE_LABELS: Record<string, string> = {
  "0-5000": "~5천원",
  "5000-10000": "5천~1만원",
  "10000-20000": "1~2만원",
  "20000-30000": "2~3만원",
  "30000-50000": "3~5만원",
  "50000-100000": "5~10만원",
};
