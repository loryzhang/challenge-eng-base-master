import React from 'react';
import moment from 'moment';

const Message = (props) => {
  const { text, user, ts } = props.message;
  return (
    <div className="message">
      <p><span>{user} sent: <span>{text} </span></span><span className="ts">{moment(ts).fromNow()}</span></p>
    </div>
  );
};

export default Message;
