import React from 'react';

const Message = (props) => {
  const { text, user, ts } = props.message;
  return (
    <div>
      <p><span>{user} </span><span>{ts} </span><span>{text} </span></p>
    </div>
  );
};

export default Message;
