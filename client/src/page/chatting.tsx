import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const serverUrl: string | undefined = process.env.REACT_APP_SERVER_URL || "";
const testLocalUrl = "http://localhost:3001";
const socket = io(testLocalUrl);

function ChatApp() {
  const [messages, setMessages] = useState<
    { nickname: string; message: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isNicknameSet && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isNicknameSet]);

  const sendMessage = () => {
    if (message && isNicknameSet) {
      // 서버에 닉네임과 메시지 함께 전송
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  const setNickName = () => {
    // 클라이언트 소켓을 통해 서버에 닉네임 중복 여부를 요청
    socket.emit("check nickname", nickname);

    // 서버로부터 중복 여부 확인 후 설정 여부를 받음
    socket.on("nickname available", () => {
      setIsNicknameSet(true);
    });

    socket.once("nickname taken", () => {
      alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.");
    });
  };

  // 스크롤을 최하단으로 이동하는 함수
  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop =
        chatListRef.current.scrollHeight - chatListRef.current.clientHeight;
    }
  };
  const isMyMessage = (msgNickname: string) => {
    return msgNickname === nickname;
  };

  return (
    <SChatLayout>
      <SChattingLayout>
        <SChatListLayout ref={chatListRef}>
          {serverConnected ? (
            messages.map((data, index) => (
              <div key={index}>
                <strong
                  className={isMyMessage(data.nickname) ? "my-message" : ""}
                >
                  {data.nickname}:{" "}
                </strong>

                {data.message}
              </div>
            ))
          ) : (
            <div>서버와 연결 중...</div>
          )}
        </SChatListLayout>
      </SChattingLayout>
      <div>
        <SNickNameInput
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          disabled={isNicknameSet}
          onKeyDown={(e) => {
            if (e.key === "Enter") setNickName();
          }}
          autoFocus
        />
        {!isNicknameSet ? (
          <SSendButton onClick={setNickName} disabled={isNicknameSet}>
            닉네임 설정
          </SSendButton>
        ) : (
          <SSendButton onClick={() => setIsNicknameSet(false)}>
            닉네임 수정
          </SSendButton>
        )}
        <div>
          <SMessageInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={!isNicknameSet}
            ref={messageInputRef}
          />
          <SSendButton disabled={!isNicknameSet} onClick={sendMessage}>
            전송
          </SSendButton>
        </div>
      </div>
    </SChatLayout>
  );
}

const SChattingLayout = styled.div`
  background-color: #dfdcdc;
`;

const SInputStyle = styled.input`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};
  background-color: ${(props) => (props.disabled ? "#f0f0f0" : "white")};
  color: ${(props) => (props.disabled ? "gray" : "black")};
  &:focus {
    outline: 1px solid #007bff;
  }
`;

const SSendButton = styled.button`
  font-size: 12px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  vertical-align: bottom;
  margin-left: 2px;
  cursor: pointer;
  background-color: ${(props) => (props.disabled ? "#ccc" : "white")};
  color: ${(props) => (props.disabled ? "gray" : "black")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#f0f0f0")};
  }
`;
const SMessageInput = styled(SInputStyle)`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px 10px;
`;
const SNickNameInput = styled(SInputStyle)`
  width: 70px;
  text-align: center;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
const SChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SChatListLayout = styled.div`
  height: 50vh;
  overflow-y: scroll;
  border: 1px solid #ccc;
  .my-message {
    color: #007bff;
  }
`;

export default ChatApp;
