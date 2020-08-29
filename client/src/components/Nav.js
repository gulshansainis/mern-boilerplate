import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { isAuth, signout } from "../utility/helpers";

const Nav = ({ history }) => {
  return (
    <nav className="shadow-lg">
      <ul className="flex list-none bg-teal-400">
        <li className="text-2xl p-2 cursor-pointer hover:text-white hover:bg-teal-500">
          <NavLink exact={true} activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        {!isAuth() && (
          <>
            <li className="text-2xl p-2 cursor-pointer hover:text-white hover:bg-teal-500">
              <NavLink exact={true} activeClassName="active" to="/signup">
                Signup
              </NavLink>
            </li>
            <li className="text-2xl p-2 cursor-pointer hover:text-white hover:bg-teal-500">
              <NavLink exact={true} activeClassName="active" to="/signin">
                Signin
              </NavLink>
            </li>
          </>
        )}
        {isAuth() && isAuth().role === "admin" && (
          <li className="text-2xl p-2 cursor-pointer hover:text-white hover:bg-teal-500">
            <NavLink exact={true} activeClassName="active" to="/admin">
              {isAuth().name}
            </NavLink>
          </li>
        )}
        {isAuth() && isAuth().role !== "admin" && (
          <li className="text-2xl p-2 cursor-pointer hover:text-white hover:bg-teal-500">
            <NavLink exact={true} activeClassName="active" to="/private">
              {isAuth().name}
            </NavLink>
          </li>
        )}
        {isAuth() && (
          <li
            className="text-2xl p-2 cursor-pointer hover:text-white hover:bg-teal-500"
            onClick={() => {
              signout(() => {
                console.log("Signout success");
                history.push("/");
              });
            }}
          >
            Signout
          </li>
        )}
      </ul>
    </nav>
  );
};

export default withRouter(Nav);
