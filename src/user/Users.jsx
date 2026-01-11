import React, { useState, useEffect } from "react";
import DeleteUser from "./DeleteUser";
import { list, read } from "./api-user.js";
import { useLocation, Navigate, useParams } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import "../styles/users.css";

export default function Users() {
  const location = useLocation();
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  // Fetch all users
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data?.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return () => abortController.abort();
  }, []);

  // Fetch selected user if userId is in URL
  useEffect(() => {
    if (userId) {
      const abortController = new AbortController();
      const signal = abortController.signal;

      read({ userId }, { t: jwt.token }, signal).then((data) => {
        if (data && data.error) {
          setRedirectToSignin(true);
        } else {
          setSelectedUser(data);
        }
      });

      return () => abortController.abort();
    } else {
      setSelectedUser(null);
    }
  }, [userId]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  if (redirectToSignin) {
    return (
      <Navigate to="/signup" state={{ from: location.pathname }} replace />
    );
  }

  // Show profile view if a user is selected
  if (selectedUser) {
    return (
      <div className="users-container">
        <button onClick={handleBackToList} className="back-button">
          ← Back to Users
        </button>
        <h2 className="users-header">Profile</h2>
        <div className="user-profile">
          <div className="user-item">
            <div className="user-avatar">
              {selectedUser.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{selectedUser.name}</p>
              <p className="user-email">{selectedUser.email}</p>
            </div>
            {auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id === selectedUser._id && (
                <div className="user-actions">
                  <button className="edit-btn">✏️ Edit</button>
                  <DeleteUser userId={selectedUser._id} />
                </div>
              )}
          </div>
          <div className="user-details">
            <p>
              {selectedUser.created
                ? `Joined: ${new Date(selectedUser.created).toDateString()}`
                : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show users list
  return (
    <div className="users-container">
      <h2 className="users-header">All Users</h2>
      <ul className="users-list">
        {users.map((item) => (
          <li
            className="user-item"
            key={item._id}
            onClick={() => handleUserClick(item)}
          >
            <div className="user-avatar">
              {item.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{item.name}</p>
            </div>
            <span className="user-arrow">→</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
