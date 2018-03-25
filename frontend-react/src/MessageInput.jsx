import React from 'react';

const MessageInput = (props) => {
  const { text, user, send, handleInput } = props;
  return (
    <div className="input">
      <h1>Welcome {user}!</h1>
      <input name="text" value={text} onKeyPress={(e) => { if (e.key === 'Enter') { send(); } }} onChange={handleInput} />
      <button onClick={send}>Send</button>
    </div>
  );
};

export default MessageInput;
