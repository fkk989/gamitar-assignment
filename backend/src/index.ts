import httpServer from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

function init() {
  httpServer.listen(PORT, () => {
    console.log(`server start at http://localhost:${PORT}`);
  });
}
init();
