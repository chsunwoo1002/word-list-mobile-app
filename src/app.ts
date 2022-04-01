import express from "express";

const app = express();
const port = 4444;

app.post("/api/user/registration/:emailAdress");
app.get("api/user/login/:emailAdress/:hashPassword");
app.get("api/word/all/:userId");
app.post("api/word/");

app.get("/api/dictionary/definition/:language/:word", (req, res) => {
  const { language, word } = req.params;
  console.log(word);
  console.log(language);
  res.send("Testing");
});
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
