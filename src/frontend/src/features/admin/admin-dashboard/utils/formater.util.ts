import { DateType } from "../hooks/use-admin-dashboard";

export function handleDateFormat(value: string, type: DateType): string {
  const d = new Date(value)

  if (isNaN(d.getTime())) return value;

  if (type === "date") {
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    return `${day}-${month}`; // "05-Jan"
  }
  else if (type === "month") {
    return d.toLocaleString("en-US", { month: "short" });
  }
  else if (type === "year") {
    return d.getFullYear().toString();
  }

  return value
}