"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
var port = 4444;
app.get("/", function (req, res) {
    var test = { name: "Sunwoo" };
    res.send(JSON.stringify(test));
});
app.get("/api/dictionary/definition/:language/:word", function (req, res) {
    var _a = req.params, language = _a.language, word = _a.word;
    console.log(word);
    console.log(language);
    res.send("Testing");
});
app.listen(port, function () {
    return console.log("Express is listening at http://localhost:".concat(port));
});
