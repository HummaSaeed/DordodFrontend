import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import InputField from "../components/InputField";

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    profile_picture: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    preferred_full_name: "",
    email: "",
    phone_number: "",
    nationality: "",
    date_of_birth: "",
    birth_name: "",
    marital_status: "",
    suffix: "",
    gender: "",
    country: "",
    state: "",
    city: "",
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, profile_picture: file });
      setProfilePicturePreview(URL.createObjectURL(file)); // Set preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fetch countries list from the RestCountries API
  const fetchCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const sortedCountries = response.data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sortedCountries);
    } catch (error) {
      setError("Failed to fetch countries.");
    }
  };

  // Fetch states based on selected country using the CountriesNow API
  const fetchStates = async (countryName) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: countryName }
      );
      if (response.data?.data?.states) {
        setStates(response.data.data.states.map((state) => state.name));
      } else {
        setStates([]);
      }
    } catch (error) {
      setError("Failed to fetch states.");
    }
  };

  // Fetch cities based on selected state using the CountriesNow API
  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: countryName, state: stateName }
      );
      if (response.data?.data) {
        setCities(response.data.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      setError("Failed to fetch cities.");
    }
  };

  // Fetch user's personal information if available
  const fetchPersonalInfo = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/personal-info/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.first_name) {
          console.log(data.first_name);
          setFormData({
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            preferred_full_name: data.preferred_full_name,
            email: data.email,
            phone_number: data.phone_number,
            nationality: data.nationality,
            date_of_birth: data.date_of_birth,
            birth_name: data.birth_name,
            marital_status: data.marital_status,
            suffix: data.suffix,
            gender: data.gender,
            country: data.country,
            state: data.state,
            city: data.city,
            profile_picture: data.profile_picture || null, // For profile picture
          });
          console.log(formData);
        }
        if (data.country) await fetchStates(data.country);
        if (data.state) await fetchCities(data.country, data.state);
        if (data.profile_picture) {
          setProfilePicturePreview(data.profile_picture);
        }
      } else {
        setError("Failed to fetch personal information.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/personal-info/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Personal information updated successfully.");
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to update personal information.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchPersonalInfo();
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    console.log(selectedCountry)
    setFormData({ ...formData, country: selectedCountry });
    setStates([]);
    setCities([]);
    const countryName = countries.find((c) => c.cca2 === selectedCountry)?.name
      .common;
    if (countryName) fetchStates(countryName);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState });
    const countryName = countries.find((c) => c.cca2 === formData.country)?.name
      .common;
    if (countryName && selectedState) fetchCities(countryName, selectedState);
  };

  return (
    <Container
      style={{
        fontFamily: "Poppins",
        paddingTop: "30px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        marginLeft: 10,
      }}
    >
      <h2 style={{ color: "#28a745", marginBottom: "10px" }}>
        Personal Information
      </h2>
      {/* {loading && <p>Loading...</p>} */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row className="mb-1">
          <Col md={12} className="text-center">
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  document.getElementById("profilePictureInput").click()
                }
              >
                <img
                  src={
                    profilePicturePreview ||
                    "https://via.placeholder.com/150?text=Click+to+Upload"
                  }
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Form.Control
                id="profilePictureInput"
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }} // Hide the file input
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <InputField
              label="First Name"
              name="first_name"
              placeholder="Enter First Name"
              isRequired={true}
              value={formData.first_name || ""} // Ensure value from formData is used
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Middle Name"
              name="middle_name"
              placeholder="Enter Middle Name"
              value={formData.middle_name || ""}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Last Name"
              name="last_name"
              placeholder="Enter Last Name"
              isRequired={true}
              value={formData.last_name || ""}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <InputField
              label="Preferred Full Name"
              name="preferred_full_name"
              placeholder="Enter Preferred Full Name"
              value={formData.preferred_full_name || ""}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Email"
              name="email"
              placeholder="Enter Email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Phone Number"
              name="phone_number"
              placeholder="Enter Phone Number"
              type="tel"
              value={formData.phone_number || ""}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <InputField
              label="Nationality"
              name="nationality"
              placeholder="Enter Nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              placeholder="Enter Date of Birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Birth Name"
              name="birth_name"
              placeholder="Enter Birth Name"
              value={formData.birth_name}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <InputField
              label="Marital Status"
              name="marital_status"
              placeholder="Select Marital Status"
              value={formData.marital_status}
              onChange={handleChange}
              as="select"
              options={[
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Divorced", label: "Divorced" },
              ]}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Suffix"
              name="suffix"
              placeholder="Enter Suffix"
              value={formData.suffix}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <InputField
              label="Gender"
              name="gender"
              placeholder="Enter Gender"
              value={formData.gender}
              onChange={handleChange}
              as="select"
              options={[
                { value: "Female", label: "Female" },
                { value: "Male", label: "Male" },
                { value: "Other", label: "Other" },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Label style={{ fontFamily: "Poppins" }}>Country</Form.Label>
            <Form.Control
              as="select"
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.cca2} value={country.cca2}>
                  {country.name.common}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col md={4}>
            <Form.Label style={{ fontFamily: "Poppins" }}>State</Form.Label>
            <Form.Control
              as="select"
              name="state"
              value={formData.state}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {states.length > 0 ? (
                states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))
              ) : (
                <option disabled>No states available</option>
              )}
            </Form.Control>
          </Col>
          <Col md={4}>
            <Form.Label style={{ fontFamily: "Poppins" }}>City</Form.Label>
            <Form.Control
              as="select"
              name="city"
              value={formData.city}
              onChange={handleChange}
            >
              <option value="">Select City</option>
              {cities && cities.length > 0 ? (
                cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))
              ) : (
                <option disabled>No cities available</option>
              )}
            </Form.Control>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            flexDirection: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            style={{
              backgroundImage: "linear-gradient(45deg, #2C3E50, #28a745)",
              border: "none",
              color: "white",
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Save Information
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PersonalInformation;
