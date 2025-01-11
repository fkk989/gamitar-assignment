import React from "react";
import { Countdown } from "./Countdown";
import toast from "react-hot-toast";
import { Back } from "./Back";
import { Forward } from "./Forward";
import { fetchCurrentContext, getGridHistory } from "../utils/helpers/matrix";
import { useMatrix } from "../hooks/matrix/useMatrix";

interface MatrixProp {
  rows: number;
  columns: number;
}

export const Matrix: React.FC<MatrixProp> = ({ rows, columns }) => {
  const {
    matrix,
    setMatrix,
    isInHistory,
    setIsInHistory,
    handleChange,
    timeLine,
    setTimeLine,
    startCountDown,
    setStartCountDown,
    disableCells,
    sendMessage,
    payload,
    setPayload,
    onlineUsers,
  } = useMatrix(rows, columns);

  return (
    <div className="flex flex-col gap-[5px]">
      {/* total online user  */}
      <div className="fixed top-[30px] right-[50px] w-[200px] tab:w-[250px] h-[50px] bg-black flex justify-center items-center text-white font-bold text-[20px] rounded-md">
        Players online: {onlineUsers != 0 ? onlineUsers : "N"}
      </div>
      <>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-[5px] ">
            {row.map((cellData, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                disabled={isInHistory ? true : cellData.isDisabled}
                value={cellData.char}
                onChange={(e) => {
                  const value = e.target.value;
                  e.target.setSelectionRange(value.length, value.length);
                  handleChange(rowIndex, colIndex, value);
                }}
                ref={(input) => {
                  if (input) {
                    const length = input.value.length;
                    input.onclick = () => {
                      input.setSelectionRange(length, length);
                    };
                  }
                }}
                onKeyDown={(e) => {
                  // preventing user from moving cursor
                  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault();
                  }
                }}
                className="w-[30px] h-[30px] mobile:w-[40px] mobile:h-[40px] tab:w-[50px] tab:h-[50px]  pc:w-[60px] pc:h-[60px] text-center font-bold text-[18px] border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
            ))}
          </div>
        ))}
      </>
      <div className="w-full flex justify-center items-center gap-[20px] mt-[10px]">
        {/* back btn */}
        <button
          onClick={() => {
            setIsInHistory(true);
            getGridHistory(timeLine + 1, setMatrix, setTimeLine, "backward");
          }}
          className="w-[50px] h-[50px] bg-black hover:bg-[#201f1f] flex justify-center items-center text-white font-bold text-[20px] rounded-md"
        >
          <Back />
        </button>
        {/* countdown after every request */}
        {startCountDown ? (
          <Countdown disableCells={disableCells} setStart={setStartCountDown} />
        ) : (
          <button
            onClick={() => {
              if (!payload) {
                toast.error("No block updated");
                return;
              }
              sendMessage(payload);
              disableCells(true);
              setStartCountDown(true);
              setPayload(null);
            }}
            className="w-[200px] tab:w-[250px] h-[50px] bg-black hover:bg-[#201f1f] flex justify-center items-center text-white font-bold text-[20px] rounded-md"
          >
            Submit
          </button>
        )}
        {/* forward btn */}
        <button
          onClick={() => {
            getGridHistory(timeLine - 1, setMatrix, setTimeLine, "forward");
          }}
          className="w-[50px] h-[50px] bg-black hover:bg-[#201f1f] flex justify-center items-center text-white font-bold text-[20px] rounded-md"
        >
          <Forward />
        </button>
      </div>
      {/* will show if user is checkint history */}
      {isInHistory && (
        <button
          onClick={() => {
            setIsInHistory(false);
            fetchCurrentContext(setMatrix);
            setTimeLine(0);
          }}
          className="w-full h-[50px] bg-black hover:bg-[#201f1f] flex justify-center items-center text-white font-bold text-[20px] rounded-md"
        >
          Go Live
        </button>
      )}
    </div>
  );
};
