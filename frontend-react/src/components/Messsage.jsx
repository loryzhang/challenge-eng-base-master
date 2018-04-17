import React from 'react';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import moment from 'moment';

const Message = (props) => {
  const { text, user, ts } = props.message;
  return (
    <article className="message">
      <div className="info">
        <div className="username">{user}: </div>
        <div className="ts">{moment(ts * 1000).format('llll').toString()}</div>
      </div>
      <div className="text"><Linkify>{text}</Linkify></div>
    </article>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
};


export default Message;
