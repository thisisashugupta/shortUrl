require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/url");
const rateLimiter = require("./rate-limiter");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("visiting home route");
  res.render("index", { urlObj: "", message: "" });
});

app.get(
  "/:shortid",
  rateLimiter({ secondsWindow: 60, allowedHits: 20 }),
  async (req, res) => {
    console.log("visiting :shortid route");
    const { shortid } = req.params;
    // database query
    let data = await ShortUrl.findOne({ short: shortid });

    if (data) {
      // before redirecting, increment the click of this data
      data.clicks++;
      console.log(`URL requested: ${data.full}`);
      console.log(`with ${data.clicks} clicks`);
      await data.save();

      const script = `<script> window.location.href = '${data.full}'; </script>`;

      res.send(script);

      // res.redirect(data.full);
    } else
      res.render("index", { urlObj: "oNo: Not a valid URL.", message: "" });
  }
);

app.post(
  "/short",
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  async (req, res) => {
    const { fullUrl, short } = req.body;
    let record,
      shortKW = cleanKeyword(short);

    if (shortKW === "") {
      // just add the default value to the record
      record = new ShortUrl({
        full: fullUrl,
      });
      await record.save();
    } else {
      // search in the db if short is available
      const result = await ShortUrl.findOne({ short: shortKW });
      if (result !== null) {
        /* return and ask for another short */ return res.render("index", {
          urlObj: "",
          message: "this short keyword is not available. try another one.",
        });
      }

      record = new ShortUrl({
        full: fullUrl,
        short: shortKW,
      });
      await record.save();
    }

    return res.render("index", {
      urlObj: `${process.env.DOMAIN_NAME}${record.short}`,
      message: "",
    });
  }
);

app.get("*", (req, res) => res.redirect("/"));

// end of routes

function cleanKeyword(keyword) {
  return keyword.replace(/\s+/g, "");
}

// mongodb connection setup and then starting server
try {
  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.on("open", () => {
    // Wait for mongodb connection before server starts
    app.listen(process.env.PORT || 1337, () => {
      console.log(
        `started serving to clients at port ${process.env.PORT || 1337}!`
      );
      console.log(process.env.DOMAIN_NAME);
    });
  });
} catch (error) {
  console.log(`something is wrong.`);
  console.log(error);
  console.log(`this is not cool.`);
}
