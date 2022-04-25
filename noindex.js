const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

const articles = [];
const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-change",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
];
newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});
app.get("/", (req, res) => {
  res.json("Welcome to my climmate change news api");
});
app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaper = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  );
  const newspaperAddress = newspaper[0].address;
  const newspaperBase = newspaper[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      let specificArticles = [];
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperBase,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
  //   console.log(newspaper);
});

app.get("/news", (req, res) => {
  res.json(articles);
});
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
