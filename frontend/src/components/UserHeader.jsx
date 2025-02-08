import {Text,Box,Flex, VStack} from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Link as RouterLink} from "react-router-dom";
import { Link } from "react-router-dom";

import { Button } from "@chakra-ui/button";

import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuList, MenuButton, MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Toaster, toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnFollow from "../hooks/useFollowUnFollow.js"; // Corrected import
import { useNavigate } from "react-router-dom";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const navigate=useNavigate();
  // Validate `user` and `user.followers`
  if (!user || !user.followers) {
    return <Text>Loading...</Text>;
  }

  const { handleFollowUnFollow, following, updating } = useFollowUnFollow(user);
  const chatPage=()=>{
       localStorage.setItem("userFromProfile",(user.username));
       localStorage.setItem("navigatedFromProfilePage","true");
       navigate("/chat");
  }
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast("Link copied to clipboard!");
    });
  };

  return (
    <VStack gap={4} alignItems="start">
      {/* Header Section */}
      <Flex justifyContent="space-between" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {user.name}
          </Text>
          <Flex gap={2} alignItems="center">
            <Text fontSize="sm">{user.username || user.name}</Text>
            <Text
              fontSize="sm"
              bg="gray.600"
              color="white"
              p={1}
              borderRadius="full"
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Avatar
          name={user.name}
          src={user.profilePic || "https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"}
          size="xl"
        />
      </Flex>

      {/* Bio */}
      <Text>{user.bio}</Text>

      {/* Buttons */}
      {currentUser?._id === user._id ? (
        <Link as={RouterLink} to="/update">
          <Button size="sm">Update Profile</Button>
        </Link>
      ) : (
        <Flex gap={2}>
           <Button onClick={handleFollowUnFollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
        
        <Button size="sm" onClick={chatPage}>Message</Button>
      
          </Flex>
      )}

      {/* Followers and Actions */}
      <Flex w="full" justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Text>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg="gray.400" borderRadius="full"></Box>
          <Link href="https://instagram.com" isExternal>
            Instagram.com
          </Link>
        </Flex>
        <Flex>
          <Box>
            <BsInstagram size={24} cursor="pointer" />
          </Box>
          <Menu>
            <MenuButton>
              <CgMoreO size={24} cursor="pointer" />
            </MenuButton>
            <Portal>
              <MenuList bg="gray.700">
                <MenuItem bg="gray.700" onClick={copyURL}>
                  Copy link
                </MenuItem>
                <Toaster />
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Flex w="full">
        <Flex
          flex={1}
          borderBottom="2px solid white"
          justifyContent="center"
          pb="2"
          cursor="pointer"
        >
          <Text fontWeight="bold">Threads</Text>
        </Flex>
        <Flex
          flex={1}
          justifyContent="center"
          pb="2"
          color="gray.400"
          cursor="pointer"
        >
          <Text fontWeight="bold">Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
