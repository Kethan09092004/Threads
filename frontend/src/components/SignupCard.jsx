import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtoms';
import userAtom from '../atoms/userAtom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import useShowToast from '../hooks/useShowToast';
const SignupCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setRecoilState = useSetRecoilState(authScreenAtom);
  const navigate=useNavigate();
  const showToast = useShowToast();
  const [loading,setLoading]=useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log("hi1");
      const res = await fetch("/api/users/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      console.log("hi2");
      if (data.error) {
        console.log(data);
      } 
        // console.log("Sign-up successful");
        // localStorage.setItem("user-threads", JSON.stringify(data));
        // console.log("hi3");
        // setUser(data);
        setRecoilState("login");
        showToast("Account created successfully ...Please login", "success");
        
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            Sign up
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4a5568" }}>
            to enjoy all of our cool features ✌️
          </p>
        </div>

        <div
          style={{
            background: "rgba(144, 144, 236, 0.47)",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(243, 153, 153, 0.1)",
          }}
        >
          <form onSubmit={handleSignUp}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="name"
                  style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
                >
                  Full Name <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    backgroundColor: "rgba(131, 183, 252, 0.47)",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="username"
                  style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={inputs.username}
                  onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    backgroundColor: "rgba(131, 183, 252, 0.47)",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
              >
                Email address <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  backgroundColor: "rgba(131, 183, 252, 0.47)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}
              >
                Password <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    backgroundColor: "rgba(131, 183, 252, 0.47)",
                    fontSize: "1rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#4a5568",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#4299e1",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                marginTop: "1.5rem",
              }}
            >
              Sign up
            </Button>

            <p
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                color: "rgb(82, 142, 247)",
              }}
            >
              Already a user?{" "}
              <a
                onClick={() => setRecoilState("login")}
                style={{
                  color: "#4299e1",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupCard;
