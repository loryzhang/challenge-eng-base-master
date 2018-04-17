import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import Message from './Messsage';

const MessageList = (props) => {
  const { messages, hasMoreMessages, loadMore, scrolled, backToTop } = props;
  return (
    <section id="message-list">
      { scrolled && <button onClick={backToTop}>Click To Top</button> }
      <InfiniteScroll
        id="scroller"
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMoreMessages}
        loader={<div className="loader" key="loader">Loading ...</div>}
      >
        { messages.map(message => <Message message={message} key={message.id} />) }
      </InfiniteScroll>
    </section>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  scrolled: PropTypes.bool.isRequired,
  backToTop: PropTypes.func.isRequired,
};

export default MessageList;
