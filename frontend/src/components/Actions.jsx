import { Box, Flex, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import React, {  useRef } from "react";
import { Input, useDisclosure } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { useNavigate } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";
import { BsBook, BsBookmarkFill } from "react-icons/bs";




const Actions = ({ post }) => {

  // 
  // Ensure likes is always an array
  const user = useRecoilValue(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id));
  const showToast=useShowToast();
 
  const [posts,setPosts]=useRecoilState(postsAtom);
  const [isLiking,setIsLiking]=useState(false);
  const [isReply,setIsReply]=useState(false);
  const [reply, setReply] = useState("");
  const [showComponent, setShowComponent] = useState(false);
 // console.log(post._id);
 
  const [bookmarked, setBookmarked] = useState(post?.bookmarks.includes(user?._id));
  
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const openModal = () => {
    setIsOpen(true);
  };
const navigate=useNavigate();
  const closeModal = (e) => {
    
    setIsOpen(false);
   // navigate(0);
    //navigate(`/post/${post._id}`);
    
    
   
   
  };
  const handleLiked = async () => {
    if (!user) return window.alert("You must be logged in to like a post");
    if(isLiking)return;
   setIsLiking(true);
    try {
      const res = await fetch("/api/posts/like/"+ post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
     // console.log(data);
      if (data.error) return window.alert("Error occurred");

      if (!liked) {
        const updatedPosts=posts.map((p)=>{
          if(p._id===post._id)return {...p,likes:[...p.likes,user._id]};
          return p;
        });
        setPosts(updatedPosts);
      } else {
        const updatedPosts=posts.map((p)=>{
          if(p._id===post._id)return {...p,likes:p.likes.filter((id)=>id!==user._id)};
          return p; 

        });
        setPosts(updatedPosts);
      }
      setLiked(!liked);
    } catch (error) {
      showToast(error.message,"error");
    }
    finally{
      setIsLiking(false);
    }
  };
  const likes = post?.likes||[];
  const handleReply = async (e) => {
    
    if (!user) return showToast("you must be logged in to reply to a post","error");
    if(isReply) return;
    setIsReply(true);
    try {
      const res = await fetch("/api/posts/reply/"+ post._id, {
        method: "PUT",


        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text:reply }),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) return showToast(data.error,"error");
      const updatedPosts=posts.map((p)=>{
        if(p._id===post._id)return {...p,replies:[...p.replies,data.reply]};
        return p;
      });
      setPosts(updatedPosts);


      
      
     // window.alert("reply sent succesfully");
       showToast("reply Sent Succesfully","success");
      closeModal();
      setReply("");
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsReply(false);
    }
  };
  
const replies = post?.replies||[]; 

const handleBookmark=async(e)=>{
  e.preventDefault();
  if (!user) return showToast("You must be logged in to bookmark a post", "error");

  try {
    // API request for post bookmarking/unbookmarking
    const res = await fetch("/api/posts/bookmark/" + post._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    // Update posts state locally
    const updatedPosts = posts.map((p) => {
      if (p._id === post._id)
        return {
          ...p,
          bookmarks: bookmarked
            ? p.bookmarks.filter((id) => id !== user._id)
            : [...p.bookmarks, user._id],
        };
      return p;
    });

    setPosts(updatedPosts); // Update the posts state to reflect the bookmark/unbookmark

    setBookmarked(!bookmarked); // Toggle the bookmark state locally
  } catch (error) {
    console.error(error);
  }
  finally{
    userBookMarks();
  }
  
}
const userBookMarks=async()=>{
  if (!user) return showToast("You must be logged in to bookmark a post", "error");
  
  try {
    if (!bookmarked) {
      const res = await fetch(`/api/users/bookmark/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
        return;
      }
      showToast("Post bookmarked successfully", "success");
      return;
    } else {
      const res = await fetch(`/api/users/unbookmark/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error, "error");
        return;
        
      }
      showToast("Post unbookmarked successfully", "success");
      return;
    }
  } catch (error) {
    console.error("Error in userBookMarks:", error);
    return;
  }
}




  return (
    <Flex flexDirection="column">
      
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="like"
          color={liked ? "rgb(237,73,84)" : ""}
          fill={liked ? "rgb(237,73,84)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLiked}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>
        <svg
          aria-label="comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            onClick={openModal}
          ></path>
        </svg>
      
       
       
      
      <BsBookmarkFill
            onClick={handleBookmark}
            style={{ cursor: "pointer" }}
            color={bookmarked ? "rgb(20, 99, 219)" : ""}
            size={20}
          />
         
       
      
       
       
       {/* <RepostSVG/>
       <ShareSVG/> */}
              
              </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>{replies.length } Replies</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"dark.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>{likes.length} Likes</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"dark.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>{post.bookmarks.length} Bookmarks</Text>
      </Flex>
      
      <div>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }

          .button {
            padding: 10px 20px;
            background-color: #3182ce;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .button-secondary {
            background-color: #e2e8f0;
            color: black;
            margin-left: 10px;
          }

          .button:hover {
            opacity: 0.9;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal {
            background: white;
            border-radius: 8px;
            width: 400px;
            padding: 20px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }

          .modal-header {
            font-size: 20px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-close {
            cursor: pointer;
            background: none;
            border: none;
            margin-left: 350px;  
            font-size: 30px;
            color: #888;
          }

          .modal-body {
            margin-bottom: 20px;
          }

          .form-control {
            margin-bottom: 15px;
          }

          .form-control label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }

          .form-control input {
            width: 100%;
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
          }

          .modal-footer .button {
            margin-left: 10px;
          }
        `}
      </style>

      

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-control">
                
                <input
                  ref={initialRef}
                  type="text"
                  
                  placeholder="reply here..."
                  autoFocus
                  onClick={(e)=>e.preventDefault()}
                  value={reply}
                  onChange={(e) =>setReply(e.target.value)  }
                />
              </div>
              
            </div>
            <div className="modal-footer">
              <Button className="button" onClick={handleReply} isLoading={isReply}>
                reply
              </Button>
             
            </div>
            
          </div>
        </div>
      )}
    </div>
    </Flex>
  );
};

export default Actions;

// const RepostSVG=()=>{
//   return(

//     <svg
//     aria-label="Repost"
//     color="currentColor"
//     fill="currentColor"
//     height="20"
//     role="img"
//     viewBox="0 0 24 24"
//     width="20"
//   >
//     <title>Repost</title>
//     <path
//       fill=""
//       d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
//     ></path>
//   </svg>
//   )
// }

// const ShareSVG=()=>{
//   return(
//     <svg
//     aria-label="Share"
//     color=""
//     fill=""
//     height={20}
//     role="img"
//     viewBox="0 0 24 24"
//     width="20"
//   >
//     <title>Share</title>
//     <line
//       fill="none"
//       stroke="currentColor"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       x1="22"
//       x2="9.218"
//       y1="3"
//       y2="10.083"
//     ></line>
//     <polygon
//       fill="none"
//       points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 2 3.001"
//       stroke="currentColor"
//       strokeLinejoin="round"
//       strokeWidth="2"
//     ></polygon>
//   </svg>
//   )
// }
