import React from 'react';

const MessageInput = (props) => {
  const { text, send, handleInput, handleLogOut } = props;
  return (
    <div id="messageInput">
      <input name="text" value={text} onKeyPress={(e) => { if (e.key === 'Enter') { send(); } }} onChange={handleInput} />
      <button onClick={send}>Send</button>
      <button id="logout" onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default MessageInput;
