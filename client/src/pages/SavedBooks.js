import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_BOOK } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [deleteBookMutation, { error }] = useMutation(DELETE_BOOK);
  
  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBookMutation({
        variables: { bookId },
        update: cache => {
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...userData, savedBooks: userData.savedBooks.filter(book => book.bookId !== bookId) } }
          });
        }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId); // this is calling the 'removeBookId' function imported from './utils/localStorage'
      toast.success('Book deleted!');
      
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;


// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Card,
//   Button,
//   Row,
//   Col
// } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
// import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';

// const SavedBooks = () => {
//   const [userData, setUserData] = useState({});

//   // use this to determine if `useEffect()` hook needs to run again
//   const userDataLength = Object.keys(userData).length;

//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const token = Auth.loggedIn() ? Auth.getToken() : null;

//         if (!token) {
//           return false;
//         }

//         const response = await getMe(token);

//         if (!response.ok) {
//           throw new Error('something went wrong!');
//         }

//         const user = await response.json();
//         setUserData(user);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     getUserData();
//   }, [userDataLength]);

//   // create function that accepts the book's mongo _id value as param and deletes the book from the database
//   const handleDeleteBook = async (bookId) => {
//     const token = Auth.loggedIn() ? Auth.getToken() : null;

//     if (!token) {
//       return false;
//     }

//     try {
//       const response = await deleteBook(bookId, token);

//       if (!response.ok) {
//         throw new Error('something went wrong!');
//       }

//       const updatedUser = await response.json();
//       setUserData(updatedUser);
//       // upon success, remove book's id from localStorage
//       removeBookId(bookId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // if data isn't here yet, say so
//   if (!userDataLength) {
//     return <h2>LOADING...</h2>;
//   }

//   return (
//     <>
//       <div fluid className='text-light bg-dark p-5'>
//         <Container>
//           <h1>Viewing saved books!</h1>
//         </Container>
//       </div>
//       <Container>
//         <h2 className='pt-5'>
//           {userData.savedBooks.length
//             ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
//             : 'You have no saved books!'}
//         </h2>
//         <Row>
//           {userData.savedBooks.map((book) => {
//             return (
//               <Col md="4" key={book.bookId}>
//                 <Card border='dark'>
//                   {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
//                   <Card.Body>
//                     <Card.Title>{book.title}</Card.Title>
//                     <p className='small'>Authors: {book.authors}</p>
//                     <Card.Text>{book.description}</Card.Text>
//                     <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
//                       Delete this Book!
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SavedBooks;
