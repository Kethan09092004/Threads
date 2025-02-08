import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtoms";
import userAtom from "../atoms/userAtom";
import {FiLogOut} from "react-icons/fi";
import useShowToast from "../hooks/useShowToast";
const LogoutButton=()=>{
  const showToast=useShowToast();
  const setUser= useSetRecoilState(userAtom)
  const handleLogout=async()=>{
   
      try{
        
        const res=await fetch("/api/users/logout",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
        });

        const data = await res.json();
        
        if(data.error){
          showToast(data.error,"error");
          return;
        }

        localStorage.removeItem("user-threads");
        setUser(null);
        showToast("Logged out succesfully","success");
      }catch(error){
         showToast(error,"error");
      }
  };
  return (
    <Button
     position={"fixed"}
     top={"10px"}
     right={"50px"}
     size={"sm"}
     onClick={handleLogout}
   ><FiLogOut  size={20}/>
    </Button>
  )
}
export default LogoutButton;