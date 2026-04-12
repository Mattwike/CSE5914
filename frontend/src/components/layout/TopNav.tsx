import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Container, Button, LazyImage } from '../ui'
import { useAuthContext } from '../../context/AuthContext'
import '../../styles/layout.css'

const TopNav: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthContext()
  const disabled = !isAuthenticated

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      logout()
      navigate('/')
    }
  }

  return (
    <div className="topnav-wrapper">
      <Container>
        <nav className="topnav" aria-label="Main navigation">
          <div className="topnav-left">
            <NavLink to="/" className="brand">
              <LazyImage src="/university_logo.png" alt="Ohio State" width={240} height={40} />
            </NavLink>
          </div>

          <div className="topnav-center">
            <ul className="topnav-links">
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={(e) => { if (disabled) e.preventDefault() }}
                  className={({isActive}) => `${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`.trim()}
                >Home</NavLink>
              </li>
              <li>
                <NavLink
                  to="/events"
                  onClick={(e) => { if (disabled) e.preventDefault() }}
                  className={({isActive}) => `${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`.trim()}
                >Events</NavLink>
              </li>
              <li>
                <NavLink
                  to="/groups"
                  onClick={(e) => { if (disabled) e.preventDefault() }}
                  className={({isActive}) => `${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`.trim()}
                >Groups</NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  onClick={(e) => { if (disabled) e.preventDefault() }}
                  className={({isActive}) => `${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`.trim()}
                >Profile</NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  onClick={(e) => { if (disabled) e.preventDefault() }}
                  className={({isActive}) => `${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`.trim()}
                >Settings</NavLink>
              </li>
            </ul>
          </div>

          <div className="topnav-right">
            <Button variant={isAuthenticated ? 'danger' : 'primary'} onClick={handleAuthClick}>
              {isAuthenticated ? 'Sign out' : 'Sign in'}
            </Button>
          </div>
        </nav>
      </Container>
    </div>
  )
}

export default TopNav
