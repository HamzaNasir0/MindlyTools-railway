import { useState } from "react";
import Layout from "../components/Layout";
import ToolCard from "../components/ToolCard";
import ToDoList from "./ToDoList";
import HabitTracker from "./HabitTracker";
import Calculator from "../components/Calculator";
import MyCalendar from "../components/MyCalendar";
import UserProfile from "./UserProfile";
import styles from "../styles/home.module.css";

export default function Home({ user }) {
  const [activeTool, setActiveTool] = useState(null);

  // Tool mapping
  const toolComponents = {
    todolist: <ToDoList user={user} />,
    habits: <HabitTracker user={user} />,
    calculator: <Calculator />,
    calendar: <MyCalendar />,
    profile: <UserProfile user={user} />,
    notes: <div className={styles.comingSoon}>Notes feature coming soon!</div>,
    pomodoro: (
      <div className={styles.comingSoon}>Pomodoro Timer coming soon!</div>
    ),
    budget: (
      <div className={styles.comingSoon}>Budget Planner coming soon!</div>
    ),
  };

  // Tool data
  const tools = [
    {
      id: "todolist",
      title: "Todo List",
      description: "Manage daily tasks, set priorities, and track progress",
      icon: "📝",
    },
    {
      id: "calculator",
      title: "Calculator",
      description: "Perform accurate calculations with an intuitive interface",
      icon: "🧮",
    },
    {
      id: "habits",
      title: "Habit Tracker",
      description: "Build consistency and monitor your daily habits easily",
      icon: "📈",
    },
    {
      id: "calendar",
      title: "Calendar",
      description: "A simple calendar for organizing your days effortlessly.",
      icon: "🗓️",
    },
    {
      id: "notes",
      title: "Notes",
      description: "Capture and organize your ideas and thoughts instantly",
      icon: "📒",
    },
    {
      id: "pomodoro",
      title: "Pomodoro Timer",
      description: "Focus with structured timed work and break sessions",
      icon: "⏱️",
    },
    {
      id: "budget",
      title: "Budget Planner",
      description: "Track expenses and manage your personal finances wisely",
      icon: "💰",
    },
  ];

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
  };

  const handleBackToTools = () => {
    setActiveTool(null);
  };

  return (
    <Layout user={user}>
      {activeTool ? (
        // Tool Content Page
        <div className={styles.toolContentView}>
          <div className={styles.toolHeader}>
            <button onClick={handleBackToTools} className={styles.backButton}>
              ← Back to Tools
            </button>
            <h1 className={styles.toolTitle}>
              <span className={styles.toolIcon}>
                {tools.find((t) => t.id === activeTool)?.icon}
              </span>
              {tools.find((t) => t.id === activeTool)?.title}
            </h1>
          </div>

          <div className={styles.toolContentContainer}>
            {toolComponents[activeTool] || (
              <div className={styles.noToolSelected}>
                <p>This tool is not available yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.homeContainer}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.titleHeader}>
              <h1 className={styles.mainTitle}>
                Simple tools for a more{" "}
                <span className={styles.highlight}>productive</span> day
              </h1>
              <p className={styles.subtitle}>
                Elevate your daily productivity with our curated toolkit
              </p>
              <p className={styles.description}>
                Streamline your workflow, track your progress, and achieve more
                with our intuitive productivity tools.
              </p>
            </div>
          </div>

          {/* Tools Grid Section */}
          <div className={styles.toolsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Tools</h2>
              <p className={styles.sectionSubtitle}>
                Tools designed to boost your efficiency
              </p>
            </div>

            <div className={styles.mainContent}>
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  onClick={() => handleToolClick(tool.id)}
                />
              ))}
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>🛠️ More tools coming soon!</h3>
              <p className={styles.ctaText}>
                We're constantly expanding our toolkit. Have a suggestion?
                <a href="/" className={styles.ctaLink}>
                  Let us know
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
