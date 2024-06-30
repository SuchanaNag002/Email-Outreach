import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { AuthProvider, useAuth } from "./context/authContext";
import Sidebar from "./components/Sidebar";
import FlowchartComponent from "./components/FlowchartComponent";
import SavedFlowchart from "./components/SavedFlowchart";
import SignIn from "./components/SignIn";
import "./App.css";

// Separate component to handle authenticated routes
const AuthenticatedApp = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<FlowchartComponent />} />
          <Route path="/flowchart/:id" element={<SavedFlowchart />} />
          <Route path="/signin" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

// Main app component
const App = () => {
  const { currentUser } = useAuth(); // Get current user from useAuth hook

  return (
    <Router>
      <DragDropContext>
        <Routes>
          {currentUser ? (
            <Route path="/*" element={<AuthenticatedApp />} />
          ) : (
            <>
              <Route path="/" element={<SignIn />} />
              <Route path="/flowchart/:id" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </DragDropContext>
    </Router>
  );
};

// Wrap the main app component with AuthProvider
const AppWithProvider = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithProvider;
