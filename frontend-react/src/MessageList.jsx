import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Message from './Messsage';

const MessageList = (props) => {
  const { messages, hasMoreMessages, loadMore } = props;
  return (
    <div id="messageList">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMoreMessages}
        loader={<div className="loader">Loading ...</div>}
      >
        { messages.map(message => <Message message={message} key={message.id} />) }
      </InfiniteScroll>
    </div>
  );
};

export default MessageList;
