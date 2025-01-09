const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const brandRoute = require("./routes/brandRoute");
const colorRoute = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const productCategoryRoute = require("./routes/porductCategoryRoute");
const blogCategoryRoute = require("./routes/bolgCategoryRoute");
const couponRoute = require("./routes/couponRoute");
const uploadRoute = require("./routes/uploadRoute");
const bodyParser = require("body-parser");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

app.use(morgan("dev"));
// app.use(cors());
app.use(
  cors({
    origin: "https://vishwakarmastore.netlify.app/",
    methods: ["GET", "POST", "PUT", "DELETE"], // Adjust based on your API methods
    credentials: true, // If you're sending cookies or HTTP auth
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// connect to mongodb
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/brand", brandRoute);
app.use("/api/category", productCategoryRoute);
app.use("/api/blogCategory", blogCategoryRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRoute);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
