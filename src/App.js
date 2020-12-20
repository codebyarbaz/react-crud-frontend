import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Signup from "./Containers/Signup/Signup";
import Login from "./Containers/Login/Login";
import Home from "./Containers/Home/Home";
import Admin from "./Containers/Admin/Admin";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/login" exact component={Login}></Route>
        <Route path="/signup" exact component={Signup}></Route>
        <Route path="/admin" exact component={Admin}></Route>
        {/* <Route component={NotFound}></Route> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
