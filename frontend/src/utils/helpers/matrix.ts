import { SetStateAction } from "react";
import { WebSocketParam } from "../../hooks/websocket";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../constants";

export async function fetchCurrentContext(
  setMatrix: WebSocketParam["setMatrix"]
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/matrix/current`);
    const { context } = (await res.json()) as {
      context: WebSocketParam["matrix"];
    };

    console.log("current" , context)
    setMatrix(context);
  } catch (e: any) {
    console.log("error while fetching current context", e.message);
  }
}

export async function getGridHistory(
  timeLine: number,
  setMatrix: WebSocketParam["setMatrix"],
  setTimeLine: React.Dispatch<SetStateAction<number>>,
  type: "forward" | "backward"
) {
  if (timeLine == 0) {
    toast.error("No more history", { id: "no-history" });
    return;
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/matrix/history?timeLine=${timeLine}`
    );

    const data = (await res.json()) as {
      history: [
        {
          row: number;
          col: number;
          char: string;
        }
      ];
    };

    if (!data.history) {
      toast.error("No more history", { id: "no-history" });
      return;
    }

    if (type === "forward") {
      setTimeLine((prev) => {
        let updatedCount = prev;
        if (updatedCount > 1) {
          updatedCount = updatedCount - 1;
        }
        return updatedCount;
      });
    } else {
      setTimeLine((prev) => prev + 1);
    }

    setMatrix(() => {
      const updatedMatrix: WebSocketParam["matrix"] = Array.from(
        { length: 10 },
        () =>
          Array.from({ length: 10 }, () => ({
            char: "",
            isDisabled: false,
          }))
      );

      data.history.forEach(({ row, col, char }) => {
        updatedMatrix[row][col].char = char;
      });
      return updatedMatrix;
    });
  } catch (e: any) {
    console.log("error while fetching grid history", e.message);
  }
}
