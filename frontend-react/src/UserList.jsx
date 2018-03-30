import React from 'react';

const UserList = (props) => {
  const { users, numUsers, quitChatterBox } = props;
  return (
    <div id="sidebar">
      <button id="logout" onClick={quitChatterBox}>Quit Room</button>
      <h3>There are {numUsers} users online now!</h3>
      <ul id="userList">
        {users.map(user => <li className="user">{user}</li>)}
      </ul>
    </div>
  );
};

export default UserList;
