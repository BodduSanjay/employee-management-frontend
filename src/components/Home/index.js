import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

import "./index.css";

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

  const handleSearch = async () => {
    try {
      if (search !== "") {
        const response = await fetch(
          `http://localhost:8080/employees/${search}`
        );
        const data = await response.json();

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

  const renderLoading = () => (
    <div className="d-flex justify-content-center mt-5">
      <TailSpin size={20} color="#3aabe8" />
    </div>
  );

  const renderList = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <Link to="/add-employee" className="btn btn-dark mb-2">
          Add Employee
        </Link>
        <div className="d-flex">
          <input
            type="number"
            value={search}
            className="form-control mr-2"
            placeholder="Enter Employee Id Here..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-dark" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {employeesList.length === 0 ? (
        <h4 className="text-center text-muted">
          No employee details available.
        </h4>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
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
                      <button className="btn btn-primary">Update</button>
                    </Link>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => handleDelete(each.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderfailure = () => <h1>Something Went Wrong...</h1>;

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
    <div className="container mt-5">
      <div className="header-container mb-4">
        <Link to="/" className="text-decoration-none">
          <h3 className="logo-EM">Employee Management</h3>
        </Link>
      </div>
      <div>
        <h2 className="mb-4 text-center">Employees List</h2>
        {renderAll()}
      </div>
    </div>
  );
};

export default Home;
