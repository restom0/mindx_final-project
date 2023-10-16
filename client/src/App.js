import React from "react";
import Todo from "./pages/Todo";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reportpage from "./pages/Reportpage";
import TodopageWithoutAccount from "./pages/TodopageWithoutAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/todo_0_account" element={<TodopageWithoutAccount />} />
        <Route path="/report" element={<Reportpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
