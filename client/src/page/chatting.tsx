import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const socket = io("http://localhost:3001");

function ChatApp() {
  const [messages, setMessages] = useState<
    { message: { nickname: string; message: string } }[]
  >([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가
  const chatListRef = useRef<HTMLDivElement | null>(null); // 스크롤을 조절할 ref

  useEffect(() => {
    // 서버로부터 메시지를 수신할 때
    socket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      // 스크롤을 맨 아래로 이동
    });
    scrollToBottom();
    // 서버와의 연결 상태를 확인하기 위한 이벤트 핸들러
    socket.on("disconnect", () => {
      console.log("서버와 연결이 끊어졌습니다.");
    });

    return () => {
      // socket.disconnect();
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message) {
      // 서버에 닉네임과 메시지 함께 전송
      socket.emit("chat message", { nickname, message });
      setMessage("");
    }
  };
  // 스크롤을 최하단으로 이동하는 함수
  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop =
        chatListRef.current.scrollHeight - chatListRef.current.clientHeight;
    }
  };
  return (
    <div>
      <SChatLayout>
        <SChatListLayout ref={chatListRef}>
          {messages.map((data, index) => (
            <div key={index}>
              <strong>{data.message.nickname}: </strong>
              {data.message.message}
            </div>
          ))}
        </SChatListLayout>
        {/* 닉네임 입력 필드 */}
        <SNickName
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
        />
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </SChatLayout>
    </div>
  );
}
const SNickName = styled.input`
  width: 80px;
  text-align: center;
`;
const SChatLayout = styled.div``;

const SChatListLayout = styled.div`
  height: 50vh;
  overflow-y: scroll;
  border: 1px solid #ccc;
`;

export default ChatApp;
