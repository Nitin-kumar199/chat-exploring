import React, { useContext } from 'react'
import {Nav, Stack, Container, Navbar} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Notification from './chat/Notification';

export default function NavBar() {
    const {user, logoutUser} = useContext(AuthContext);
  return (
    <Navbar bg="dark" className="mb-4" style={{height:"3.75rem"}}>
        <Container>
            <h2>
                <Link to="/" className='link-light text-decoration-none'>
                    Chat
                </Link>
            </h2>
            {user && <span className='text-warning'>
                Logged in as {user?.name}
            </span>}
            <Nav>
            <Stack direction='horizontal' gap={3}>
                {
                    user && (
                    <>
                        <Notification />
                        <Link  onClick={()=>logoutUser()} to="/login" className='link-light text-decoration-none'>
                            logout
                        </Link>
                    </>
                    )
                }
                {
                    !user && (<>
                    <Link to="/login" className='link-light text-decoration-none'>
                    login
                </Link>
                    <Link to="/register" className='link-light text-decoration-none'>
                    register
                </Link>
                    </>)
                }
            
                
            </Stack>
            </Nav>
        </Container>
    </Navbar>
  )
}
