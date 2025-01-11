import React, { useState, useEffect, SetStateAction } from "react";

export interface CountdownProps {
  disableCells: (visiblity: boolean) => void;
  setStart: React.Dispatch<SetStateAction<boolean>>;
}

export const Countdown: React.FC<CountdownProps> = ({
  setStart,
  disableCells,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      setStart(false);
      disableCells(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full h-[50px] bg-[#0000009f] flex justify-center items-center text-white font-bold text-[16px] rounded-md cursor-not-allowed">
        Wait for : {timeLeft} seconds
      </div>
    </div>
  );
};
