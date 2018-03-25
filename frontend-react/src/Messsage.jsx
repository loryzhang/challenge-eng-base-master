import React from 'react';

const Message = (props) => {
  const { text, user, ts } = props.message;
  return (
    <div>
      <p><span>@{ts} </span><span>{user}: </span><span>{text} </span></p>
    </div>
  );
};

export default Message;
