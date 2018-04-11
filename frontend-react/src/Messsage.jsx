import React from 'react';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import moment from 'moment';

const Message = (props) => {
  const { text, user, ts } = props.message;
  return (
    <div className="message">
      <p><span>{user} sent: <span><Linkify>{text}</Linkify></span></span><span className="ts">{moment(ts * 1000).format('llll').toString()}</span></p>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
};


export default Message;
