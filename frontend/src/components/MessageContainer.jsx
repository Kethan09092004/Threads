import { Avatar } from "@chakra-ui/avatar";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Divider, Flex, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { SkeletonCircle } from "@chakra-ui/skeleton";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(
    selectedConversationAtom
  )
  const [loadingMessages, setLoadingMessages] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const [messages, setMessages] = useState([]); // State for messages
  const {socket} = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef=useRef(null);
  
  //console.log("selected conversation", selectedConversation);
  useEffect(()=>{
    socket.on("newMessage", (message) => {
      if(selectedConversation._id===message.conversationId){
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      if(!document.hasFocus()){
      const sound=new Audio(messageSound);
      sound.play();
      }
      setConversations((prev)=>{
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage:{
                text:message.text,
                sender:message.sender,
              }
            };
          }
          return conversation;
        })
        return updatedConversations;
      })
    })
    return ()=>socket.off("newMessage");
  },[socket,selectedConversation,setConversations]);

  useEffect(() => {
    const lastMessageFromOtherUser =messages.length && messages[messages.length - 1].sender!==currentUser._id;
    if(lastMessageFromOtherUser){
      socket.emit("markMessagesAsSeen",{
        conversationId:selectedConversation._id,
        userId:selectedConversation._id
      });
    }
    socket.on("messagesSeen",({conversationId})=>{
      if(selectedConversation._id===conversationId){
        setMessages((prev)=>{
          const updatedMessages=prev.map((message)=>{
            if(!message.seen){
              return{
                ...message,
                seen:true,
              }
            }
            return message;
          })
          return updatedMessages;
        })
      }
    })
  },[socket,selectedConversation,messages,currentUser._id]);

  useEffect(() => {
    if (!selectedConversation?.userId) {
        console.log("No valid userId provided.");
        return;
    }

    const getMessages = async () => {
        setLoadingMessages(true);
        setMessages([]);
        
        try {
          if (selectedConversation?.mock) {
            showToast("Please start a conversation.","success");
            return;
        } 
         // console.log("selected conversation", selectedConversation.mock);
            const res = await fetch(`/api/message/${selectedConversation?.userId}`);
            if (!res.ok) {
                const errorData = await res.json();
                
            }

            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.log(error);
            showToast("please start the conversation", "info");

        } finally {
            setLoadingMessages(false);
        }
    };

    getMessages();
}, [selectedConversation?.userId,selectedConversation?.mock]);

useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  
}, [messages]);

  return (
    <Flex
      flex={"70"}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}
          <img src="/verified.png" width={15} height={15} />
        </Text>
      </Flex>
      <Divider />

      {/* Message Body */}
      <Flex flexDir={"column"} gap={4} overflowY={"auto"} height={"400px"} px={2}>
        {loadingMessages &&
         ( [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          )))}
        {!loadingMessages &&
          messages.map(message => (
            <Flex key={message._id} direction={"column"} ref={messages.length-1===messages.indexOf(message)? messageEndRef:null} >
            <Messages
             
              message={message}
              ownMessage={message.sender === currentUser._id}
            />
            </Flex>
          ))}
      </Flex>
      {/* Pass setMessages to MessageInput */}
      <MessageInput setMessages={setMessages} messages={messages} />
    </Flex>
  );
};

export default MessageContainer;
