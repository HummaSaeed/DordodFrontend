import React from "react";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import profile from "../assets/profile.png";
import { theme } from "../theme";

const CustomNavbar = ({ toggleSidebar, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage/session
    localStorage.removeItem('token');
    // Redirect to login
    navigate('/');
  };

  return (
    <Navbar
      bg="white"
      fixed="top"
      className="shadow-sm"
      style={{ 
        height: theme.spacing.navbar, 
        padding: "0 20px",
        borderBottom: `1px solid ${theme.colors.border}` 
      }}
    >
      <Navbar.Brand onClick={toggleSidebar} style={{ cursor: "pointer" }}>
        <Image src={logo} height={50} alt="Logo" />
      </Navbar.Brand>
      <Nav className="ms-auto d-flex align-items-center">
        <span className="me-3 fw-bold" style={{ color: theme.colors.primary }}>
          {userName || 'User'}
        </span>
        <div className="position-relative">
          <Image 
            src={profile} 
            roundedCircle 
            width={40} 
            height={40} 
            alt="Profile"
            style={{ objectFit: 'cover' }}
          />
          <NavDropdown 
            align="end"
            title=""
            id="basic-nav-dropdown"
            className="position-static"
          >
            <NavDropdown.Item onClick={() => navigate('/settings')}>
              Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
