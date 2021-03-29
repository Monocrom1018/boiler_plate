const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    // 문자열 사이의 스페이스바 공간을 없앰
    trim: true,
  },
  lastname: {
    type: String,
    maxLength: 50,
  },
  role: {
    // 넘버가 0이면 관리자, 1이면 일반유저 이런식으로
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 위에 짠 스키마를 바탕으로 User 라는 이름의 db모델을 생성
const User = mongoose.model("User", userSchema);

// 딴데서 갖다쓸수도 있도록 문 오픈
module.exports = { User };
