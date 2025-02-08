import React, { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@chakra-ui/button";
import { BsFillImageFill } from "react-icons/bs";
import { Flex } from "@chakra-ui/layout";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
   const navigate=useNavigate();
   const showToast=useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts,setPosts]=useRecoilState(postsAtom);
  const {username}=useParams();

 
  const handlePostChange = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
      });

      const data = await res.json();
      if (data.error) {
        showToast(data.error,"error");
        setLoading(false);
        return;
      }
      
    // window.alert("Post created successfully");
      
      showToast("Post Created Succesfully","success");
      
      if(username===user.username){
        setPosts([data, ...posts]);
      }
      
      setIsOpen(false);
      setPostText("");
      setImgUrl("");
      
       
    } catch (err) {
      console.error(err);
      // window.alert("An error occurred while creating the post. Please try again.");
      showToast("An error occurred while creating the post. Please try again.", "error");
    } finally {
      setLoading(false);
     
    }
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  return (
    <>
      <Button className="create-post-button" onClick={() => setIsOpen(true)}>
        <FaPlus /> Post
      </Button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Post</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                X
              </button>
            </div>

            <div className="modal-body">
              <textarea
                placeholder="Post content goes here..."
                value={postText}
                onChange={handleTextChange}
                className="textarea"
              />
              <p className="char-count">
                {remainingChar}/{MAX_CHAR}
              </p>

              <BsFillImageFill
                style={{ cursor: "pointer", marginLeft: "5px" }}
                size={20}
                onClick={() => imageRef.current.click()}
              />
              <input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
            </div>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <img src={imgUrl} alt="preview" className="image-preview" />
                <button
                  className="image-close-button"
                  style={{ position: "absolute", top: "5px", right: "5px" }}
                  onClick={() => setImgUrl("")}
                >
                  X
                </button>
              </Flex>
            )}

            <div className="modal-footer">
              <Button
                onClick={handlePostChange}
                isLoading={loading}
                colorScheme="blue"
                mr={3}
              >
                Post
              </Button>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Create Post Button */
        .create-post-button {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background-color: lightgreen;
          color: #2d3748;
          padding: 10px 15px;
          font-size: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .create-post-button:hover {
          background-color: #e2e8f0;
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(8, 7, 7, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgb(11, 92, 233);
          z-index: 1000;
        }

        /* Modal Content */
        .modal-content {
          background: #fff;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        /* Modal Header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: bold;
          color: #2d3748;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        /* Modal Body */
        .modal-body {
          margin-top: 10px;
        }

        .textarea {
          width: 100%;
          height: 200px;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .char-count {
          font-size: 12px;
          font-weight: bold;
          text-align: right;
          color: #4a5568;
          margin-top: 5px;
        }

        /* Image Preview */
        .image-preview-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          flex-direction: column;
        }

        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          object-fit: contain;
        }

        .image-close-button {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 50%;
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 10px;
        }

        /* Modal Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .post-button {
          background-color: #3182ce;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .post-button:hover {
          background-color: #2b6cb0;
        }
      `}</style>
    </>
  );
};

export default CreatePost;
