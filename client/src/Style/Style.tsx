import styled from "styled-components";

export const SInputStyle = styled.input`
  padding: 10px 15px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};
  background-color: ${(props) => (props.disabled ? "#f0f0f0" : "white")};
  color: ${(props) => (props.disabled ? "gray" : "black")};

  &:focus {
    outline: 1px solid #007bff;
  }
`;
export const SSendButton = styled.button`
  font-size: 12px;
  padding: 10px 15px;
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
