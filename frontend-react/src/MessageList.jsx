import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import Message from './Messsage';

const MessageList = (props) => {
  const { messages, hasMoreMessages, loadMore } = props;
  return (
    <div id="messageList">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMoreMessages}
        loader={<div className="loader" key="loader">Loading ...</div>}
      >
        { messages.map(message => <Message message={message} key={message.id} />) }
      </InfiniteScroll>
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default MessageList;
