
import userAtom from '../atoms/userAtom'
import { useRecoilValue } from 'recoil'
import useShowToast from './useShowToast'
import { useState } from 'react';

const useFollowUnFollow = (user) => {
  const currentUser=useRecoilValue(userAtom)
  const [following,setFollowing]=useState(user.followers.includes(currentUser?._id));
  const [updating,setUpdating]=useState(false)
  const showToast=useShowToast()
  
  const handleFollowUnFollow = async () => {
    if (!currentUser) {
      showToast("Please login to follow", "error");
      return;
    }
    if (updating) {
      return;
    }
    setUpdating(true);

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      //console.log(data);
      if (data.error) {
        console.log(data.error);
        return;
      }
      if (following) {
        user.followers.pop();
        showToast(`Unfollowed ${user.username} Successfully`, "success");
      } else {
        user.followers.push(currentUser._id);
        showToast(`Followed ${user.username} Successfully`, "success");
      }
      setFollowing(!following);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };
  return { handleFollowUnFollow,updating,following};
}

export default useFollowUnFollow;