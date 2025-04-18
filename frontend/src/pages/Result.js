import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./result.css";

const Result = () => {
  const navigate = useNavigate();
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDiagnostic = localStorage.getItem("diagnostic");

    if (storedDiagnostic) {
      try {
        const parsedDiagnostic = JSON.parse(storedDiagnostic);
        setDiagnosticData(parsedDiagnostic);
      } catch (error) {
        console.error("Erreur lors du parsing du diagnostic:", error);
        navigate("/test");
      }
    } else {
      navigate("/test");
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="loading">Chargement du diagnostic...</div>;
  }

  if (!diagnosticData) {
    return (
      <div className="result-page">
        <div className="result-container">
          <h1>Aucun diagnostic disponible</h1>
          <p>Veuillez passer le test pour obtenir un diagnostic.</p>
          <button onClick={() => navigate("/test")} className="action-button">
            Passer le test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-container">
        {/* Avatar AI animé */}
       
        <img
  src="https://cdn.futura-sciences.com/sources/images/IA-technologie.jpeg"
  alt=""
  className="img"
/>
        <h1>Votre Diagnostic</h1>
        <p className="result-date">Généré le {new Date().toLocaleDateString()}</p>

        {/* Diagnostic avec effet machine à écrire */}
        <div className="diagnostic-content typewriter">
          {diagnosticData.diagnostic}
        </div>

        <button onClick={() => navigate("/")} className="action-button">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Result;
