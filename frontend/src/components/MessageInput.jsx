import React, { useRef, useState } from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import Messages from "./Messages";
import { Flex } from "@chakra-ui/layout";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import { Spinner } from "@chakra-ui/spinner";




const MessageInput = ({ setMessages ,messages}) => {

  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
   const imageRef=useRef(null);
   const {handleImageChange,imgUrl,setImgUrl}=usePreviewImg(imageRef);
   const [isSending,setIsSending]=useState(false);
   const openModal = () => {
    imageRef.current.click();
    setIsOpen(true);
  };
 const closeModal = () => {
   setIsOpen(false);
   setImgUrl(null);
 }
 
 
 
  const handleSendMessage = async (e) => {
    
    e.preventDefault();
    if(!messageText && !imgUrl)return;
    if(isSending)return;
    setIsSending(true);
    console.log(messageText)
    // console.log(imgUrl);
    // console.log(selectedConversation.userId);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText|| "",
          recipientId: selectedConversation.userId,
          img:imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
        return;
      }

      // Update messages in the parent component
      setMessages((prevMessages) => [...prevMessages, data]);
    //   <Messages
      
    //   message={messageText}
    //   ownMessage={true}
    // />
    setConversations((prevConv)=>{
      const updatedConversations=prevConv.map(conversation=>{if(conversation._id===selectedConversation._id){
          return{
            ...conversation,
            lastMessage:{
              text:messageText,
              sender:data.sender
            }
          }
        }
        return conversation;
      })
      return updatedConversations;
    })

      // Clear the input after sending
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      showToast(error.message, "error");
    }finally{
      setIsSending(false);
    }
    
  };

  return (
    <Flex gap={2} alignItems={"center"}>
    <form onSubmit={handleSendMessage} style={{flex:95}}>
      <InputGroup>
        <Input
          w={"420px"}
          h={"40px"}
          placeholder="Type a message"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp size={"25px"} />
        </InputRightElement>
      </InputGroup>
      
      

    </form>
    <Flex flex={5} cursor={"pointer"}>
      <BsFillImageFill size={20} onClick={openModal}/>
        <Input type={"file"} ref={imageRef} hidden onChange={handleImageChange}  />

    </Flex>
     
    
    {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              
              <button className="close-button" onClick={closeModal
                
              }>
                X
              </button>
            </div>
            <div className="modal-body">
            <Flex mt={5} w={"full"}>
              <img src={imgUrl}/>

          
          </Flex>
          <Flex justifyContent={"flex-end"} my={2}>
            {!isSending ?(<IoSendSharp size={"20px"} cursor={"pointer"} onClick={handleSendMessage}/>):(<Spinner size={"md"}/>)}
          </Flex>
          </div>
          </div>
        </div>
        
    )}

<style>{`

  /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(8, 7, 7, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgb(11, 92, 233);
          z-index: 1000;
        }

        /* Modal Content */
        .modal-content {
          background: #fff;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        /* Modal Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: bold;
          color: #2d3748;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        /* Modal Body */
        .modal-body {
          margin-top: 10px;
        }

`}</style>


    </Flex>
  );
};

export default MessageInput;
