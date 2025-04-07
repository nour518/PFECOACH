import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../contact.css";

// Style pour la carte
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

// Centre de la carte (exemple : Paris)
const mapCenter = {
  lat: 48.8566,
  lng: 2.3522,
};

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2>Contactez-nous</h2>
      </div>

      <div className="contact-details">
        <div className="contact-info">
          <h3>Nom de la Société</h3>
          <p>coaches</p>

          <h3>Adresse</h3>
          <p>123 Rue de l'Entreprise, Gabés</p>
        </div>

        <div className="contact-info">
          <h3>Téléphone</h3>
          <p>+216 75.889.366</p>
        </div>
      </div>

      <div className="contact-map">
        <LoadScript googleMapsApiKey="IzaSyDZnTGKO04Ot0I8YJqDBK1dzlmvn8R9Iz">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Contact;
