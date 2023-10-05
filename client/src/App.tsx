// App.tsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import ChattingLayout from "./Components/ChattingLayout";
import NicknameInput from "./Components/NickNameInput";
import MessageInput from "./Components/MessageInput";

const serverUrl: string | undefined = process.env.REACT_APP_SERVER_URL || "";
const testLocalUrl = "http://localhost:3001";
const socket = io(serverUrl);

function App() {
  const [messages, setMessages] = useState<
    { nickname: string; message: string }[]
  >([]);
  const [nickname, setNickname] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    // 서버로부터 메시지를 수신할 때
    socket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    const handleServerConnect = () => {
      setServerConnected(true);
    };

    const handleServerDisconnect = () => {
      setServerConnected(false);
    };

    // 서버 연결 및 연결 해제 이벤트를 감시
    socket.on("connect", handleServerConnect);
    socket.on("disconnect", handleServerDisconnect);

    return () => {
      socket.off("connect", handleServerConnect);
      socket.off("disconnect", handleServerDisconnect);
    };
  }, []);

  const sendMessage = (message: string) => {
    // 서버에 닉네임과 메시지 함께 전송
    socket.emit("chat message", message);
  };

  const setNickName = (nickname: string) => {
    // 클라이언트 소켓을 통해 서버에 닉네임 중복 여부를 요청
    socket.emit("check nickname", nickname);

    // 서버로부터 중복 여부 확인 후 설정 여부를 받음
    socket.on("nickname available", () => {
      setIsNicknameSet(true);
      setNickname(nickname);
    });

    socket.once("nickname taken", () => {
      alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.");
    });
  };
  const handleNickNameEdit = () => {
    setIsNicknameSet(false);
  };
  const isMyMessage = (msgNickname: string) => {
    return msgNickname === nickname;
  };

  return (
    <SChatLayout>
      {serverConnected ? (
        <ChattingLayout messages={messages} isMyMessage={isMyMessage} />
      ) : (
        <div>서버와 연결 중...</div>
      )}
      <div>
        <NicknameInput
          isNicknameSet={isNicknameSet}
          onNicknameChange={handleNickNameEdit}
          onSetNickname={setNickName}
        />
        <MessageInput
          isNicknameSet={isNicknameSet}
          onSendMessage={sendMessage}
        />
      </div>
    </SChatLayout>
  );
}

const SChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default App;
