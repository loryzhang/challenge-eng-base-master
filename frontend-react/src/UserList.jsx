import React from 'react';

const UserList = (props) => {
  const { users, numUsers } = props;
  return (
    <div className="users">
      <h3>There are {numUsers} users online now!</h3>
      <ol>
        {users.map(user => <li>{user}</li>)}
      </ol>
    </div>
  );
};

export default UserList;
