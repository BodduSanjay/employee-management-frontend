import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AddEmployee from "./components/AddEmployee";

import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route exact path="/" Component={Home} />
      <Route exact path="/add-employee" Component={AddEmployee} />
      <Route exact path="/edit-employee/:id" Component={AddEmployee} />
    </Routes>
  );
};

export default App;
