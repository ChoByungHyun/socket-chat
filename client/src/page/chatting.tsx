// ChatApp.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function ChatApp() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 서버로부터 메시지를 수신할 때
    socket.on("chat message", (msg) => {
      setMessages([...messages, msg]);
    });

    // 서버와의 연결 상태를 확인하기 위한 이벤트 핸들러
    socket.on("disconnect", () => {
      console.log("서버와 연결이 끊어졌습니다.");
    });

    return () => {
      // socket.disconnect();
    };
  }, [messages]);

  const sendMessage = () => {
    if (message) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default ChatApp;
