import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { isAuth, signout } from "../utility/helpers";

const Nav = ({ history }) => {
  return (
    <nav className="py-2 md:container mx-auto">
      <ul className="flex md:mx-10 sm:mx-0 my-4 items-center">
        <li className="flex-1">
          <NavLink className="py-3 font-bold text-2xl" exact={true} to="/">
            Chatters.co
          </NavLink>
        </li>
        {!isAuth() && (
          <>
            <li className="invisible sm:visible">
              <NavLink className="px-2 py-3" exact={true} to="/signin">
                Sign In
              </NavLink>
            </li>
            <li className="invisible sm:visible">
              <NavLink
                className="px-2 py-3 bg-blue-brand rounded text-white font-bold"
                exact={true}
                to="/signup"
              >
                Sign Up
              </NavLink>
            </li>
          </>
        )}
        {isAuth() && isAuth().role === "admin" && (
          <li>
            <NavLink className="px-2 py-3" exact={true} to="/admin">
              Admin
            </NavLink>
          </li>
        )}
        {isAuth() && (
          <li>
            <NavLink className="px-2 py-3" exact={true} to="/edit/profile">
              Profile
            </NavLink>
          </li>
        )}
        {isAuth() && (
          <li>
            <a
              className="px-2 py-3 bg-blue-brand rounded text-white font-bold"
              href="#"
              onClick={() => {
                signout((e) => {
                  console.log("Signout success");
                  history.push("/");
                });
              }}
            >
              Sign Out
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default withRouter(Nav);
