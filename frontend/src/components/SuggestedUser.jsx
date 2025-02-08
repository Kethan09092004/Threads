
import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Box, Flex, Text } from '@chakra-ui/layout'
import React from 'react'
import { Link } from 'react-router-dom'
import useFollowUnFollow from '../hooks/useFollowUnFollow'


const SuggestedUser = ({user}) => {
  const {handleFollowUnFollow,following,updating} = useFollowUnFollow(user);
 
  
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			{/* left side */}
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
					</Text>
				</Box>
			</Flex>
			{/* right side */}
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
  )
}

export default SuggestedUser