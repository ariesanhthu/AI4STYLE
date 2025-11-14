import { Data } from "../types/data.type"

const chartDataByMonth = [
  { time: "2025-01-01", value: 186 },
  { time: "2025-02-02", value: 305 },
  { time: "2025-03-03", value: 237 },
  { time: "2025-04-04", value: 73 },
  { time: "2025-05-05", value: 209 },
  { time: "2025-06-06", value: 214 },
]

const chartDataByDate = [
  { time: "2025-01-01", value: 1 },
  { time: "2025-01-02", value: 5 },
  { time: "2025-01-03", value: 45 },
  { time: "2025-01-04", value: 12 },
  { time: "2025-01-05", value: 42 },
  { time: "2025-01-06", value: 12 }
]

const chartDataByYear = [
  { time: "2025", value: 12322 },
  { time: "2024", value: 51123 },
  { time: "2023", value: 45412 },
  { time: "2022", value: 1212 },
  { time: "2021", value: 42123 },
  { time: "2020", value: 12421 }
]
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const analysService = {
  async getDataByDate(): Promise<Data[]> {
    await delay(500);

    return chartDataByDate
  },

  async getDataByMonth(): Promise<Data[]> {
    await delay(500);
    return chartDataByMonth
  },

  async getDataByYear(): Promise<Data[]> {
    await delay(500);
    return chartDataByYear
  }
}


