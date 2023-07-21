require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/url");
const PORT = process.env.PORT || 1337;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

function cleanKeyword(keyword) {
  return keyword.replace(/\s+/g, "");
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { urlObj: "", message: "" });
});

app.get("/:shortid", async (req, res) => {
  const { shortid } = req.params;

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
  } else res.render("index", { urlObj: "oNo: Not a valid URL.", message: "" });
});

app.post("/short", async (req, res) => {
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
});

app.get("*", (req, res) => res.redirect("/"));

// end of routes

// Setup mongodb connection here
try {
  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.on("open", () => {
    // Wait for mongodb connection before server starts
    app.listen(PORT, () => {
      console.log(`started serving to clients at port ${PORT}!`);
      console.log(process.env.DOMAIN_NAME);
    });
  });
} catch (error) {
  console.log(`something is wrong.`);
  console.log(error);
  console.log(`this is not cool.`);
}
