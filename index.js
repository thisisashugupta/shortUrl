require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/url");
const PORT = process.env.PORT || 1337;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { urlObj: "" });
});

app.get("/:shortid", async (req, res) => {
  const { shortid } = req.params;
  let data = await ShortUrl.findOne({ short: shortid });

  if (data) {
    console.log(`URL requested: ${data.full}`);
    console.log(`with ${data.clicks} clicks`);

    // before redirecting, increment the click of this data
    data.clicks++;
    await data.save();

    const script = `
    <script>
      // Open URL in a new tab
      // window.open('${data.full}', '_blank');
      
      // Redirect the current tab
      window.location.href = '${data.full}';
    </script>
  `;

    res.send(script);

    // res.redirect(data.full);
  } else res.render("index", { urlObj: "oNo: Not a valid URL." });
});

app.post("/short", async (req, res) => {
  const { fullUrl } = req.body;
  const record = new ShortUrl({
    full: fullUrl,
  });
  await record.save();

  res.render("index", {
    urlObj: `${process.env.DOMAIN_NAME}${record.short}`,
  });
});

app.get("*", (req, res) => res.redirect("/"));

// end of routes

// Setup mongodb connection here
try {
  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.on("open", () => {
    // Wait for mongodb connection before server starts
    app.listen(PORT, () =>
      console.log(`started serving to clients at port ${PORT}!`)
    );
  });
} catch (error) {
  console.log(`something is wrong.`);
  console.log(error);
  console.log(`this is not cool.`);
}
