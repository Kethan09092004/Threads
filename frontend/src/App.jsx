import { Button } from "@chakra-ui/button"
import { Box, Container } from "@chakra-ui/layout"
import { Route,Routes, useLocation } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import userAtom from "./atoms/userAtom"
import { Navigate } from "react-router-dom"
import LogoutButton from "./components/LogoutButton"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/CreatePost"
import ChatPage from "./pages/ChatPage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsPage from "./components/SettingsPage"
import BookmarkPage from "./pages/BookmarkPage"
import AdminPage from "./pages/AdminPage"
function App() {
       const user=useRecoilValue(userAtom);
 const {pathname}=useLocation();

  return (
    <Box position={"relative"} w={"full"}>
    <Container maxW={pathname==="/"?{base:"620px",md:"900px"}: "620px"}>
    <ToastContainer position="bottom-center" autoClose={2500}/>
      <Header></Header>
      <Routes>
      
        {/* <Route path="/auth" element={<AuthPage/>}/> */}
        <Route path="/" element={user? <HomePage/>:<Navigate to="/auth"/>}/>
        <Route path="/auth" element={!user? <AuthPage/> :<Navigate to="/"/>}/>
        <Route path="/update" element={user? <UpdateProfilePage/> :<Navigate to="/auth"/>}/>
        <Route path="/:username"  element={user?
        (
          <>
          <UserPage/>
          <CreatePost/>
          </>
          

        ):
        (
          <UserPage/>
           
        )
        }
        />

        <Route path="/:username/post/:pid" element={<PostPage/>}/>
        <Route path="/chat" element={user?<ChatPage/>:<Navigate to="/auth"/>}/>
        <Route path="/settings" element={user?<SettingsPage/>:<Navigate to="/auth"/>}/>
        <Route path="/bookmarks" element={user?<BookmarkPage/>:<Navigate to="/auth"/>}/>
        <Route path="/admin" element={user?<AdminPage/>:<Navigate to="/auth"/>}/>
      </Routes>
      
      
    </Container>
    </Box>
    
  )
}

export default App
