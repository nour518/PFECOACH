"use client"
import { useState } from "react"
import "../styles.css"

const TestManagement = () => {
  const [tests, setTests] = useState([
    {
      id: 1,
      title: "Test de personnalité",
      description: "Évaluation complète de la personnalité",
      questions: [
        {
          id: 1,
          text: "Comment gérez-vous le stress ?",
          type: "multiple",
          options: ["Très bien", "Bien", "Moyen", "Difficilement"],
        },
        {
          id: 2,
          text: "Décrivez votre routine quotidienne",
          type: "text",
        },
      ],
    },
  ])

  const [newTest, setNewTest] = useState({
    title: "",
    description: "",
    questions: [],
  })

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "multiple",
    options: [""],
  })

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ""],
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion({
      ...newQuestion,
      options: newOptions,
    })
  }

  const handleAddQuestion = () => {
    if (!newQuestion.text) return

    setNewTest({
      ...newTest,
      questions: [
        ...newTest.questions,
        {
          id: newTest.questions.length + 1,
          ...newQuestion,
        },
      ],
    })

    setNewQuestion({
      text: "",
      type: "multiple",
      options: [""],
    })
  }

  const handleSaveTest = () => {
    if (!newTest.title || !newTest.description || newTest.questions.length === 0) return

    setTests([
      ...tests,
      {
        id: tests.length + 1,
        ...newTest,
      },
    ])

    setNewTest({
      title: "",
      description: "",
      questions: [],
    })
  }

  return (
    <div className="test-management">
      <h1>Gestion des Tests</h1>

      <div className="create-test-section">
        <h2>Créer un nouveau test</h2>
        <div className="test-form">
          <input
            type="text"
            placeholder="Titre du test"
            value={newTest.title}
            onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
            className="test-input"
          />
          <textarea
            placeholder="Description du test"
            value={newTest.description}
            onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
            className="test-textarea"
          />

          <div className="questions-section">
            <h3>Questions</h3>
            {newTest.questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <p>
                  <strong>Question {index + 1}:</strong> {question.text}
                </p>
                {question.type === "multiple" && (
                  <div className="options-list">
                    <strong>Options:</strong>
                    <ul>
                      {question.options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="add-question-form">
              <input
                type="text"
                placeholder="Texte de la question"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="question-input"
              />
              <select
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                className="question-type-select"
              >
                <option value="multiple">Choix multiple</option>
                <option value="text">Texte libre</option>
              </select>

              {newQuestion.type === "multiple" && (
                <div className="options-section">
                  {newQuestion.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="option-input"
                    />
                  ))}
                  <button onClick={handleAddOption} className="add-option-button">
                    Ajouter une option
                  </button>
                </div>
              )}

              <button onClick={handleAddQuestion} className="add-question-button">
                Ajouter la question
              </button>
            </div>
          </div>

          <button onClick={handleSaveTest} className="save-test-button">
            Enregistrer le test
          </button>
        </div>
      </div>

      <div className="existing-tests-section">
        <h2>Tests existants</h2>
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <h3>{test.title}</h3>
            <p>{test.description}</p>
            <p>Nombre de questions : {test.questions.length}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestManagement

