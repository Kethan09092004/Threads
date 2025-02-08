import UserHeader from "../components/UserHeader";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@chakra-ui/spinner";
import { Flex } from "@chakra-ui/layout";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {

  const { username } = useParams(); // Get `username` from route params
  const [posts, setPosts] = useRecoilState(postsAtom); // State for posts
  const [fetching, setFetching] = useState(true); // State for loading posts
  const {user,loading}=useGetUserProfile();
  const showToast = useShowToast();
  useEffect(() => {
    // Fetch user data
    
    
    // Fetch posts data
    const getPosts = async () => {
      if(!user) return;
      setFetching(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data.posts); 
       // console.log(data);
       // console.log(posts);
        // Ensure `posts` is an array
      } catch (error) {
        showToast(error,"error");
        setPosts([]);
         // Default to an empty array on error
      } finally {
        setFetching(false);
      }
    };

    
    getPosts();
  }, [username,setPosts,user]);

  // Render loading spinner when user data is being fetched
  if (!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Render "User not found" if no user data is available after fetching
  if (  !user && !loading) return <h1>User not found</h1>;
  //console.log(user);
  return (
    <>
      <UserHeader user={user} />

      {/* Render a message if there are no posts */}
      {!fetching && posts.length === 0 && <h1>User has no posts</h1>}

      {/* Render loading spinner when posts are being fetched */}
      {fetching && (
        <Flex justifyContent="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {/* Render the posts */}
      {Array.isArray(posts) && 
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
    </>
  );
};

export default UserPage;
