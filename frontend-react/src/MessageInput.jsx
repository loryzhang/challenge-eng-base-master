import React from 'react';

const MessageInput = (props) => {
  const { text, sendMessage, handleInputChange } = props;
  return (
    <div id="messageInput">
      <input name="text" value={text} onKeyPress={(e) => { if (e.key === 'Enter') { sendMessage(); } }} onChange={handleInputChange} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
