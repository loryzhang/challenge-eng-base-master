import React from 'react';

const UserList = (props) => {
  const { users } = props;
  return (
    <div className="users">
      <ol>
        {users.map(user => <li>{user}</li>)}
      </ol>
    </div>
  );
};

export default UserList;
