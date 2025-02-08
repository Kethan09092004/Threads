import { Flex } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { Box, Text } from '@chakra-ui/layout';
import { SkeletonCircle } from '@chakra-ui/skeleton';
import SuggestedUser from './SuggestedUser';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';


const SuggestedUsers = () => {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers,setSuggestedUSers]=useState([]);
  const showToast=useShowToast();

  useEffect(()=>{
      const getSuggestedUsers=async()=>{
        setLoading(true);
        try {
          const res=await fetch("/api/users/suggested");
          const data=await res.json();
          if(data.error){
            showToast(data.error,"error");
          }
          setSuggestedUSers(data);
          
        } catch (error) {
            showToast(error.message,"error");
        }
        finally{
          setLoading(false);
        }
      }
      getSuggestedUsers();
  },[])
  if(!suggestedUsers.length===0) return null;
  return (
    <>
    <Text mb={4} fontWeight={"bold"}>Suggested Users</Text>
    <Flex direction={"column"} gap={4}>
      {!loading && Array.isArray(suggestedUsers) && suggestedUsers.map((user)=><SuggestedUser key={user._id} user={user} />)}
        {loading && [0,1,2,3,4].map((_,idx)=>
        (
          <Flex key={idx} gap={3} alignItems={"center"} p={"1"} borderRadius={"md"} _hover={{bg:"gray.100"}}>
             <Box>
                      <SkeletonCircle size="10" />

                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
            <Skeleton h={"10px"} w={"80px"}></Skeleton>
            <Skeleton h={"8px"} w={"90%"}/>
            </Flex>
              <Flex>
                <Skeleton h={"10px"} w={"80px"}></Skeleton>
              </Flex>
            </Flex>
            

        ))}
      </Flex>
    </>
  )
}

export default SuggestedUsers;

