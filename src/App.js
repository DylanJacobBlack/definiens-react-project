import React, { Suspense, useContext, Fragment } from "react";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";

import "./App.module.css";

import NavBar from "./components/NavBar/NavBar";
import Lessons from "./pages/Lessons";
import NewLesson from "./pages/NewLesson";
// import Profile from "./pages/Profile";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import AuthContext from "./store/auth-context";

import loadingSpinner from "./assets/spinner.jpg";

function App() {
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const Lesson = React.lazy(() => import("./pages/Lesson"));

  async function addLessonHandler(formData) {
    try {
      const response = await fetch(
        "https://definiens-api.herokuapp.com/api/v1/lessons",
        {
          method: "POST",
          headers: {
            accepts: "application/json",
          },
          body: formData,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    history.push("/lessons");
  }

  return (
    <Fragment>
      <NavBar />
      {isLoggedIn && (
        <Suspense
          fallback={
            <div className="spinner-container">
              <img
                className="spinner"
                src={loadingSpinner}
                alt="Loading spinner"
              />
            </div>
          }
        >
          <Switch>
            <Route path="/lessons" exact>
              <Lessons />
            </Route>
            <Route path="/new">
              <NewLesson onAddLesson={addLessonHandler} />
            </Route>
            {/* <Route path="/profile">
              <Profile />
            </Route> */}
            <Route path="/lessons/:lessonId">
              <Lesson />
            </Route>
            <Route path="/*">
              <Redirect to="/lessons" />
            </Route>
          </Switch>
        </Suspense>
      )}
      {!isLoggedIn && (
        <Suspense
          fallback={
            <div className="spinner-container">
              <img
                className="spinner"
                src={loadingSpinner}
                alt="Loading spinner"
              />
            </div>
          }
        >
          <Switch>
            <Route path="/lessons" exact>
              <Lessons />
            </Route>
            <Route path="/lessons/:lessonId">
              <Lesson />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/" exact>
              <Welcome />
            </Route>
            <Route path="/*">
              <Redirect to="/lessons" />
            </Route>
          </Switch>
        </Suspense>
      )}
    </Fragment>
  );
}

export default App;
