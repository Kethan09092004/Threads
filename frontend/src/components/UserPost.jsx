import { Avatar } from "@chakra-ui/avatar"
import { Flex ,Box} from "@chakra-ui/layout"
import { Link } from "react-router-dom"
import { Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { Toast } from "@chakra-ui/toast";
import { MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/react";
const UserPost=({postimg,postTitle,likes,replies})=>{
  const notify = () => Toast('Here is your toast.');
  const copyURL=()=>{
   
        const currentURL=window.location.href;
    navigator.clipboard.writeText(currentURL).then(()=> {
      {notify};
      
      

    });
   
  };
  
  const [liked,setLiked]=useState(false);
  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column" } alignItems={"center"}>
           <Avatar size="md" name="Mark Zuckenberg" src="/zuck-avatar.png"></Avatar>
           <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
           <Box position={"relative"} w={"full"}>
            <Avatar
                size="xs"
                name='johns dos'
                src="https://bit.ly/dan-abramov"
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}

            />
            <Avatar
                size="xs"
                name='johns dos'
                src="https://bit.ly/code-beast"
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}

            />
            <Avatar
                size="xs"
                name='johns dos'
                src="https://bit.ly/ryan-florence"
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}

            />
           </Box>
        </Flex>
        <Flex flex={(1)} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"} >
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                markzuckerberg
              </Text>
              <img src='/verified.png' width="20" height="20" margin-left="10"/>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                1d
              </Text>
              <Box className="icon-container" onClick={(e)=>e.preventDefault()}>
             <Menu>
              <MenuButton>
              <BsThreeDots></BsThreeDots>
              </MenuButton>
              <Portal>
              <MenuList bg={"gray.dark"}>
                <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Url</MenuItem>
              </MenuList>
              </Portal>
              

             </Menu>
             </Box>
            </Flex>
          </Flex>

          <Text fontSize={'sm'} >{postTitle}</Text>
          {postimg &&(
          <Box
           borderRadius={6}
           overflow={"hidden"}
           border={"1px solid"}
           borderColor={"gray.light"}
          >
            <img src={postimg}></img>
          </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked}></Actions>
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>{replies} Replies </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"dark.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>{likes} Likes </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};
export default UserPost;

