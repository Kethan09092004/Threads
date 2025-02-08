import { useColorMode } from "@chakra-ui/color-mode";
import { Flex } from "@chakra-ui/layout";

import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import {AiFillHome} from "react-icons/ai";
import {RxAvatar} from "react-icons/rx";
import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/button";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtoms";
import { BsBook, BsBookmarkFill, BsFillChatQuoteFill, BsSearch } from "react-icons/bs";
import SearchComponent from "./SearchComponent";
import { useState } from "react";
import { MdOutlineSettings } from "react-icons/md";
import BookmarkPage from "../pages/BookmarkPage";
import adminAtom from "../atoms/adminAtom";
import { RiAdminFill } from "react-icons/ri";
const Header=()=>{
  const user=useRecoilValue(userAtom);
  const {colorMode,toggleColorMode}=useColorMode();
  const logout=useLogout();
  const setAuthScreen=useSetRecoilState(authScreenAtom);
  const admin=useRecoilValue(adminAtom);
 
   return (<Flex justifyContent={"space-between "} mt={6} mb="12">

   
      

<Flex gap={6}> 
  {user && (
    <Link as={RouterLink} to="/"> 
       <AiFillHome size={24}/>

    </Link>
  )}
 
 {user && (
    <SearchComponent/>
  )}
  
 </Flex>
  
  
  
  {!user &&(
    <Link as={RouterLink} to={"/auth"} onClick={()=>setAuthScreen("login")}> 
    Login

 </Link>
  )}
  
   <Flex alignItems={"center"}  marginRight={"200px"} >
   <img className="image"
      cursor="pointer"
      
      alt="logo"
      width="35"
      src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
      onClick={toggleColorMode}
      />
    </Flex>
    { user&& user.username===admin &&(
      <Link as={RouterLink} to={`/admin`}> 
       <RiAdminFill size={24} />

    </Link>
    )}

{user && (
    <Flex alignItems={"center"} gap={5}>
        <Link as={RouterLink} to={`/bookmarks`} >
       <BsBookmarkFill size={24}/>

    </Link>
   
    <Link as={RouterLink} to={`/${user.username}`}> 
       <RxAvatar size={24}/>

    </Link>
    <Link as={RouterLink} to={`/settings`}> 
       <MdOutlineSettings size={20}/>

    </Link>
    <Link as={RouterLink} to={`/chat`}> 
       <BsFillChatQuoteFill size={20}/>

    </Link>
    <Button
     
     size={"xs"}
     onClick={logout}
   ><FiLogOut  size={20}/>
    </Button>
    </Flex>
  )} 
  {!user &&(
    <Link as={RouterLink}  to={"/auth"} onClick={()=>setAuthScreen("signup")}> 
    SignUp

 </Link>
  )}
  </Flex> 
  
  );
};
export default Header;