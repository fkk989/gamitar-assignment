import { useCallback, useEffect, useState } from "react";
import { fetchCurrentContext } from "../../utils/helpers/matrix";
import { useWebsocket } from "../websocket";

export function useMatrix(rows: number, columns: number) {
  //
  const [matrix, setMatrix] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({
        char: "",
        isDisabled: false,
      }))
    )
  );

  //state for managing grid history
  const [timeLine, setTimeLine] = useState(0);
  const [isInHistory, setIsInHistory] = useState(false);

  // fetching current matrix context for new user
  useEffect(() => {
    fetchCurrentContext(setMatrix);
  }, []);

  const [payload, setPayload] = useState<{
    row: number;
    col: number;
    char: string;
  } | null>(null);

  const [startCountDown, setStartCountDown] = useState(false);

  const { sendMessage, onlineUsers } = useWebsocket({
    matrix,
    setMatrix,
    isInHistory,
  });

  useEffect(() => {
    console.log("payload: ", payload);
    console.log("matrix: ", matrix);
  }, [payload, matrix]);

  const disableCells = useCallback((visibility: boolean) => {
    setMatrix((currentMatrix) =>
      currentMatrix.map((row) =>
        row.map((cell) => ({
          ...cell,
          isDisabled: visibility,
        }))
      )
    );
  }, []);

  const handleChange = useCallback(
    (rowIndex: number, colIndex: number, value: any) => {
      // setting message
      console.log("no payload: ", !payload);
      if (value && !payload) {
        setPayload({ row: rowIndex, col: colIndex, char: value });
      }
      if (!value) {
        setPayload(null);
      }

      setMatrix((currentMatrix) => {
        const updatedMatrix = [...currentMatrix];

        // diabling all input except the one user intracted with
        if (value) {
          updatedMatrix.forEach((row) => {
            row.forEach((col) => {
              col.isDisabled = true;
            });
          });
        } else {
          updatedMatrix.forEach((row) => {
            row.forEach((col) => {
              col.isDisabled = false;
            });
          });
        }
        updatedMatrix[rowIndex][colIndex].isDisabled = false;

        //
        if (value) {
          if (!updatedMatrix[rowIndex][colIndex].char) {
            updatedMatrix[rowIndex][colIndex].char = value;
          }
        } else {
          updatedMatrix[rowIndex][colIndex].char = "";
        }
        return updatedMatrix;
      });
    },
    [payload, matrix]
  );

  return {
    matrix,
    setMatrix,
    timeLine,
    setTimeLine,
    payload,
    setPayload,
    sendMessage,
    onlineUsers,
    disableCells,
    handleChange,
    startCountDown,
    setStartCountDown,
    isInHistory,
    setIsInHistory,
  };
}
