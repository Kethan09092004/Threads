import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const useLogout = () => {
  const setUser=useSetRecoilState(userAtom);
  const logout=async()=>{
    
   
    try{
      
      const res=await fetch("/api/users/logout",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
      });

      const data = await res.json();
      
      if(data.error){
        console.log(data);
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
    }catch(error){
       console.log(error);
    }
};

return logout
}

export default useLogout