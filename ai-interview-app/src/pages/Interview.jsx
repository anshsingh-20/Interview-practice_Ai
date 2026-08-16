import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../services/api";

function Interview() {
  const location = useLocation();
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Results step
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    if (category) {
      setTopic(category);
    }
  }, [location.search]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please specify a topic to practice.");
      return;
    }
    
    setError("");
    setLoading(true);
    setQuestion("");
    setUserAnswer("");
    setResult(null);

    try {
      const data = await api.generateQuestion(topic);
      setQuestion(data.question);
    } catch (err) {
      setError(err.message || "Failed to generate question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const evaluation = await api.submitAnswer(topic, question, userAnswer);
      setResult(evaluation);
    } catch (err) {
      setError(err.message || "Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setUserAnswer("");
    setResult(null);
    setError("");
  };

  return (
    <div className="page-shell">
      <div className="page-section">
        <h1 className="section-title">Mock Interview</h1>
        <p className="section-subtitle">
          Practice makes perfect. Generate a question, write your answer, and receive constructive AI-powered evaluation.
        </p>

        {error && <div className="error-alert">{error}</div>}

        {/* Step 1: Input Topic if no question is generated yet */}
        {!question && !loading && (
          <div className="form-card">
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter topic (e.g. React, Java, Node, CSS)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button className="primary-btn" onClick={handleGenerate}>
                Generate Question
              </button>
            </div>
          </div>
        )}

        {/* Loading Question State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="status">Formulating a realistic mock interview question for "{topic}"...</p>
          </div>
        )}

        {/* Step 2: Answer the question */}
        {question && !result && !submitting && (
          <div className="interview-flow">
            <div className="question-display-card">
              <span className="card-pill">{topic}</span>
              <h3>Question</h3>
              <p className="question-text">{question}</p>
            </div>

            <form onSubmit={handleSubmitAnswer} className="answer-form">
              <div className="form-group">
                <label htmlFor="userAnswer">Your Answer</label>
                <textarea
                  id="userAnswer"
                  rows="6"
                  placeholder="Type your detailed answer or code here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  required
                />
              </div>

              <div className="interview-actions">
                <button type="button" className="secondary-btn" onClick={handleReset}>
                  Skip Question
                </button>
                <button type="submit" className="primary-btn">
                  Submit Answer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Submitting Answer State */}
        {submitting && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="status">AI is evaluating your answer and generating feedback...</p>
          </div>
        )}

        {/* Step 3: View evaluation feedback */}
        {result && (
          <div className="result-container">
            <div className="result-header">
              <div className="rating-badge">
                <span className="rating-value">{result.rating}</span>
                <span className="rating-max">/10</span>
              </div>
              <div>
                <h3>Evaluation Score</h3>
                <p>Based on clarity, correctness, and completeness.</p>
              </div>
            </div>

            <div className="question-feedback-box">
              <div className="feedback-section">
                <h4>Question</h4>
                <p className="light-text">{result.question}</p>
              </div>
              
              <div className="feedback-section">
                <h4>Your Answer</h4>
                <p className="light-text">{result.userAnswer || "No answer provided"}</p>
              </div>

              <div className="feedback-section feedback-detail">
                <h4>AI Feedback</h4>
                <div className="feedback-content">{result.feedback}</div>
              </div>
            </div>

            <div className="interview-actions result-actions">
              <button className="secondary-btn" onClick={handleReset}>
                Try Another Question
              </button>
              <Link to="/history" className="primary-btn">
                View All History
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;