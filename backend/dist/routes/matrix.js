"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrixRouter = void 0;
const express_1 = require("express");
const matrixHelper_1 = require("../utils/helpers/matrixHelper");
exports.matrixRouter = (0, express_1.Router)();
exports.matrixRouter.get("/current", (req, res) => {
    try {
        res.json({
            context: matrixHelper_1.currentGridContext,
        });
    }
    catch (error) {
        res.send(error.message);
    }
});
exports.matrixRouter.get("/history", (req, res) => {
    try {
        const { timeLine } = req.query;
        if (!timeLine || Number(timeLine) < 1) {
            res.status(400).send("please provide time");
            return;
        }
        const gridHistory = (0, matrixHelper_1.getGridHistory)(Number(timeLine));
        res.json({
            history: gridHistory,
        });
    }
    catch (error) {
        res.send(error.message);
    }
});
