import React from 'react';
import Message from './Messsage';

const MessageList = (props) => {
  const { messages } = props;
  console.log(messages);
  return (
    <div>
      { messages.map(message => <Message message={message} />) }
    </div>
  );
};

export default MessageList;
