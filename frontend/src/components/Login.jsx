import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtoms';
import userAtom from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import useShowToast from '../hooks/useShowToast';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaRegEyeSlash } from 'react-icons/fa';
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const setAuthScreenState=useSetRecoilState(authScreenAtom);
  const setUser=useSetRecoilState(userAtom);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const showToast=useShowToast();
  const [inputs,setInputs]=useState({
    username:"",
    password:"",
  });
  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
     // console.log("hii");
      setLoading(true);
        
      const res = await fetch("/api/users/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(inputs),
      }
      );
      const data=await res.json();
      console.log(data);
      if(data.error){
        showToast(data.error,"error");
        
          
      }else{
        if(data.active===false){
          showToast("Your account is not active yet","error");
          navigate("/auth");
          
        }
        else{
          localStorage.setItem("user-threads",JSON.stringify(data));
      setUser(data);
     
      showToast("Logged in  Successfully","success");
      navigate("/");
      }
        }
     // console.log("hii");
      
      
      }
      
     catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
};
  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="header">
          <h1>Login</h1>
          <p>to enjoy all of our cool features ✌️</p>
        </div>

        <div className="form-card">
          <form>
            <div className="name-row">
              <div className="form-group">
                <label htmlFor="username">User Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="username" 
                  value={inputs.name}
                  onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
                  required 
                />
              </div>

              
            </div>

            

            <div className="form-group">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <div className="password-input">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  value={inputs.password}
                  onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}

                  required 
                />
                <Button 
                  type="button" 
                  className="toggle-password"
                  size={"xl"}
                  color={"white"}
                  

                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ?  <FaRegEyeSlash /> : <MdOutlineRemoveRedEye/>}
                </Button>
              </div>
            </div>

            <Button type="submit" className="signup-button" 
            onClick={handleLogin} isLoading={loading}
            >
              Login
            </Button>

            <p className="login-text">
              Don't have account :  <a onClick={()=>setAuthScreenState("signUp")} >  Sign Up</a>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
         
          padding: 20px;
        }

        .form-wrapper {
          width: 100%;
          max-width: 480px;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .header p {
          font-size: 1.125rem;
          color: #4a5568;
        }

        .form-card {
          background:rgba(144, 144, 236, 0.47); /* Gray color for the form box */
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(243, 153, 153, 0.1);
        }

        .name-row {
          
          grid-template-columns: 1fr 1fr;
          
          
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .required {
          color: #e53e3e;
        }

        input {
          width: 100%;
             padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          background-color:rgba(131, 183, 252, 0.47);
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 1px #4299e1;
        }

        .password-input {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #4a5568;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
        }

        .signup-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1.5rem;
        }

        .signup-button:hover {
          background-color: #3182ce;
        }

        .login-text {
          text-align: center;
          margin-top: 1.5rem;
          color:rgb(151, 174, 218);
          cursor:pointer;
        }

        .login-text a {
          color:rgb(9, 140, 247);
          text-decoration: none;
        }

        .login-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .name-row {
            grid-template-columns: 1fr;
          }

          .form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
