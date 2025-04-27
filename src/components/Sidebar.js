import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, FaUser, FaBriefcase, FaGlobe, FaFileAlt, 
  FaBullseye, FaBook, FaChartBar, FaCalendarAlt, FaCog,
  FaBrain, FaUserGraduate, FaUserTie, FaRunning, FaTrophy,
  FaChartLine, FaUsers, FaUserFriends, FaComments, FaEnvelope,
  FaChalkboard, FaClipboardCheck, FaClock, FaMedal, FaPoll,
  FaStickyNote, FaChevronDown, FaChevronRight
} from "react-icons/fa";
import { theme } from "../theme";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: FaTachometerAlt,
      path: "/dashboard"
    },
    {
      title: "My Space",
      icon: FaUser,
      children: [
        { title: "My Score Card", path: "/dashboard/my-space/my-score-card", icon: FaChartBar },
        { title: "Frame of Mind", path: "/dashboard/my-space/frame-of-mind", icon: FaBrain },
        { title: "Skill Matrix", path: "/dashboard/my-space/skill-matrix", icon: FaUserGraduate },
        { title: "My Coach", path: "/dashboard/my-space/my-coach", icon: FaUserTie },
        { title: "I Am Coach", path: "/dashboard/my-space/i-am-coach", icon: FaUserTie },
        { title: "My Activities", path: "/dashboard/my-space/activities", icon: FaRunning },
        { title: "My Accomplishments", path: "/dashboard/my-space/accomplishments", icon: FaTrophy },
        { title: "Progress Report", path: "/dashboard/my-space/progress-report", icon: FaChartLine }
      ]
    },
    {
      title: "My Work",
      icon: FaBriefcase,
      children: [
        { title: "Posts", path: "/dashboard/my-work/posts", icon: FaFileAlt },
        { title: "Groups", path: "/dashboard/my-work/groups", icon: FaUsers },
        { title: "Jobs", path: "/dashboard/my-work/jobs", icon: FaBriefcase },
        { title: "My Connections", path: "/dashboard/my-work/connections", icon: FaUserFriends },
        { title: "Messenger", path: "/dashboard/my-work/messenger", icon: FaComments },
        { title: "My Resume", path: "/dashboard/my-work/resume", icon: FaFileAlt },
        { title: "My Own Site", path: "/dashboard/my-work/own-site", icon: FaGlobe },
        { title: "Email", path: "/dashboard/my-work/email", icon: FaEnvelope }
      ]
    },
    {
      title: "Tools",
      icon: FaGlobe,
      children: [
        { title: "Whiteboard", path: "/dashboard/tools/whiteboard", icon: FaChalkboard },
        { title: "Assessment", path: "/dashboard/tools/assessment", icon: FaClipboardCheck },
        { title: "Planner Timesheet", path: "/dashboard/tools/planner-timesheet", icon: FaClock },
        { title: "Rewards & Recognition", path: "/dashboard/tools/rewards-recognition", icon: FaMedal },
        { title: "Survey", path: "/dashboard/tools/survey", icon: FaPoll },
        { title: "Everyday Notes", path: "/dashboard/tools/everyday-notes", icon: FaStickyNote },
        { title: "CIBIL", path: "/dashboard/tools/cibil", icon: FaChartLine }
      ]
    },
    { title: "Personal Information", icon: FaUser, path: "/dashboard/personal-information" },
    { title: "Professional Info", icon: FaBriefcase, path: "/dashboard/professional-information" },
    { title: "Global Information", icon: FaGlobe, path: "/dashboard/global-information" },
    { title: "Documents", icon: FaFileAlt, path: "/dashboard/documents" },
    { title: "Goals", icon: FaBullseye, path: "/dashboard/goals" },
    { title: "Courses", icon: FaBook, path: "/dashboard/courses" },
    { title: "SWOT Analysis", icon: FaChartBar, path: "/dashboard/swot" },
    { title: "Daily Tracker", icon: FaCalendarAlt, path: "/dashboard/habits" },
    { title: "Settings", icon: FaCog, path: "/dashboard/settings" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div
      style={{
        width: isOpen ? "250px" : "0",
        position: "fixed",
        top: theme.spacing.navbar,
        left: "0",
        height: `calc(100vh - ${theme.spacing.navbar})`,
        backgroundColor: theme.colors.primary,
        transition: "width 0.3s ease",
        overflowX: "hidden",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(255,255,255,0.1)",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.2)",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(255,255,255,0.3)",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.2) rgba(255,255,255,0.1)",
      }}
    >
      <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.children ? (
              <div>
                <div
                  onClick={() => toggleExpand(index)}
                  style={{
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: location.pathname.includes(item.title.toLowerCase()) 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "transparent",
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    <item.icon />
                  </span>
                  <span style={{ marginLeft: "12px" }}>{item.title}</span>
                  <span style={{ marginLeft: "auto" }}>
                    {expandedItems[index] ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </div>
                {expandedItems[index] && (
                  <ul style={{ 
                    listStyle: "none", 
                    padding: "0",
                    backgroundColor: "rgba(0,0,0,0.1)"
                  }}>
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <div
                          onClick={() => handleNavigation(child.path)}
                          style={{
                            padding: "10px 20px 10px 40px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            color: "white",
                            backgroundColor: location.pathname === child.path 
                              ? "rgba(255,255,255,0.1)" 
                              : "transparent"
                          }}
                        >
                          <span style={{ fontSize: '1rem' }}>
                            <child.icon />
                          </span>
                          <span style={{ marginLeft: "12px" }}>{child.title}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div
                onClick={() => handleNavigation(item.path)}
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: location.pathname === item.path 
                    ? "rgba(255,255,255,0.1)" 
                    : "transparent",
                  borderLeft: location.pathname === item.path 
                    ? "4px solid white" 
                    : "4px solid transparent"
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>
                  <item.icon />
                </span>
                <span style={{ marginLeft: "12px" }}>{item.title}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
