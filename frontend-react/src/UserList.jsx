import React from 'react';
import PropTypes from 'prop-types';

const UserList = (props) => {
  const { users, numUsers } = props;
  return (
    <section id="user-list">
      <em> {numUsers} users online:</em>
      <ul>
        {users.map(user => <li className="user" key={user} >{user}</li>)}
      </ul>
    </section>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  numUsers: PropTypes.number.isRequired,
};
export default UserList;
