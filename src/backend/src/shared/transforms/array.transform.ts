import { Transform } from "class-transformer";

export function RemoveDuplicates() {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      return Array.from(new Set(value));
    }
    return value;
  });
}