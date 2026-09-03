
import { useEffect, useState } from "react";

import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

import "./App.css";


function App() {
 const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    role: "",
  });

  const [editingUser, setEditingUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // GET USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      console.log("Users:", data);

      setUsers(data);
    } catch (error) {
      console.error(error);

      setMessage("Failed to load users");

      // Keep users as an array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.age ||
      !formData.role
    ) {
      setMessage("Please fill all fields");

      return;
    }

    try {
      const url = editingUser
        ? `${import.meta.env.VITE_API_URL}/${editingUser._id}`
        : `${import.meta.env.VITE_API_URL}/users`;

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (editingUser) {
        setMessage("User updated successfully");
      } else {
        setMessage("User added successfully");
      }

      resetForm();

      fetchUsers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // EDIT USER
  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE USER
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("User deleted successfully");

      fetchUsers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      age: "",
      role: "",
    });

    setEditingUser(null);
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    resetForm();

    setMessage("");
  };

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div>
            <p className="small-title">
              MERN STACK
            </p>

            <h1>User Management</h1>

            <p className="description">
              Full-stack CRUD application using React,
              Express and MongoDB.
            </p>
          </div>

          <div className="user-count">
            <span>{users.length}</span>
            <p>Total Users</p>
          </div>
        </header>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <UserForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          editingUser={editingUser}
          cancelEdit={cancelEdit}
        />

        <section className="users-section">

          <div className="section-header">
            <div>
              <h2>Users</h2>
              <p>Manage registered users</p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchUsers}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">
              Loading users...
            </div>
          ) : (
            <UserList
              users={users}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}

        </section>

      </div>
    </div>
  );
}

export default App;