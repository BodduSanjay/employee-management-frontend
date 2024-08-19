import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

import "./index.css";

// Multiple api status handle.
const currentApiStatus = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const Home = () => {
  const [employeesList, setEmployeesList] = useState([]);
  const [search, setSearch] = useState("");
  const [apiStatus, setApiStatus] = useState(currentApiStatus.loading);

  useEffect(() => {
    fetchEmployee();
  }, []);

  // Fetch's all employees list.
  const fetchEmployee = async () => {
    const response = await fetch("http://localhost:8080/employees");
    const data = await response.json();
    if (response.ok) {
      setEmployeesList(data);
      setApiStatus(currentApiStatus.success);
    } else {
      setApiStatus(currentApiStatus.failure);
    }
  };

  // Handles Delete Click.
  const handleDelete = async (id) => {
    const url = `http://localhost:8080/employees/${id}`;
    try {
      await fetch(url, {
        method: "DELETE",
      });

      setEmployeesList(employeesList.filter((employee) => employee.id !== id));
    } catch (e) {
      throw new Error("Something Went Wrong");
    }
  };

  // Handle's Id search.
  const handleSearch = async () => {
    try {
      if (search !== "") {
        const response = await fetch(
          `http://localhost:8080/employees/${search}`
        );
        const data = await response.json();

        //Set's employees list empty if employee not found.
        if (response.status === 404) {
          setEmployeesList([]);
        }

        if (response.ok) {
          setEmployeesList([data]);
        }
      } else {
        fetchEmployee();
      }
    } catch (e) {
      console.error(e);
      setApiStatus(currentApiStatus.failure);
    }
  };

  // Render's Loading icon when the app is opned or reloaded.
  const renderLoading = () => (
    <div className="loading-cont">
      <TailSpin size={20} color="#3aabe8" />
    </div>
  );

  // Render's List of Employee's to table.
  const renderList = () => (
    <div>
      <div className="input-btn-cont">
        <Link to="/add-employee">
          <button className="add-btn">Add Employee</button>
        </Link>
        <div>
          <input
            type="number"
            value={search}
            className="search-input"
            placeholder="Enter Employee Id Here..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {employeesList.length === 0 ? (
        <h4 className="no-details-para">No employee detalis available.</h4> // Prints No Employees if list is Empty
      ) : (
        <table border={1}>
          <thead>
            <tr>
              <th>ID</th>
              <th>FIRSTNAME</th>
              <th>LASTNAME</th>
              <th>EMAIL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeesList.map((each) => (
              <tr key={each.id}>
                <td>{each.id}</td>
                <td>{each.firstName}</td>
                <td>{each.lastName}</td>
                <td>{each.email}</td>
                <td>
                  <Link
                    to={`/edit-employee/${each.id}`}
                    className="update-link"
                  >
                    <button className="update-btn">Update</button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(each.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render's if any failure in the process.
  const renderfailure = () => <h1>Something Went Wrong...</h1>;

  // call's multiple functions in defferent stages to manage interface of application.
  const renderAll = () => {
    switch (apiStatus) {
      case currentApiStatus.loading:
        return renderLoading();
      case currentApiStatus.success:
        return renderList();
      case currentApiStatus.failure:
        return renderfailure();
      default:
        return null;
    }
  };

  return (
    <div className="home-bg-container">
      <div className="header-cotanier">
        <Link to="/" className="logo-link">
          <h3 className="logo-EM">Employee Management</h3>
        </Link>
      </div>
      <div className="home-body-container">
        <h2>Employees List</h2>
        {renderAll()}
      </div>
    </div>
  );
};

export default Home;
