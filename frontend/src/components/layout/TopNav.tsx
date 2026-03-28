import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Container, Button, LazyImage } from '../ui'
import '../../styles/layout.css'

const TopNav: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  const handleAuthClick = () => {
    if (isLanding) navigate('/login')
    else navigate('/')
  }

  return (
    <div className="topnav-wrapper">
      <Container>
        <nav className="topnav" aria-label="Main navigation">
          <div className="topnav-left">
            <NavLink to="/" className="brand">
              <LazyImage src="/public/university_logo.png" alt="Ohio State" width={240} height={40} />
            </NavLink>
          </div>

          <div className="topnav-center">
            <ul className="topnav-links">
              <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
              <li><NavLink to="/events" className={({isActive}) => isActive ? 'active' : ''}>Events</NavLink></li>
              <li><NavLink to="/groups" className={({isActive}) => isActive ? 'active' : ''}>Groups</NavLink></li>
              <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink></li>
              <li><NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>Settings</NavLink></li>
            </ul>
          </div>

          <div className="topnav-right">
            <Button variant={isLanding ? 'primary' : 'ghost'} onClick={handleAuthClick}>
              {isLanding ? 'Sign in' : 'Sign out'}
            </Button>
          </div>
        </nav>
      </Container>
    </div>
  )
}

export default TopNav
