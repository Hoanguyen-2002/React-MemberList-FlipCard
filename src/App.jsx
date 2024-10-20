import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Modal, Card, Row, Col, Form, message } from "antd";
import "./App.css";
import "./index.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [newUser, setNewUser] = useState({ name: "", age: "" });
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Data parsed from localStorage:", error);
        localStorage.removeItem("users");
      }
    } else {
      axios
        .get("https://randomuser.me/api/?results=20")
        .then((response) => {
          setUsers(response.data.results);
          localStorage.setItem("users", JSON.stringify(response.data.results));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  const handleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddUser = () => {
    const { name, age } = newUser;
    if (!name || !age) {
      message.error("Name and Age are required.");
      return;
    }
    if (!isNaN(name)) {
      message.error("Name cannot be a number.");
      return;
    }
    if (isNaN(age)) {
      message.error("Age must be a number.");
      return;
    }

    const newMember = {
      login: { uuid: `${Date.now()}` },
      name: { first: name, last: "" },
      dob: { age: parseInt(age, 10) },
      picture: { large: "https://via.placeholder.com/150" },
      location: {
        street: { number: "", name: "" },
        city: "",
        state: "",
        country: "",
        postcode: "",
      },
      isNew: true,
    };

    const updatedUsers = [...users, newMember];
    setUsers(updatedUsers);
    setNewUser({ name: "", age: "" });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    message.success("Member added successfully!");
  };

  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    message.success("Member deleted successfully!");
  };

  const handleEditUser = () => {
    const { name, age } = newUser;

    if (!name || !age) {
      message.error("Name and Age are required.");
      return;
    }

    if (!isNaN(name)) {
      message.error("Name cannot be a number.");
      return;
    }

    if (isNaN(age)) {
      message.error("Age must be a number.");
      return;
    }

    const updatedUsers = users.map((user, index) =>
      index === editingUserIndex
        ? { ...user, name: { first: name }, dob: { age: parseInt(age, 10) }, isNew: false }
        : user
    );

    setUsers(updatedUsers);
    setEditingUserIndex(null);
    setNewUser({ name: "", age: "" });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    message.success("Member edited successfully!");
    setShowModal(false);
  };

  const startEditUser = (index) => {
    const userToEdit = users[index];
    setNewUser({ name: userToEdit.name.first, age: userToEdit.dob.age });
    setEditingUserIndex(index);
    setShowModal(true);
  };

  return (
    <div className="App">
      <h1>MEMBER LIST</h1>
      {/* Add member Form */}
      <div className="centered-container">
        <Form layout="inline" className="mb-4">
          <Form.Item>
            <Input
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Enter age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleAddUser}>
              Add Member
            </Button>
          </Form.Item>
        </Form>
    </div>

      <Row gutter={[16, 16]}>
        {users.map((user, index) => (
          <Col key={user.login.uuid} xs={24} sm={12} md={8}>
            <Card
              title={user.name.first}
              cover={<img alt="avatar" src={user.picture.large} />}
              actions={[
                <Button onClick={() => startEditUser(index)}>Edit</Button>,
                <Button danger onClick={() => handleDeleteUser(index)}>
                  Delete
                </Button>,
              ]}
              onClick={() => !user.isNew && handleFlip(index)}
            >
              <p>Age: {user.dob.age}</p>
              {flippedCards[index] && !user.isNew && (
                <>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>
                    Location:{" "}
                    {`${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`}
                  </p>
                  <p>PostCode: {user.location.postcode}</p>
                  <p>Date of Birth: {new Date(user.dob.date).toLocaleDateString()} (Age: {user.dob.age})</p>
                  <p>Nationality: {user.nat}</p>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Edit Member"
        visible={showModal}
        onOk={handleEditUser}
        onCancel={() => setShowModal(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name">
            <Input
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Age">
            <Input
              placeholder="Enter age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;