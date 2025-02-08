import { useColorMode } from "@chakra-ui/color-mode";

import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { useRef, useState } from "react";
import { Button } from "@chakra-ui/button";
import { toast, ToastContainer } from "react-toastify";
//import isLoading from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
const UpdateProfilePage = () => {
  //  const notify=()=>toast("Profile updated successfully");
  const showToast=useShowToast();
  const [user,setUser]=useRecoilState(userAtom);
const[inputs,setInputs]=useState({
  name:user.name,
  username:user.username,
  email:user.email,
  bio:user. bio,
  password:"",
  
  
});
const fileRef=useRef(null);

const { handleImageChange ,imgUrl}=usePreviewImg();
const [updating,setUpdating]=useState(false);
const handleSubmit=async(e)=>{
  e.preventDefault();
  if(updating)return;
  setUpdating(true);

  try {
   const res=await fetch(`/api/users/update/${user._id}`,
    {
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({...inputs,profilePic:imgUrl}),
   });
   const data=await res.json();
   console.log(data);

   if(data.error){
    showToast(data.error,"error");
   }
   setUser(data);
   localStorage.setItem("user-threads",JSON.stringify(data));
   //window.alert("Profile updated successfully");
  //  notify();
      showToast('profile updated successfully','success');
  //  <ToastContainer />
   
    
  } catch (error) {
      console.log(error);
  }
  finally{
    setUpdating(false);
  }
}

  
  return (
    <form onSubmit={handleSubmit}>
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-heading">User Profile Edit</h1>
          <div className="form-group">
            <label htmlFor="avatar" className="form-label">User Icon</label>
            <div className="avatar-section">
              <div className="avatar-container">
                <img
                  src={imgUrl ||user.profilePic||'https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp'}
                  alt="hiii"
                  className="avatar"
                />
                
              </div>
              <button className="change-avatar-btn" onClick={() => fileRef.current.click()} >Change Avatar</button>
              <input
                type="file"  hidden ref={fileRef} onChange={handleImageChange}/>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="fullname" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullname"
              className="form-input"

              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              placeholder={user.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" className="form-label">User Name</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
              placeholder={user.username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              className="form-input"
              placeholder="your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio" className="form-label">bio</label>
            <input
              type="text"
              id="bio"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              className="form-input"
              placeholder="your bio"  
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              className="form-input"
              placeholder="password"
            />
          </div>
          <div className="form-actions">
            <Button className="cancel-btn">Cancel</Button>
            <Button className="submit-btn" type="submit" isLoading={updating}>Submit</Button>
          </div>
        </div>
      </div>

      <style>{`
        .profile-container {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
         
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .profile-card {
          width: 100%;
          max-width: 480px;
          background-color: #fff;
          border-radius: 1rem;
          background-color:useColorMode('white','gray.dark');
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin: 24px 0;
        }

        .profile-heading {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 24px;
          color:black;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #1e1e1e;
          font-weight: 600;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color:rgb(244, 245, 247);
          background-color:rgb(63, 85, 100);
          font-size: 1rem;
        }

        .avatar-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .avatar-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
        }

        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-avatar-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: #e53e3e;
          color: #fff;
          border-radius: 50%;
          border: none;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .change-avatar-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          background-color: #63b3ed;
          color: white;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .cancel-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          background-color: #fc8181;
          
        }

        .submit-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          background-color:rgb(58, 214, 11);
          
        }
          .submit-btn:hover{
            background-color:rgb(58, 214, 11);
            text-tranform: scale(1.1);
          }
          .cancel-btn:hover{
            background-color: #fc8181;
            text-tranform: scale(1.1);
          }
      `}</style>
    </form>
  );
};

export default UpdateProfilePage;
