import React from "react";
import Todo from "./pages/Todo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reportpage from "./pages/Reportpage";
import TodopageWithoutAccount from "./pages/TodopageWithoutAccount";
import TodopageWithAccount from "./pages/TodopageWithAccount";
import Loginpage from "./pages/Loginpage";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo_0_account" element={<TodopageWithoutAccount />} />
        <Route path="/todo_1_account" element={<TodopageWithAccount />} />
        <Route path="/report" element={<Reportpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
