import { Outlet, Link } from 'react-router-dom'
import MainIcon from '../assets/main-icon.svg?react'
import Footer from './Footer'
import './Header.css'

function SimpleHeader() {
  return (
    <header className="header-container header-container--simple">
      <Link to="/" className="header-container-left" style={{ textDecoration: 'none' }}>
        <div className="header-logo-container">
          <MainIcon className="header-logo" />
        </div>
        <h1 className="header-title">PawStore</h1>
      </Link>
    </header>
  )
}

function SimpleLayout() {
  return (
    <>
      <SimpleHeader />
      <Outlet />
      <Footer />
    </>
  )
}

export default SimpleLayout
