import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

function Home() {
  const data = [
    { title: "React", description: "Practice modern frontend questions and component-based problem solving." },
    { title: "Java", description: "Test your object-oriented programming and backend interview knowledge." },
    { title: "Node", description: "Cover async patterns, APIs, and server-side development concepts." },
    { title: "HTML", description: "Rehearse structure, semantics, and accessibility-focused questions." },
    { title: "CSS", description: "Review layouts, responsiveness, and styling interview topics." },
        { title: "Bootstrap", description: "Review layouts, responsiveness, and styling interview topics." },
  ];

  return (
    <div className="page-shell">
      <section className="hero">
        <div>
          <span className="hero-badge">New • AI-powered mock interviews</span>
          <h1>Sharpen your interview skills with realistic practice.</h1>
          <p>Choose a topic, answer smart questions, and build confidence before your next big opportunity.</p>
          <div className="hero-actions">
            <Link to="/interview" className="primary-btn">Start practicing</Link>
            <Link to="/history" className="secondary-btn">View history</Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>What you’ll get</h3>
          <ul>
            <li>Tailored interview questions</li>
            <li>Focused practice by topic</li>
            <li>Track your progress over time</li>
          </ul>
        </div>
      </section>

      <section className="page-section">
        <h2 className="section-title">Pick a category</h2>
        <p className="section-subtitle">Choose a topic and jump into your next mock interview session.</p>

        <div className="cards">
          {data.map((item) => (
            <CategoryCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;