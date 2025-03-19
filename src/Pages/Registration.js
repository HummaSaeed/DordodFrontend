import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import InputField from "../components/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import bgImage from "../assets/bg-image.jpg";

const SignUpButton = ({ label, onClick, icon }) => {
  return (
    <Button
      style={{
        width: "100%",
        backgroundImage: "linear-gradient(45deg, #2C3E50, #28a745)", // Green background
        borderWidth: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px",
        fontFamily: "Poppins",
        color: "white",
        fontWeight: "bold",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          style={{ marginRight: "10px", color: "white" }}
        />
      )}
      {label}
    </Button>
  );
};

const Registration = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://dordod.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/dashboard"); // Navigate to SignIn after successful registration
      } else {
        const data = await response.json();
        setError(data.detail || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Black overlay with 60% opacity
          zIndex: 0,
        }}
      ></div>

      <div
        style={{
          width: "60%",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Modal
          show={true}
          centered
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Body
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="d-flex flex-direction-row">
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "70px",
                  marginBottom: "20px",
                  zIndex: 2,
                }}
              />
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontSize: "2rem",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                  color: "#28a745",
                }}
              >
                Register to
              </h1>
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontSize: "2rem",
                  fontWeight: "normal",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                  color: "#E67E22",
                  marginLeft: 10,
                }}
              >
                DORDOD
              </h1>
            </div>
            <InputField
              label="First Name"
              name="first_name"
              placeholder="Enter First Name"
              isRequired={true}
              onChange={handleChange}
            />
            <InputField
              label="Last Name"
              name="last_name"
              placeholder="Enter Last Name"
              isRequired={true}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              placeholder="Enter Email"
              isRequired={true}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter Password"
              isRequired={true}
              onChange={handleChange}
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              isRequired={true}
              onChange={handleChange}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <SignUpButton label="REGISTER" onClick={handleRegister} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Registration;
