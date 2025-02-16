import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { post } from "../services/endPoints";

const Register = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file); // Store actual file for form submission
      setPreviewPhoto(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  useEffect(() => {
    // Cleanup object URL to prevent memory leaks
    return () => {
      if (previewPhoto) URL.revokeObjectURL(previewPhoto);
    };
  }, [previewPhoto]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("userName", username);
    formData.append("email", email);
    formData.append("password", password);

    // Append file only if selected
    if (profilePhoto) {
      formData.append("profile", profilePhoto);
    }

    try {
      const response = await post("/api/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccessMessage("Registration successful! You can now log in.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create an Account</h2>

        <div className="profile-photo">
          <label htmlFor="profilePhotoInput">
            <img
              src={previewPhoto || "/default-profile.jpg"}
              alt="Profile"
              className="profile-photo-preview"
            />
          </label>
          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </div>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <p className="redirect-link">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
