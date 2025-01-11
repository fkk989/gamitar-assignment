"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridHistory = exports.currentGridContext = exports.allTimeLines = exports.gridHistory = void 0;
exports.resetGridHistory = resetGridHistory;
exports.addGridHistory = addGridHistory;
exports.gridHistory = {};
exports.allTimeLines = [];
exports.currentGridContext = Array.from({ length: 10 }, (_, row) => Array.from({ length: 10 }, (_, col) => ({
    char: "",
    row,
    col,
})));
function resetGridHistory() {
    exports.gridHistory = {};
    exports.allTimeLines = [];
    exports.currentGridContext = Array.from({ length: 10 }, (_, row) => Array.from({ length: 10 }, (_, col) => ({
        char: "",
        row,
        col,
    })));
}
function addGridHistory(timestamp, payload) {
    exports.currentGridContext[payload.row][payload.col] = payload;
    // interval window to group message
    const INTERVAL_WINDOW = 60 * 1000;
    ;
    if (exports.allTimeLines.length === 0) {
        exports.allTimeLines.push(timestamp);
        exports.gridHistory[timestamp] = [payload];
        return;
    }
    // Find an existing timeline within the INTERVAL_WINDOW
    const existingTimeline = exports.allTimeLines.find((timeLine) => timestamp - timeLine < INTERVAL_WINDOW && timestamp >= timeLine);
    if (existingTimeline !== undefined) {
        exports.gridHistory[existingTimeline].push(payload);
    }
    else {
        // Create a new timeline if no match is found
        exports.gridHistory[timestamp] = [payload];
        exports.allTimeLines.push(timestamp);
    }
    console.log("gridHistory: ", exports.gridHistory);
}
const getGridHistory = (timeLine) => {
    if (timeLine === 0)
        return;
    return exports.gridHistory[exports.allTimeLines[exports.allTimeLines.length - timeLine]];
};
exports.getGridHistory = getGridHistory;
