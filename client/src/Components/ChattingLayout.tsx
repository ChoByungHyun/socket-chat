// ChattingLayout.tsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface ChattingLayoutProps {
  messages: { nickname: string; message: string }[];
  isMyMessage: (msgNickname: string) => boolean;
  chatListRef: React.RefObject<HTMLDivElement>;
}

const ChattingLayout: React.FC<ChattingLayoutProps> = ({
  messages,
  isMyMessage,
  chatListRef,
}) => {
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop =
        chatListRef.current.scrollHeight - chatListRef.current.clientHeight;
    }
  };

  return (
    <SChatListLayout ref={chatListRef}>
      {messages.map((data, index) => (
        <div key={index}>
          <strong
            className={`${isMyMessage(data.nickname) ? "my-message" : ""} ${
              data.nickname === "시스템" ? "system-message" : ""
            }`}
          >
            {data.nickname}:{" "}
          </strong>
          {data.message}
        </div>
      ))}
    </SChatListLayout>
  );
};
const SChatListLayout = styled.div`
  height: 50vh;
  overflow-y: scroll;
  border: 1px solid #ccc;
  background-color: #eeecec;
  .my-message {
    color: #007bff;
  }
  .system-message {
    color: red;
  }
`;
export default ChattingLayout;
