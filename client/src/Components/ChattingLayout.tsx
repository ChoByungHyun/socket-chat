// ChattingLayout.tsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface ChattingLayoutProps {
  messages: { nickname: string; message: string }[];
  isMyMessage: (msgNickname: string) => boolean;
}

const ChattingLayout: React.FC<ChattingLayoutProps> = ({
  messages,
  isMyMessage,
}) => {
  const chatListRef = useRef<HTMLDivElement | null>(null);

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
          <strong className={isMyMessage(data.nickname) ? "my-message" : ""}>
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
  .my-message {
    color: #007bff;
  }
`;
export default ChattingLayout;
