import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Message from './Messsage';
import { loadMore } from '../actions';

const MessageList = (props) => {
  const { messages, hasMoreMessages, scrolled, backToTop } = props;
  const loadMoreMessages = () => {
    if (!messages.length) {
      return;
    }
    const earliestMessageInState = messages[messages.length - 1];
    const earliestMessageTS = earliestMessageInState.ts;
    props.loadMore(earliestMessageTS);
  };
  return (
    <section id="message-list">
      { scrolled && <button onClick={backToTop}>Click To Top</button> }
      <InfiniteScroll
        id="scroller"
        pageStart={0}
        loadMore={loadMoreMessages}
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
  loadMore: PropTypes.func.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  scrolled: PropTypes.bool.isRequired,
  backToTop: PropTypes.func.isRequired,
};

export default connect(null, { loadMore })(MessageList);
