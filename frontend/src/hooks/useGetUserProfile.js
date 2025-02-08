import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const useGetUserProfile = () => {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const {username}=useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          console.error(data.error);
        } 
        
        if(data.isFrozen){
            setUser(null);
            return;
        }
        if(!data.active){
          setUser(null);
          return;
        }


        setUser(data);

      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  },[username])

  return {loading,user}
}

export default useGetUserProfile