import React from 'react';
import Message from './Messsage';

const MessageList = (props) => {
  const { messages } = props;
  return (
    <div id="messageList">
      { messages.map(message => <Message message={message} />) }
    </div>
  );
};

export default MessageList;
