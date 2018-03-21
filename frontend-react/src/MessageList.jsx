import React from 'react';
import Message from './Messsage';

const MessageList = (props) => {
  const { messages } = props;
  messages.map(message => <Message message={message} />);
};

export default MessageList;
