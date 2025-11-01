import { ESortOrder } from "../enums";

export interface PaginationCursorInput {
  cursor: string | null;
  limit: number;
  sortOrder?: ESortOrder;
  filter?: Record<string, any>;
}

export interface PaginationCursorOutput<T> {
  items: T[];
  nextCursor: string | null;
}