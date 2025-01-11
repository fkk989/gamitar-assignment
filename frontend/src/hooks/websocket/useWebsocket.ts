import { useCallback, useEffect, useRef, useState } from "react";
import { WS_URL } from "../../utils/constants";
import { MessageType, Payload } from "../../utils/types";
import toast from "react-hot-toast";

export interface WebSocketParam {
  matrix: {
    char: string;
    isDisabled: boolean;
  }[][];
  setMatrix: React.Dispatch<React.SetStateAction<WebSocketParam["matrix"]>>;
  isInHistory: boolean;
}

export const useWebsocket = ({ setMatrix, isInHistory }: WebSocketParam) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  // Queue for pending updates due to server failure or any reason
  const pendingUpdates = useRef<
    {
      type: MessageType;
      payload: Payload<MessageType>;
    }[]
  >([]);

  //
  useEffect(() => {
    const socketConnection = new WebSocket(WS_URL);

    socketConnection.onopen = () => {
      // checking if there any update in pending updates
      pendingUpdates.current.forEach((message) => {
        socketConnection.send(JSON.stringify(message));
      });

      setSocket(socketConnection);

      socketConnection.onmessage = async (event) => {
        const { type, payload } = JSON.parse(event.data) as {
          type: MessageType;
          payload: Payload<MessageType>;
        };

        if (type === "update" && !isInHistory) {
          const { row, col, char } = payload as Payload<"update">;
          setMatrix((currentMatrix) => {
            const updatedMatrix = [...currentMatrix];
            updatedMatrix[row][col].char = char;
            return updatedMatrix;
          });
        }

        if (type === "user-count") {
          const { count } = payload as Payload<"user-count">;
          setOnlineUsers(count);
        }

        if (type === "error") {
          const { message } = payload as Payload<"error">;
          toast.error(message);
        }
      };
    };

    // Clean up on unmount
    return () => {
      socketConnection.close();
      setSocket(null);
    };
  }, [isInHistory]);
  //
  const sendMessage = useCallback(
    (payload: Payload<"update">) => {
      if (!socket) {
        pendingUpdates.current.push({ type: "update", payload });
        return;
      }

      socket.send(
        JSON.stringify({
          type: "update",
          payload,
        })
      );
    },
    [socket]
  );

  return { sendMessage, onlineUsers };
};
