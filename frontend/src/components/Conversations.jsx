import { Avatar, AvatarBadge } from '@chakra-ui/avatar'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Stack, Text, WrapItem,Flex, Box } from '@chakra-ui/layout'

import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { BsCheck2All, BsFillImageFill } from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/messagesAtom'


const Conversations = ({conversation,isOnline}) => {
  const user=conversation.participants[0];
  const lastMessage=conversation.lastMessage;
  const currentUser=useRecoilValue(userAtom);
   const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom);
   const colorMode=useColorMode();
   //console.log("selected conversation",selectedConversation);
  
  return (
    <Flex gap={4}
    alignItems={"center"}
     p={"1"}
    _hover={{
      Cursor:"pointer",
      bg:useColorModeValue("gray.600","gray.dark"),
      color:"white"
    }}
    onClick={()=>setSelectedConversation({
      _id:conversation._id,
      userId: user._id,
      userProfilePic: user.profilePic,
     
      username:user.username,
      mock:conversation.mock,
      
    })}
    bg={selectedConversation?._id===conversation._id?colorMode==="light"?"gray.400":"gray.dark" : ""}


    borderRadius={"md"}


    >
      <WrapItem>
        <Avatar size={{
          base:"xs",
          sm:"sm",
          md:"md"
        }}
        
        
        src={user.profilePic} >
        {isOnline ? <AvatarBadge boxSize='1em' bg='green.500' />:""}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>{user.username}<img src='/verified.png' width={15} height={15}  /></Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
           {currentUser._id===lastMessage.sender?
           
           (<Box color={lastMessage.seen? "blue.400": ""} >
             <BsCheck2All size={16}/>
           </Box>):""}
          {lastMessage.text.length>18 ? lastMessage.text.substring(0,18)+"...":lastMessage.text||<BsFillImageFill size={16}/>}
        </Text>

      </Stack>
    </Flex>
  )
}

export default Conversations