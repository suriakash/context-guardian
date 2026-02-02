import { useEffect, useState } from "react";
import { getUsers } from "../api/users";

/** function UsersList({ refreshSignal }) {
  const [users, setUsers] = useState([]);
  
  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, [refreshSignal]);*/

function UsersList({users}) {
  // body...

  return (
    <div>
      <h3>Users</h3>

      {users.length === 0 && <p>No users found.</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.full_name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
