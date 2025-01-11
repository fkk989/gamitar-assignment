import { Payload } from "../types";

interface GridHistory {
  [minuteKey: string]: Payload[];
}

export let gridHistory: GridHistory = {};
export let allTimeLines: number[] = [];
export let currentGridContext = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 10 }, (_, col) => ({
    char: "",
    row,
    col,
  }))
);

export function resetGridHistory() {
  gridHistory = {};
  allTimeLines = [];
  currentGridContext = Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => ({
      char: "",
      row,
      col,
    }))
  );
}

export function addGridHistory(timestamp: number, payload: Payload) {
  currentGridContext[payload.row][payload.col] = payload;

  if (allTimeLines.length === 0) {
    allTimeLines.push(timestamp);
    gridHistory[timestamp] = [payload];

    return;
  }
  // interval window of 1 second to group message
  const INTERVAL_WINDOW = 1000;

  // Findind an existing timeline within the INTERVAL_WINDOW
  const existingTimeline = allTimeLines.find(
    (timeLine) =>
      timestamp - timeLine < INTERVAL_WINDOW && timestamp >= timeLine
  );

  if (existingTimeline !== undefined) {
    gridHistory[existingTimeline].push(payload);
  } else {
    // Createing a new timeline if no match is found
    gridHistory[timestamp] = [payload];
    allTimeLines.push(timestamp);
  }

  console.log("gridHistory: ", gridHistory);
}

export const getGridHistory = (timeLine: number) => {
  if (timeLine === 0 && timeLine! > allTimeLines.length) return;
  return gridHistory[allTimeLines[allTimeLines.length - timeLine]];
};
