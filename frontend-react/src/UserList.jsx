import React from 'react';
import PropTypes from 'prop-types';

const UserList = (props) => {
  const { users, numUsers } = props;
  return (
    <div id="sidebar">
      <h3>There are {numUsers} users online now!</h3>
      <ul id="userList">
        {users.map(user => <li className="user" key={user} >{user}</li>)}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  numUsers: PropTypes.number.isRequired,
};
export default UserList;
