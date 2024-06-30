import React from "react";
import { useAuth } from "../context/authContext"; // Importing the useAuth hook from authContext
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesomeIcon component
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; // Importing the Google icon from FontAwesome icons
import "../styles/SignIn.css";
const SignIn = () => {
  const { signInWithGoogle } = useAuth(); // Using the useAuth hook to get the signInWithGoogle function

  // Function to handle Google sign-in button click
  const handleSignIn = async () => {
    try {
      await signInWithGoogle(); // Calling signInWithGoogle function from useAuth
    } catch (error) {
      console.error("Error signing in with Google:", error); // Logging any errors that occur during sign-in
    }
  };

  return (
    <div className="signin-container">
      {" "}
      {/* Container for the sign-in component */}
      <h2 className="signin-title">Create Your Own Workflow</h2>{" "}
      {/* Title of the sign-in section */}
      <p className="signin-subtitle">Sign In With Google To Get Started</p>{" "}
      {/* Subtitle prompting user to sign in */}
      <button className="signin-button" onClick={handleSignIn}>
        {" "}
        {/* Google sign-in button */}
        <FontAwesomeIcon icon={faGoogle} className="signin-icon" />{" "}
        {/* Google icon */}
        Sign In {/* Text label on the button */}
      </button>
    </div>
  );
};

export default SignIn;
