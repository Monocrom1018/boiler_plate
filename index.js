const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const { User } = require("./models/User");
const config = require("./config/key");

// application/x-www-form-urlencoded 형태를 분석해줌
app.use(express.urlencoded({ extended: true }));

// application/json 형태를 분석해줌
app.use(express.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello world!"));

app.post("/register", (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 DB에 넣어준다.

  const user = new User(req.body);

  // 몽고디비 메소드. 정보들이 user모델에 저장됨
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
