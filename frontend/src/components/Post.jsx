import { Avatar } from "@chakra-ui/avatar"
import { Flex ,Box} from "@chakra-ui/layout"
import { Link, useNavigate } from "react-router-dom"
import { Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { Toast } from "@chakra-ui/toast";
import { MenuItem } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/react";
import {formatDistanceToNow} from "date-fns";
import { MdDelete } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";
const Post=({post,postedBy})=>{
  const navigate=useNavigate();
  const [posts,setPosts]=useRecoilState(postsAtom);
  const currentUser=useRecoilValue(userAtom);
  const showToast = useShowToast();
  const copyURL=()=>{
   
        const currentURL=window.location.href;
    navigator.clipboard.writeText(currentURL).then(()=> {
    
      
      

    });
   
  };
  const handleDelete=async(e)=>{
        try {
          e.preventDefault();
          if(!window.confirm("Are you sure want to delete this post")) return;

          
          const res=await fetch(`/api/posts/${post._id}`,{
            method:"DELETE"
          });
          const data=await res.json();
          if(data.error){
            showToast(data.error,"error");
            return;
          }
          showToast("Post deleted Successfully","success");
          setPosts((prev)=>prev.filter((p)=>p._id!==post._id));


        } catch (error) {
           showToast(error,"error");
        }

  }
  
  const [user,setUser]=useState(null);
 
  
  useEffect(() => {
      const getUser=async()=>{
        try {
         const res=await fetch("/api/users/profile/"+postedBy);
         const data=await res.json();
        //  console.log(data);
         if(data.error){
           console.log(data.error);
         }
         setUser(data);
        } catch (error) {
         console.log(error);
        }
      }
      getUser();
  },[postedBy]);
  
  
  if(!user) return null;
  if(!user.active) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column" } alignItems={"center"}>
           <Avatar size="md" name={user.name} src={user.profilePic} onClick={(e)=>{e.preventDefault(); navigate(`/${user.username}`);}}></Avatar>
           <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
           <Box position={"relative"} w={"full"}>
            {post.replies.length===0 &&<Text textAlign={"center"}>🥱</Text>}
            {post.replies[0]&&(
                <Avatar
                size="xs"
                name='johns dos'
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
               // onClick={navigate(`/${post.replies[0].username}`)}

            />
            )}
            {post.replies[1]&&(
               <Avatar
               size="xs"
               name='johns dos'
               src={post.replies[0].userProfilePic}
               position={"absolute"}
               bottom={"0px"}
               right="-5px"
               padding={"2px"}
             //  onClick={navigate(`/${post.replies[1].username}`)}

           />
            
)}
            
          {post.replies[2]&&(
               <Avatar
               size="xs"
               name='johns dos'
               src={post.replies[2].userProfilePic}
               position={"absolute"}
               bottom={"0px"}
               left="4px"
               padding={"2px"}

            //   onClick={navigate(`/${post.replies[2].username}`)}

           />
          )}
           
            
           </Box>
        </Flex>
        <Flex flex={(1)} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"} >
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}
              onClick={(e)=>{e.preventDefault(); navigate(`/${user.username}`);}}
              >
                {user.username}
                 
              </Text>
              <img src='/verified.png' width="20" height="20" margin-left="10"/>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
               {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              <Box className="icon-container" onClick={(e)=>e.preventDefault()}>
             
             </Box>
             {currentUser?._id===user._id &&(
               <MdDelete size={20}  onClick={handleDelete}/>
             )}
            </Flex>
          </Flex>

          <Text fontSize={'sm'} >{post.text}</Text>
          {post.img &&(
          <Box
           borderRadius={6}
           overflow={"hidden"}
           border={"1px solid"}
           borderColor={"gray.light"}
          >
            <img src={post.img}></img>
          </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post}></Actions>
          </Flex>
         
        </Flex>
      </Flex>
    </Link>
  );
};
export default Post;

