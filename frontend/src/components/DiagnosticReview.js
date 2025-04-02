"use client"
import { useState } from "react"
import "../styles.css"

const DiagnosticReview = ({ diagnostic, onApprove, onModify }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedDiagnostic, setEditedDiagnostic] = useState(diagnostic.diagnostic)
  const [comments, setComments] = useState("")

  const formatDiagnostic = (text) => {
    // Diviser par sections numérotées
    const sections = text.split(/\d\.\s+/).filter(Boolean)
    if (sections.length >= 4) {
      return {
        globalAnalysis: sections[0],
        strengths: sections[1],
        improvements: sections[2],
        recommendations: sections[3],
      }
    }
    // Si le format ne correspond pas, afficher le texte brut
    return {
      globalAnalysis: text,
      strengths: "",
      improvements: "",
      recommendations: "",
    }
  }

  const formattedDiagnostic = formatDiagnostic(diagnostic.diagnostic)

  const handleSaveChanges = () => {
    onModify(editedDiagnostic, comments)
    setIsEditing(false)
  }

  const handleApprove = () => {
    onApprove(comments)
  }

  return (
    <div className="diagnostic-review">
      <div className="user-info">
        <h3>Diagnostic de {diagnostic.userId?.name || "Utilisateur inconnu"}</h3>
        <p>Date: {new Date(diagnostic.date).toLocaleDateString()}</p>
      </div>

      {isEditing ? (
        <div className="edit-diagnostic">
          <h4>Modifier le diagnostic</h4>
          <textarea
            value={editedDiagnostic}
            onChange={(e) => setEditedDiagnostic(e.target.value)}
            className="edit-textarea"
            rows={10}
          ></textarea>
        </div>
      ) : (
        <div className="diagnostic-content">
          <div className="diagnostic-section">
            <h4>Analyse Globale</h4>
            <p>{formattedDiagnostic.globalAnalysis}</p>
          </div>

          {formattedDiagnostic.strengths && (
            <div className="diagnostic-section">
              <h4>Points Forts</h4>
              <p>{formattedDiagnostic.strengths}</p>
            </div>
          )}

          {formattedDiagnostic.improvements && (
            <div className="diagnostic-section">
              <h4>Axes d'Amélioration</h4>
              <p>{formattedDiagnostic.improvements}</p>
            </div>
          )}

          {formattedDiagnostic.recommendations && (
            <div className="diagnostic-section">
              <h4>Recommandations</h4>
              <p>{formattedDiagnostic.recommendations}</p>
            </div>
          )}
        </div>
      )}

      <div className="coach-comments">
        <h4>Commentaires du coach</h4>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Ajoutez vos commentaires ici..."
          className="comments-textarea"
          rows={4}
        ></textarea>
      </div>

      <div className="review-actions">
        {isEditing ? (
          <>
            <button onClick={handleSaveChanges} className="action-button primary-button">
              Enregistrer les modifications
            </button>
            <button onClick={() => setIsEditing(false)} className="action-button secondary-button">
              Annuler
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="action-button secondary-button">
              Modifier
            </button>
            <button onClick={handleApprove} className="action-button primary-button">
              Approuver
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default DiagnosticReview

