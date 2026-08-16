import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  
  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this interview from your history?")) {
      return;
    }

    try {
      await api.deleteInterview(id);
      setHistory(history.filter((item) => item._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert(err.message || "Failed to delete history item.");
    }
  };

  const handleStartEditNote = (item, e) => {
    e.stopPropagation();
    setEditingNoteId(item._id);
    setTempNoteText(item.notes || "");
  };

  const handleSaveNote = async (id, e) => {
    e.stopPropagation();
    setSavingNote(true);
    try {
      const updated = await api.updateInterview(id, { notes: tempNoteText });
      setHistory(history.map((item) => (item._id === id ? updated : item)));
      setEditingNoteId(null);
    } catch (err) {
      alert(err.message || "Failed to save notes.");
    } finally {
      setSavingNote(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="page-section">
        <div className="section-header-row">
          <div>
            <h1 className="section-title">Interview History</h1>
            <p className="section-subtitle">Review your past evaluations and track your growth.</p>
          </div>
          {history.length > 0 && (
            <Link to="/interview" className="primary-btn">
              Practice More
            </Link>
          )}
        </div>

        {error && <div className="error-alert">{error}</div>}

        {history.length === 0 ? (
          <div className="empty-history-card">
            <span className="card-pill">No history</span>
            <h3>Start Practicing!</h3>
            <p>You haven't completed any mock interviews yet. Your completed interviews will appear here.</p>
            <Link to="/interview" className="primary-btn mt-4">
              Start practicing
            </Link>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => {
              const isExpanded = expandedId === item._id;
              const isEditingNote = editingNoteId === item._id;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item._id}
                  className={`history-item-card ${isExpanded ? "expanded" : ""}`}
                  onClick={() => toggleExpand(item._id)}
                >
                  <div className="history-card-header">
                    <div className="card-header-left">
                      <span className="topic-badge">{item.topic}</span>
                      <span className="date-text">{formattedDate}</span>
                    </div>

                    <div className="card-header-right">
                      <div className="history-rating">
                        <span className="rating-num">{item.rating}</span>
                        <span className="rating-denom">/10</span>
                      </div>
                      <button
                        className="delete-icon-btn"
                        onClick={(e) => handleDelete(item._id, e)}
                        title="Delete record"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="history-card-summary-text">
                    <strong>Q:</strong> {item.question.length > 120 && !isExpanded
                      ? `${item.question.substring(0, 120)}...`
                      : item.question}
                  </div>

                  {isExpanded && (
                    <div className="history-card-body" onClick={(e) => e.stopPropagation()}>
                      <div className="history-detail-section">
                        <h5>Your Answer</h5>
                        <p className="history-detail-text">{item.userAnswer || "No answer provided"}</p>
                      </div>

                      <div className="history-detail-section feedback-bubble">
                        <h5>AI Evaluation</h5>
                        <p className="history-detail-text">{item.feedback}</p>
                      </div>

                      <div className="history-detail-section notes-section">
                        <h5>My Study Notes</h5>
                        {isEditingNote ? (
                          <div className="edit-note-container">
                            <textarea
                              rows="3"
                              value={tempNoteText}
                              onChange={(e) => setTempNoteText(e.target.value)}
                              placeholder="Add personal notes, follow-up points, or code revisions..."
                            />
                            <div className="edit-note-actions">
                              <button
                                className="cancel-note-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingNoteId(null);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="save-note-btn"
                                onClick={(e) => handleSaveNote(item._id, e)}
                                disabled={savingNote}
                              >
                                {savingNote ? "Saving..." : "Save Notes"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="note-display">
                            <p className="note-text italic">
                              {item.notes || "No study notes added yet. Add key takeaways or revisions here."}
                            </p>
                            <button
                              className="edit-note-link-btn"
                              onClick={(e) => handleStartEditNote(item, e)}
                            >
                              Edit Notes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="expand-indicator">
                    {isExpanded ? "Collapse Details ▲" : "Click to view full answer & feedback ▼"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default History;