import { Link, useParams, useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";

const AddEmployee = () => {
  const [isEdit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setEdit(true);
      fetch(`http://localhost:8080/employees/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
        });
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const employee = {
      firstName,
      lastName,
      email,
    };

    const url = isEdit
      ? `http://localhost:8080/employees/${id}`
      : `http://localhost:8080/employees`;

    const method = isEdit ? "PUT" : "POST";

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Facing issue.");
    }
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="header-container mb-4">
        <Link to="/" className="text-decoration-none">
          <h3 className="logo-EM">Employee Management</h3>
        </Link>
      </div>
      <div className="card p-4 shadow-sm">
        <h2 className="text-center">
          {isEdit ? "Update Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="form-employee">
          <div className="form-group w-100">
            <label htmlFor="first-name-id">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter First Name Here..."
              value={firstName}
              id="first-name-id"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group w-100">
            <label htmlFor="last-name-id">Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Last Name Here..."
              value={lastName}
              id="last-name-id"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group w-100">
            <label htmlFor="email-id">Email Id</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email Id Here..."
              value={email}
              required
              id="email-id"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-100 d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <Link to="/" className="btn btn-secondary">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
