import React from 'react';
import PropTypes from 'prop-types';

const UserList = (props) => {
  const { users } = props;
  return (
    <section id="user-list">
      <em> {users.length} users online:</em>
      <ul>
        {users.map(user => <li className="user" key={user} >{user}</li>)}
      </ul>
    </section>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
};
export default UserList;
