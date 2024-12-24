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
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpeg";
import bgImage from "../assets/bg-image.jpg";

const SignInButton = ({ label, onClick, icon, disabled }) => {
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
      disabled={disabled}
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

const SignIn = () => {
  const [show, setShow] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setLoading(false);
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
      {/* Overlay with opacity */}
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

      {/* Left Side Content */}
      <div
        style={{
          width: "40%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          padding: "20px",
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
        <Modal show={show} centered aria-labelledby="contained-modal-title-vcenter">
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
                  display:"flex",
                  alignItems:'center',
                  marginBottom:20,
                  color:'#28a745'
                }}
              >
                SignIn to 
              </h1>
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontSize: "2rem",
                  fontWeight: "normal",
                  display:"flex",
                  alignItems:'center',
                  marginBottom:20,
                  color:'#E67E22',
                  marginLeft:10
                }}
              >
                DORDOD
              </h1>
            </div>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Row className="my-3">
              <Col>
                <SignInButton
                  label="Google"
                  icon={faGoogle}
                  onClick={() => console.log("Google Sign-In")}
                />
              </Col>
              <Col>
                <SignInButton
                  label="Facebook"
                  icon={faFacebook}
                  onClick={() => console.log("Facebook Sign-In")}
                />
              </Col>
              <Col>
                <SignInButton
                  label="LinkedIn"
                  icon={faLinkedin}
                  onClick={() => console.log("LinkedIn Sign-In")}
                />
              </Col>
            </Row>
              <SignInButton
                label={loading ? "Signing In..." : "SIGN IN"}
              onClick={handleLogin}
                disabled={loading}
              />
            <div style={{ textAlign: "left", marginLeft:3 }}>
              <span style={{fontFamily:"Poppins" }}>If you are new </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#28a745",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/registration")}
                  >
                    Register
              </button>
              </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SignIn;
