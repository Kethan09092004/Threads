import { Avatar } from "@chakra-ui/avatar";
import { Divider, Flex } from "@chakra-ui/layout";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { Text } from "@chakra-ui/layout";
import { useNavigate } from "react-router-dom";
const Comment=({reply,lastReply})=>{
  const navigate=useNavigate();
  
  return(
     <>
       <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply?.userProfile} onClick={()=>navigate(`/${reply?.username}`)} size={"sm"}/>
        <Flex gap={2} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize="sm" fontFamily={"bold"}>{reply?.username}</Text>
            <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}></Text>
           <BsThreeDots/>
            </Flex>
          </Flex>
          <Text >{reply?.text}</Text>
      
       

        </Flex>
       </Flex>
       {!lastReply &&<Divider my={4}/>}
       
     </>
  );
}
export default Comment