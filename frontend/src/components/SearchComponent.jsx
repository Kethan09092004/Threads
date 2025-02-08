import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { BsSearch } from 'react-icons/bs';
import { Flex } from '@chakra-ui/layout';


const SearchComponent = () => {
  
  const navigate=useNavigate();
  const showToast=useShowToast();
  const [usertext,setUserText]=useState("");
  const [isSearch,setIsSearch]=useState(false);

  const handleUserSearch = async() => {
    setIsSearch(true);
    //console.log(usertext);
    try {
      const res = await fetch(`/api/users/profile/${usertext}`);
      if(res.ok)navigate(`/${usertext}`);
      else{
        showToast("User not found","error");
        return;
      }
      
      const data = await res.json();
      if (data.error) {
        console.error(data.error);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    finally{
      setUserText("");
      setIsSearch(false);
    }
  };

    
      
  
  
  return (
    <>
    <Flex gap={2}>
    <Input type="text" placeholder="Search" className="search"  width={"40%"} mr={5} onChange={(e)=>setUserText(e.target.value)} value={usertext} />
    
 
  
    <Button size={"xs"} onClick={handleUserSearch} isLoading={isSearch}> <BsSearch size={20}/></Button>
    </Flex>
    
   
    </>
  )
}

export default SearchComponent