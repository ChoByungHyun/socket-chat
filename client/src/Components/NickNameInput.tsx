// NicknameInput.tsx
import React, { useState } from "react";
import styled from "styled-components";
import * as Styled from "../Style/Style";

interface NicknameInputProps {
  isNicknameSet: boolean;
  onNicknameChange: () => void;
  onSetNickname: (nickname: string) => void;
}

const NicknameInput: React.FC<NicknameInputProps> = ({
  isNicknameSet,
  onNicknameChange,
  onSetNickname,
}) => {
  const [inputNickname, setInputNickname] = useState("");

  return (
    <div>
      <SNickNameInput
        type="text"
        value={inputNickname}
        onChange={(e) => setInputNickname(e.target.value)}
        placeholder="닉네임"
        disabled={isNicknameSet}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSetNickname(inputNickname);
        }}
        autoFocus
      />
      {!isNicknameSet ? (
        <Styled.SSendButton
          onClick={() => onSetNickname(inputNickname)}
          disabled={isNicknameSet}
        >
          닉네임 설정
        </Styled.SSendButton>
      ) : (
        <Styled.SSendButton onClick={() => onNicknameChange()}>
          닉네임 수정
        </Styled.SSendButton>
      )}
    </div>
  );
};

const SNickNameInput = styled(Styled.SInputStyle)`
  width: 70px;
  text-align: center;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default NicknameInput;
