import React, { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig/config"; // Importing Firebase authentication configuration

// Create context for authentication
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext); // Using useContext to access AuthContext
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to hold current user
  const [loading, setLoading] = useState(true); // State to track loading state

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider(); // Creating Google authentication provider
    try {
      const result = await signInWithPopup(auth, provider); // Signing in with Google popup
      setCurrentUser(result.user); // Setting current user after successful sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error); // Logging error if sign-in fails
    }
  };

  // Function to sign out
  const logout = async () => {
    try {
      await signOut(auth); // Signing out using Firebase auth
      setCurrentUser(null); // Clearing current user after sign-out
    } catch (error) {
      console.error("Error signing out:", error); // Logging error if sign-out fails
    }
  };

  // Effect to handle authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Updating current user based on authentication state
      setLoading(false); // Setting loading state to false once authentication state is determined
    });

    return unsubscribe; // Cleanup function to unsubscribe from authentication state changes
  }, []);

  const value = {
    currentUser, // Current authenticated user
    signInWithGoogle, // Function to sign in with Google
    logout, // Function to sign out
  };

  return (
    <AuthContext.Provider value={value}>
      {" "}
      {/* Providing auth context value to descendants */}
      {!loading && children} {/* Rendering children only when not loading */}
    </AuthContext.Provider>
  );
};
