import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import TasksList from "../components/TasksList.jsx"; // Import the TasksList component
import TaskMobile from "../components/TaskMobile.jsx";
import "./Task.css"; // Import the CSS file for Task page

function TaskPage() {
  return (
    <div>
      <Header />
      <div className="token-list-desktop">
        {" "}
        {/* Added container for tasks */}
        <TasksList /> {/* Render the TasksList component */}
      </div>
      <div className="token-list-mobile">
        {" "}
        {/* Added container for tasks */}
        <TaskMobile /> {/* Render the TasksMobile component */}
      </div>
      <Footer />
    </div>
  );
}

export default TaskPage;
