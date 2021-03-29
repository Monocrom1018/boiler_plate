// process.env.NODE_ENV 는 로컬일 땐 development,
// 배포 이후에는 production 이라고 나옴.
// 배포환경인지 로컬환경인지에 따라 다른 모듈을 불러오는 작업을 해야 함
// 왜냐면 mongoDB URI는 로컬일 땐 코드에 적어놓고 불러와서 쓰지만
// 배포할 땐 heroku 라는 사이트에 입력해서 사용하기 때문에 이 땐 코드에서 불러오는게 아님

if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
