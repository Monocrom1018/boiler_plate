const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// salt 가 몇 글자인지 지정. 이걸 이용해서 암호화함
const saltRounds = 10;

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
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    // 넘버가 0이면 관리자, 1이면 일반유저 이런식으로
    type: Number,
    default: 0,
  },
  image: String,

  // 봐봐 DB 에 토큰이랑 토큰만료일까지 넣어서 관리함
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// user 모델에 save하기 전에 콜백함수를 실행하겠다.
userSchema.pre("save", function (next) {
  // 비밀번호를 암호화 한다.

  var user = this;

  // 수정된게 password 일 때에만 동작시킨다
  if (user.isModified("password")) {
    // 소금 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      // hash -> 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// comparePassword(plainPassword, cb) { ... } 이렇게 갖다쓰면 cb의 두 번째 인자에 true or false 값이 담겨서 { ... } 안에서 쓸 수 있음
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // painPassword 를 암호화한 다음 db의 password와 비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// generateToken(err, user) { ... } 이렇게 갖다쓰면 user 에 토큰 딱 담겨서 { ... } 안에서 쓸 수 있게 됨
userSchema.methods.generateToken = function (cb) {
  var user = this;

  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return db(err);
    cb(null, user);
  });
};

// 위에 짠 스키마를 바탕으로 User 라는 이름의 db모델을 생성
const User = mongoose.model("User", userSchema);

// 딴데서 갖다쓸수도 있도록 문 오픈
module.exports = { User };
