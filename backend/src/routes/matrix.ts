import { Router } from "express";
import {
  currentGridContext,
  getGridHistory,
} from "../utils/helpers/matrixHelper";

export const matrixRouter = Router();

matrixRouter.get("/current", (req, res) => {
  try {
    res.json({
      context: currentGridContext,
    });
  } catch (error: any) {
    res.send(error.message);
  }
});

matrixRouter.get("/history", (req, res) => {
  try {
    const { timeLine } = req.query;

    

    if (!timeLine || Number(timeLine) < 1) {
      res.status(400).send("please provide time");
      return;
    }

    const gridHistory = getGridHistory(Number(timeLine));

    res.json({
      history: gridHistory,
    });
  } catch (error: any) {
    res.send(error.message);
  }
});
