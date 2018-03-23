import React from 'react';

const MessageInput = (props) => {
  const { user, send, handleInput } = props;
  return (
    <div className="input">
      <h1>Welcome {user}!</h1>
      <input name="text" placeholder="put your message here" onChange={handleInput} />
      <button onClick={send}>Send</button>
    </div>
  );
};

export default MessageInput;
