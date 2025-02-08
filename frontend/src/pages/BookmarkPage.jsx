import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React, { useEffect, useState } from 'react'
import Post from '../components/Post';

const BookmarkPage = () => {
  const [fetching, setFetching] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  

  useEffect(() => {

    const getBookmarks = async () => {
      try {
        const res = await fetch('/api/users/getbookmarks');
        const data = await res.json()
        //console.log(data);
        setBookmarks(data);
      } catch (error) {
        console.log(error);
      }finally{
        setFetching(false);
      }
    }

   // console.log(bookmarks);
  getBookmarks();

  },[bookmarks])

  return (
    <>
    
    {!fetching && bookmarks.length === 0 && <h1>User has no posts</h1>}

{/* Render loading spinner when posts are being fetched */}
{fetching && (
  <Flex justifyContent="center" my={12}>
    <Spinner size="xl" />
  </Flex>
)}

{/* Render the posts */}
{bookmarks &&
  bookmarks.map((bookmark) => (
    <Post key={bookmark._id} post={bookmark} postedBy={bookmark.postedBy} />
  ))}
    </>
  )
}

export default BookmarkPage