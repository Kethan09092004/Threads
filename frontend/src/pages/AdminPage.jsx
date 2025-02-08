import React, { useEffect, useState } from 'react';
import adminAtom from '../atoms/adminAtom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Flex } from '@chakra-ui/layout';
import useShowToast from '../hooks/useShowToast';
import Users from '../components/Users';

const AdminPage = () => {
  const showToast = useShowToast();
  const admin = useRecoilValue(adminAtom);
  const user = useRecoilValue(userAtom);
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await fetch("/api/users/getallUsers");
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
      } 
        setUsers(data.users); // Store fetched users in state
        
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    if (user && user.username === admin) {
      getAllUsers(); // Fetch users if admin matches
    }
  }, [user, admin]); // Only run when user or admin changes

  return (
    <>
      {user && user.username === admin ? (
        <div>
          <h1>All Users</h1>
          <ul>
            {users.length > 0 ? (
              users.map((user) => (
                <Users key={user._id} user={user}></Users> // Adjust based on your data
              ))
            ) : (
              <p>No users found</p>
            )}
          </ul>
        </div>
      ) : (
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>Access Denied</Flex>
      )}
    </>
  );
};

export default AdminPage;
