import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/dictionary/definition/:language/:word", (req, res) => {
  const { language, word } = req.params;
  console.log(word);
  console.log(language);
  res.send("Testing");
});
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
