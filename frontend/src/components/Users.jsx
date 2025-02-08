import { Flex, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import useFollowUnFollow from "../hooks/useFollowUnFollow";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import adminAtom from "../atoms/adminAtom";


const Users = ({ user }) => {
  
  const navigate = useNavigate();
  const { handleFollowUnFollow, following, updating } = useFollowUnFollow(user);
  const admin = useRecoilValue(adminAtom);

  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(user.active); // Local state for user.active
 
  const activateAccount = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/users/activate/${user._id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
      } else {
        setIsActive(true); // Update local state
        showToast(`${user.username}'s Account Activated Successfully`, "success");
      }
    } catch (error) {
      showToast(error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const deactivateAccount = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/deactivate/${user._id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
      } else {
        setIsActive(false); // Update local state
        showToast(`${user.username}'s Account Deactivated Successfully`, "success");
      }
    } catch (error) {
      showToast(error.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };
 
  if(user.username===admin) return null;
  return (

    <div>
      <Flex
        boxSize="md"
        h="70px"
        w="450px"
        border="1px solid gray"
        justifyContent="flex-start"
        alignItems="center"
        gap="1px"
      >
        {/* Avatar */}
        <Avatar
          src={user.profilePic}
          h="50px"
          w="50px"
          ml="10px"
          m="10px"
          cursor="pointer"
          onClick={() => navigate(`/${user.username}`)}
        />
        {/* Username */}
        <Text
          textAlign="left"
          onClick={() => navigate(`/${user.username}`)}
          cursor="pointer"
          ml="10px"
        >
          {user.username}
        </Text>

        {/* Buttons */}
        <Flex ml="auto" mr="10px" gap="1px">
          {/* Follow/Unfollow Button */}
          <Flex border="1px solid black" color="blue" ml="auto" mr="10px" bg="blue.400">
            <Button
              size="sm"
              color={following ? "black" : "white"}
              bg={following ? "white" : "blue.400"}
              onClick={handleFollowUnFollow}
              isLoading={updating}
              _hover={{
                color: following ? "black" : "white",
                opacity: ".8",
              }}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          </Flex>

          {/* Activate/Deactivate Button */}
          <Flex ml="auto" mr="10px">
            {isActive ? (
              <Button size="sm" bg="red" onClick={deactivateAccount} isLoading={loading}>
                Deactivate
              </Button>
            ) : (
              <Button size="sm" bg="green" onClick={activateAccount} isLoading={loading}>
                Activate
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default Users;
