import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@chakra-ui/spinner";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";
import SuggestedUsers from "../components/SuggestedUSers";

const HomePage=()=>{
  const [posts,setPosts]=useRecoilState(postsAtom);
  const [loading,setLoading]=useState(true);
  const showToast = useShowToast();
  useEffect(()=>{

    const getFeedPosts=async()=>{
      setLoading(true);
      setPosts([]);
      try{
        const res=await fetch("/api/posts/feed");
        const data=await res.json();
        if(data.error){
          showToast(data.error,"error");

        }

 
        setPosts(data);
       
        
      }catch(error){
        console.log(error);
        showToast(error,"error");
      }
      finally{
        setLoading(false);
      }
    } 
    getFeedPosts();
  },[setPosts]);

  return(
    <Flex gap={10} alignItems={"flex-start"}>
     <Box flex={70}>
     {!loading &&posts.length===0 &&<h1> Follow some users to see their posts</h1>}
        {loading &&(
          <Flex justifyContent={"center"} mt={"50px"}><Spinner size="xl"/></Flex>
        )}

        {Array.isArray(posts) &&posts?.map((post)=>(
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
        ))}
     </Box>
     <Box flex={30} >
      <SuggestedUsers/>
     </Box>
          
    </Flex>
  );
}
export default HomePage;