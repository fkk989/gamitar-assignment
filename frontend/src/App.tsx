import "./App.css";
import { Matrix } from "./components";

function App() {
  return (
    <div className="w-screen h-screen bg-lime-500 flex flex-col">
      {/**/}
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Matrix rows={10} columns={10} />
      </div>
      {/*  */}
    </div>
  );
}

export default App;
