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
        }); // Set the values to the corresponding inputs of previous employee.
    }
  }, [id]);

  // handle's creating new employee or updating old employee.
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
    <div className="home-bg-container">
      <div className="header-cotanier">
        <Link to="/" className="logo-link">
          <h3 className="logo-EM">Employee Management</h3>
        </Link>
      </div>
      <div className="add-employee-cont">
        <h2>{isEdit ? "Update Employee" : "Add Employee"}</h2>
        <form onSubmit={handleSubmit} className="form-employee">
          <label htmlFor="first-name-id">First Name</label>
          <input
            type="text"
            placeholder="Enter First Name Here..."
            value={firstName}
            id="first-name-id"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="last-name-id">Last Name</label>
          <input
            type="text"
            placeholder="Enter Last Name Here..."
            value={lastName}
            id="last-name-id"
            required
            onChange={(e) => setLastName(e.target.value)}
          />
          <label htmlFor="email-id">Email Id</label>
          <input
            type="email"
            placeholder="Enter Email Id Here..."
            value={email}
            required
            id="email-id"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="btn-cont">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <Link to="/">
              <button type="button" className="back-btn">
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
