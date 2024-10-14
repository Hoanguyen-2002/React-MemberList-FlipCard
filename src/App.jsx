import React, { useState, useEffect } from "react";
import axios from 'axios';
import MemberCard from "./components/MemberCard";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [flippedCards, setFlippedCards] = useState({}); // State to track flipped card indices
  const [newUser, setNewUser] = useState({ name: '', age: '' }); // State for new user input
  const [editingUserIndex, setEditingUserIndex] = useState(null); // State to keep track of which user is being edited
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility

// useEffect hook to fetch users from localStorage or an API on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Data are parsed from localStorage:", error);
        localStorage.removeItem('users');
      }
    } else {
      axios.get('https://randomuser.me/api/?results=20')
        .then((response) => {
          setUsers(response.data.results);
          localStorage.setItem('users', JSON.stringify(response.data.results));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  // Function to handle card flip action
  const handleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to add a new user
  const handleAddUser = () => {
    const { name, age } = newUser;
    // Validate user input
    if (!name || !age) {
      setErrorMessage('Name and Age are required.');
      return;
    }

    if (!isNaN(name)) {
      setErrorMessage('Name cannot be a number.');
      return;
    }

    if (isNaN(age)) {
      setErrorMessage('Age must be a number.');
      return;
    }

    // Create a new member object
    const newMember = {
      login: { uuid: `${Date.now()}` }, // Generate a unique ID for the user
      name: { first: name, last: '' },
      dob: { age: parseInt(age, 10) },
      picture: { large: 'https://via.placeholder.com/150' },
      location: {
        street: { number: '', name: '' },
        city: '',
        state: '',
        country: '',
        postcode: '',
      },
      isNew: true, // Mark this user as new
    };

    // Update users state with the new member
    const updatedUsers = [...users, newMember];
    setUsers(updatedUsers);
    setNewUser({ name: '', age: '' });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setErrorMessage('');
  };

  // Function to delete a user
  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Function to edit a user
  const handleEditUser = () => {
    const { name, age } = newUser;

    // Validate user input
    if (!name || !age) {
      setErrorMessage('Name and Age are required.');
      return;
    }

    if (!isNaN(name)) {
      setErrorMessage('Name cannot be a number.');
      return;
    }

    if (isNaN(age)) {
      setErrorMessage('Age must be a number.');
      return;
    }

    // Update the users state with the edited user information
    const updatedUsers = users.map((user, index) =>
      index === editingUserIndex
        ? { ...user, name: { first: name }, dob: { age: parseInt(age, 10) }, isNew: false } // Đặt isNew là false khi sửa
        : user
    );

    setUsers(updatedUsers); // Update the users state
    setEditingUserIndex(null); // Reset editingUserIndex
    setNewUser({ name: '', age: '' }); // Reset newUser state
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Store updated users in localStorage
    setErrorMessage(''); // Clear any error messages
    setShowModal(false); // Close the modal after updating
  };

  // Function to start editing a user
  const startEditUser = (index) => {
    const userToEdit = users[index];
    setNewUser({ name: userToEdit.name.first, age: userToEdit.dob.age });
    setEditingUserIndex(index);
    setShowModal(true); //show modal when press "Edit"
  };

  return (
    <div className="App">
      <h1 className="text-2xl font-bold mb-4">Member List</h1>

      <div className="form mb-4">
        <input
          type="text"
          placeholder="Enter name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border rounded px-3 py-2 mr-2"
        />
        <input
          type="text"
          placeholder="Enter age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          className="border rounded px-3 py-2 mr-2"
        />
        <button 
          onClick={handleAddUser} 
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition mr-2"
        >
          Add Member
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>

      <div className="member-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <div
            key={user.login.uuid}
            className={`card-container ${flippedCards[index] && !user.isNew ? 'flipped' : ''}`} // allow flip when it not new member
            onClick={() => !user.isNew && handleFlip(index)} // not allow flip with new member
          >
            <div className="card border rounded-lg shadow-lg overflow-hidden">
              <div className="card-front p-4">
                <img src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} className="rounded-full mb-2" />
                <h3 className="text-lg font-semibold">{`${user.name.first}`}</h3>
                <p>Age: {user.dob.age}</p>
                <div className="flex justify-between">
                  <button 
                    onClick={() => startEditUser(index)} 
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(index)} 
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* display card back when it is not new member */}
              {!user.isNew && (
                <div className="card-back p-4">
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Location: {`${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`}</p>
                  <p>PostCode: {user.location.postcode}</p>
                  <p>Date of Birth: {new Date(user.dob.date).toLocaleDateString()} (Age: {user.dob.age})</p>
                  <p>Nationality: {user.nat}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white rounded shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Edit Member</h2>
            <input
              type="text"
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border rounded px-3 py-2 mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Enter age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              className="border rounded px-3 py-2 mb-4 w-full"
            />
            <button 
              onClick={handleEditUser} 
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition mr-2"
            >
              Save Changes
            </button>
            <button 
              onClick={() => setShowModal(false)} 
              className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;