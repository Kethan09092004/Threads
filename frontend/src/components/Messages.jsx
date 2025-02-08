import { Box, Flex, Text } from '@chakra-ui/layout'
import { Avatar } from '@chakra-ui/avatar'
import React, { useState } from 'react'
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useNavigate } from 'react-router-dom';
import { BsCheck2All } from 'react-icons/bs';
import { Skeleton } from '@chakra-ui/skeleton';

const Messages = ({ownMessage,message}) => {
  const selectedConversation=useRecoilValue(selectedConversationAtom);
  
  const user=useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate=useNavigate();
 //console.log(user);
//console.log(message.seen);
  return (
    <>
    {ownMessage ? (
    <Flex
    
     gap={2}
     alignSelf={"flex-end"}
    >
      {message.text && (
        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}><Text color={"white"} >{message.text}</Text>
      
        <Box alignSelf={"flex-end"} ml={1} color={message.seen? "blue.400": ""} fontWeight={"bold"}>
          <BsCheck2All size={16}/>
        </Box>
        </Flex>
      )}
      {message.img && !imgLoaded &&(
           <Flex mt={5} w={"200px"}>
            <img
               src={message.img}
               alt='Dan Abramov'
               hidden
               onLoad={()=>setImgLoaded(true)}
                
            >
            </img>
            <Skeleton w={"200px"} h={"200px"}></Skeleton>
            </Flex>
      ) }
      {message.img && imgLoaded &&(
           <Flex mt={5} w={"200px"}>
           <img
              src={message.img}
              alt='Dan Abramov'
               
           >

           </img>
           <Box alignSelf={"flex-end"} ml={1} color={message.seen? "blue.400": ""} fontWeight={"bold"}>
          <BsCheck2All size={16}/>
        </Box>
           </Flex>
      )}
     <Avatar src={user.profilepic} 
     onClick={(e)=>{e.preventDefault(); navigate(`/${user.username}`);}}
     w={"7"} h={"7"}/>
    </Flex>
    ):(
      <Flex
     gap={2}
    
    >
      
      <Avatar src={selectedConversation.userProfilePic} onClick={(e)=>{e.preventDefault(); navigate(`/${selectedConversation.username}`);}} w={"7"} h={"7"}/>
      {message.text && (
        <Text maxW={"350px"} bg={"gray.400"}p={1} color={"black"}borderRadius={"md"} >{message.text}
        
        </Text>
      )} 

{message.img && !imgLoaded &&(
           <Flex mt={5} w={"200px"}>
            <img
               src={message.img}
               alt='Dan Abramov'
               hidden
               onLoad={()=>setImgLoaded(true)}
                
            >
            </img>
            <Skeleton w={"200px"} h={"200px"}></Skeleton>
            </Flex>
      ) }
      {message.img && imgLoaded &&(
           <Flex mt={5} w={"200px"}>
           <img
              src={message.img}
              alt='Dan Abramov'
               
           >

           </img>
           
           </Flex>
      )}
      
     
    </Flex>
    )
  }
    </>
  )
}

export default Messages