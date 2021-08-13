const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const dotenv = require("dotenv");
require("./database/connection")();
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

app.listen(PORT, () => console.log(`server listen on port number ${PORT}`));
