import React from 'react';

const UserList = (props) => {
  const { users, numUsers } = props;
  return (
    <div id="sidebar">
      <h3>There are {numUsers} users online now!</h3>
      <ul id="userList">
        {users.map(user => <li className="user">{user}</li>)}
      </ul>
    </div>
  );
};

export default UserList;
