import { Button } from '@chakra-ui/button'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { Text } from '@chakra-ui/layout'
import { SkeletonCircle } from '@chakra-ui/skeleton'
import { Skeleton } from '@chakra-ui/skeleton'
import Conversations from '../components/Conversations'
import {GiConversation} from "react-icons/gi"
import MessageContainer from '../components/MessageContainer'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'
import { useLocation } from 'react-router-dom'

const ChatPage = () => {
 
 
   const showToast=useShowToast();
   const [conversations,setConversations]=useRecoilState(conversationsAtom);
   const [loadingConvesations,setLoadingConversations]=useState(true);
   const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom);
   const [searchText,setSearchText]=useState("");
   const [loadingSearch,setLoadingSearch]=useState(false);
   const {socket,onlineUsers}=useSocket();
   const currentUser=useRecoilValue(userAtom);
   const [searchOne, setSearchOne] = useState(false);
   const location = useLocation();
 //console.log(localStorage.getItem("userFromProfile"));
 const [shouldClickButton, setShouldClickButton] = useState(false);

// console.log(localStorage.getItem("navigatedFromProfilePage"));
 useEffect(() => {
   const navigatedFromProfile = localStorage.getItem('navigatedFromProfilePage');
   const userFromProfile = localStorage.getItem('userFromProfile');

   if (navigatedFromProfile === 'true' && userFromProfile ) {
    setSelectedConversation(false);
     // Set flag to click button
     setSearchText(userFromProfile);
     handleConversation({preventDefault:()=>{}});
    //  localStorage.removeItem('navigatedFromProfilePage');
    //  localStorage.removeItem('userFromProfile');
    
     
    
   }
 },[])

//   useEffect(() => {
//     // Check if navigation was from home page
//     const navigatedFromHome = sessionStorage.getItem('navigatedFromProfilePage');
    
//     if (navigatedFromHome === 'true') {
//       // Set flag to click button
//       setShouldClickButton(true);
      
//       // Clear the flag
//       sessionStorage.removeItem('navigatedFromProfilePage');
//     }
//     console.log("hii");
//   }, []);


   useEffect(()=>{
     socket?.on("messagesSeen",({conversationId})=>{
       setConversations((prev)=>{
        const updatedConversations=prev.map((conversation)=>{
          if(conversation._id===conversationId){
            return {...conversation,
              lastMessage:{
                ...conversation.lastMessage,
                seen:true}
            };
          }
          
        
        return conversation;
     })
    return updatedConversations;
  });
        
  })
   },[socket,setConversations])
  useEffect(()=>{
    const getConversations=async()=>{
      try {
        const res=await fetch("/api/message/conversations");
        const data=await res.json();
        if(data.error){
          showToast(data.error,"error");
          return;
        }
        // console.log(data);
        setConversations(data)
        
      } catch (error) {
          showToast(error.message,"error");
      }
      finally{
        setLoadingConversations(false);
      }
    };

    
    getConversations();
  },[showToast])


  const handleConversation = async (e) => {
    e.preventDefault();
    console.log(searchText);
    setLoadingSearch(true);
    try {
     
      const usernameToSearch = searchText || localStorage.getItem("userFromProfile");

  
      
      const res = await fetch(`/api/users/profile/${usernameToSearch}`);
      const searchUser = await res.json();
      
      if (searchUser.error) {
        showToast(searchUser.error, "error");
        return;
      }
  
      if (searchUser._id === currentUser._id) {
        showToast("You cannot message yourself", "error");
        return;
      }
  
      const existingConversation = conversations.find(
        (c) => c.participants[0]._id === searchUser._id
      );
  
      if (existingConversation) {
        setSelectedConversation({
          mock: false,
          _id: existingConversation._id,
          userId: searchUser._id,
          username: searchUser.username,
          userProfilePic: searchUser.profilePic,
        });
      
        return;
      }
  
      // Add mock conversation
      const mockConversation = {
        
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchUser._id,
            username: searchUser.username,
            profilePic: searchUser.profilePic,
            mock: true,
          },
        ],
      };
  
      // Update conversations and select the new one
      setConversations((prevConversations) => {
        const alreadyExists = prevConversations.find(
          (c) => c.participants[0]._id === searchUser._id
        );
        if (alreadyExists) return prevConversations; // Avoid duplicates
        return [...prevConversations, mockConversation];
      });

      setSelectedConversation({
        _id: mockConversation._id,
        userId: searchUser._id,
        username: searchUser.username,
        userProfilePic: searchUser.profilePic,
      });
      
    } 
  
  catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoadingSearch(false);
      setSearchText("");
      localStorage.removeItem("navigatedFromProfilePage");
      localStorage.removeItem("userFromProfile");
      
      
      
    }
  };

  useEffect(() => {
    // Check if navigation was from home page
    const handleNavigation = () => {
     if(localStorage.getItem("navigatedFromProfilePage")){
       {handleConversation}
    }
     
   
    
 }
 
 handleNavigation();
 
    
 },[]);
 
  
  return (
    <Box position={"relative"} w={{base:"100%",md:"80%",lg:"750px"}} left={"50%"} 
    p={4}
    transform={"translateX(-50%)"} border={"1px solid blue"}>
      <Flex
       gap={4}
       flexDirection={{
        base:"column",
        md:"row"
       }}
       maxW={{
        sm:"400px",
        md:"full"
       }}
       mx={"auto"}
      >
        <Flex flex={30} gap={2}

          flexDirection={"column"}
          maxW={{
            sm:"250px",
            md:"full",
          }}
          mx={"auto"}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600,","gray.400")}>
            Your Conversations
          </Text>
            <form>
              <Flex >
                <input placeholder='Search for a User' onChange={(e)=>setSearchText(e.target.value)} />
                <Button size={"sm"} onClick={handleConversation} 
                   ref={(el) => {
                    // Automatically click if navigated from home
                    if (el && shouldClickButton) {
                      el.click();
                    }
               }}
                isLoading={loadingSearch}>
                  <BsSearch/>

                </Button>
                </Flex>
            </form>
            {loadingConvesations &&(
              [0,1,2,3,4].map((_,i)=>(
                <Flex gap={2} key={i} alignItems={"center"} p={"1"} borderRadius={"md"}>
                  <Box>
                      <SkeletonCircle size="10" />

                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"}></Skeleton>
                    <Skeleton h={"8px"} w={"90%"}/>
                    </Flex>

                  </Flex>
              ))
            )}
            {!loadingConvesations &&
              conversations.map((conversation)=>(
                <Conversations key={conversation._id} 
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}/>
              )


              
            )}
           

           
          
        </Flex>
        {!selectedConversation._id &&(
            <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
  
  
          ><GiConversation size={100}/>
          <Text fontSize={15}>
            Select a Conversation to Start messaging
          </Text>
          </Flex>
        )}
         {selectedConversation._id &&
              
               <MessageContainer/> 
         }
        
      </Flex>
    </Box>
  )
}

export default ChatPage