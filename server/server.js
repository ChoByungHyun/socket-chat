// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // CORS 미들웨어 추가
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://socket-chat-beryl.vercel.app", "http://localhost:3000"], // 클라이언트 주소
    methods: ["GET", "POST"],
    credentials: true, // 필요에 따라 설정
  },
});
const corsOptions = {
  origin: ["https://socket-chat-beryl.vercel.app", "http://localhost:3000"], // 클라이언트 주소
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // 필요에 따라 설정
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 3001;

// 닉네임과 소켓 매핑을 위한 객체 생성
const clients = new Map();

io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  // 클라이언트로부터 닉네임 설정 이벤트 받기
  socket.on("set nickname", (nickname) => {
    // 이전 닉네임 가져오기
    const prevNickname = clients.get(socket);

    // 닉네임을 클라이언트 소켓과 연결
    clients.set(socket, nickname);
    console.log(`클라이언트의 닉네임이 설정되었습니다: ${nickname}`);

    // 입장/닉네임 변경 메시지 전송
    let entryMessage;
    if (prevNickname) {
      entryMessage = `${prevNickname}님이 ${nickname}로 닉네임을 변경하였습니다`;
    } else {
      entryMessage = `${nickname}님이 입장하였습니다`;
    }
    io.emit("chat message", { nickname: "시스템", message: entryMessage });
  });
  socket.on("chat message", (msg) => {
    // 클라이언트의 닉네임을 가져오기
    const nickname = clients.get(socket);

    console.log(`서버에서 받은 메시지: ${nickname}: ${msg}`);

    // 다른 클라이언트에게 닉네임과 메시지를 브로드캐스트
    io.emit("chat message", { nickname, message: msg });
  });

  socket.on("disconnect", () => {
    // 연결이 종료된 클라이언트의 닉네임 제거
    const nickname = clients.get(socket);
    clients.delete(socket);
    console.log(`클라이언트 연결이 종료되었습니다: ${nickname}`);
  });
});

server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
