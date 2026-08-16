import { Link } from "react-router-dom";

function CategoryCard({ title, description }) {
  return (
    <div className="card">
      <span className="card-pill">Skill focus</span>
      <h3>{title}</h3>
      <p>{description || `Practice ${title} interview questions and sharpen your answers.`}</p>
      <Link to={`/interview?category=${title}`}>
        <button>Start</button>
      </Link>
    </div>
  );
}

export default CategoryCard;