// MessageInput.tsx
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import * as Styled from "../Style/Style";

interface MessageInputProps {
  isNicknameSet: boolean;
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  isNicknameSet,

  onSendMessage,
}) => {
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (isNicknameSet && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isNicknameSet]);

  const sendMessage = () => {
    if (inputMessage && isNicknameSet) {
      // 서버에 닉네임과 메시지 함께 전송
      onSendMessage(inputMessage);

      setInputMessage("");
    }
  };

  return (
    <div>
      <SMessageInput
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        disabled={!isNicknameSet}
        ref={messageInputRef}
      />
      <Styled.SSendButton
        onClick={() => sendMessage()}
        disabled={!isNicknameSet}
      >
        전송
      </Styled.SSendButton>
    </div>
  );
};

const SMessageInput = styled(Styled.SInputStyle)`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px 10px;
`;

export default MessageInput;
