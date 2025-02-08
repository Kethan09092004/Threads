import { useRecoilValue, useSetRecoilState } from "recoil"
import Login from "../components/Login"
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtoms"



const AuthPage=() =>{
  const authScreenState=useRecoilValue(authScreenAtom);
  useSetRecoilState(authScreenAtom);
  console.log(authScreenState);
  return (
    <>
    {authScreenState==='login'?<Login/>:<SignupCard/>}
    </>
  )
}

export default AuthPage