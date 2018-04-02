import React from 'react';
import Linkify from 'react-linkify';
import moment from 'moment';

const Message = (props) => {
  const { text, user, ts } = props.message;
  return (
    <div className="message">
      <p><span>{user} sent: <span><Linkify>{text}</Linkify></span></span><span className="ts">{moment(ts * 1000).format('llll').toString()}</span></p>
    </div>
  );
};

export default Message;
