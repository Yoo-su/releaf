import { artKeys } from "./art";
import { authKeys } from "./auth";
import { bookKeys } from "./book";
import { chatKeys } from "./chat";
import { commentKeys } from "./comment";
import { insightsKeys } from "./insights";
import { reviewKeys } from "./review";
import { userKeys } from "./user";

export const QUERY_KEYS = {
  artKeys,
  bookKeys,
  chatKeys,
  commentKeys,
  authKeys,
  insightsKeys,
  userKeys,
  reviewKeys,
} as const;
