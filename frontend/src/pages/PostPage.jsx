import { Avatar } from "@chakra-ui/avatar";
import { Box, Divider, Flex ,Text} from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/button";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@chakra-ui/spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { MdDelete } from "react-icons/md";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";

const PostPage=()=>{
  const {user,loading}=useGetUserProfile();
const [posts,setPosts]=useRecoilState
(postsAtom);
const currentPost=posts[0];
const navigate=useNavigate();
const showToast=useShowToast();
const currentUser=useRecoilValue(userAtom);
  const {pid}=useParams();
  useEffect(()=>{
       const getPost=async()=>{
        try {
          const res=await fetch(`/api/posts/${pid}`);
          const data=await res.json();
          if(data.error){
            console.log(error);
            window.alert("error",error);
            return;
          }

          //console.log(data);
          setPosts([data]);
          
        } catch (error) {
          navigate(0);
        }
       }
       getPost();


  },[pid,posts]);

  const handleDelete=async(e)=>{
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure want to delete this post")) return;

      
      const res=await fetch(`/api/posts/${currentPost._id}`,{
        method:"DELETE"
      });
      const data=await res.json();
      if(data.error){
        showToast(data.error,"error");
        return;
      }
      showToast("Post deleted Successfully","success");

      navigate(`/${user.username}`);


    } catch (error) {
        window.alert("error in delete");
    }

}
  if(!user && loading) {
    return(
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>

      </Flex>
    );
  }
 
   if(!currentPost){
    return null;

   } 

  return <>
  <Flex>
    <Flex w={"full"} alignItems={"center"} gap={3}>
      <Avatar src={user.profilePic} size={"md"} name="mark-zuckenberg"/>
      <Flex>
        <Text fontSize={"sm"}fontWeight={"bold"}>{user.username}</Text>
        <img src="/verified.png" width="20" height="20" ></img>
        
        </Flex>
    </Flex>
    <Flex gap={3} alignItems={"center"}>
      <Text fontSize={"xs"} width={36}
      textAlign={"right"}
      color={"gray.light"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>
      
      {currentUser?._id===user._id &&(
                     <MdDelete size={20} 
                     cursor={"pointer"}
                     onClick={handleDelete} />
                   )}
    </Flex>
  </Flex>
  <Text my={3}>{currentPost.text}</Text>
  <Box borderRadius={6}overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
    <img src={currentPost.img} ></img>
  </Box>
  <Flex gap={3} my={3}>
    <Actions post={currentPost}></Actions>
  </Flex>
 
  <Divider my={4}/>
  <Flex justifyContent={"space-between"}>
    <Flex gap={2} alignItems={"center"}>
      <Text fontSize={"2xl"}>👋</Text>
      <Text color={"gray.light"}>Get the app to like and reply</Text>
    </Flex>
    <Button>Get</Button>
  </Flex>
  <Divider my={4}/>
  {currentPost.replies.map(reply=>(
    <Comment
    key={reply?._id}
    reply={reply}
    lastReply={reply?._id===currentPost.replies[currentPost.replies.length-1]?._id}
    
 />

     
  )

  )}
  {/* 
  <Comment
  
  comment="very nice"
  createdate="1d"
  likes={69}
  username='kethan'
  userAvatar="https://bit.ly/code-beast"
/>
  
<Comment
     comment="hey handsome"
     createdate="3d"
     likes={143}
     username='asad'
     userAvatar="https://bit.ly/sage-adebayo"
  /> */}
  </>;
};
export default PostPage;