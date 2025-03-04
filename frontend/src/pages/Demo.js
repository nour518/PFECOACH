import React, { useState } from 'react';

const DemoPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Le prénom est requis';
    if (!formData.surname) newErrors.surname = 'Le nom est requis';
    if (!formData.phone) newErrors.phone = 'Le numéro de téléphone est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'L\'email n\'est pas valide';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      alert('Formulaire soumis avec succès !');
      // Ici, tu peux ajouter le code pour envoyer les données.
    }
  };

  return (
    <div className="demo-container">
      <div className="content-flex">
        {/* Partie Informations */}
        <div className="information">
          <h1>Transformez votre organisation avec Coaching</h1>
          <p>Découvrez aujourd’hui avec nos équipes comment notre solution de coaching digital libère le potentiel de vos collaborateurs et accompagne votre entreprise face aux changements.</p>

          <div className="program">
            <h2>AU PROGRAMME DE VOTRE RENDEZ-VOUS :</h2>
            <ul>
              <li>Échangez sur vos challenges et vos priorités</li>
              <li>Explorez nos programmes sur-mesure</li>
              <li>Découvrez la plateforme Coaching en action</li>
            </ul>
          </div>
        </div>

        {/* Partie Formulaire */}
        <div className="demo-form">
          <h2>Demander une Démo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Prénom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="surname">Nom</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
              {errors.surname && <p className="error">{errors.surname}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Numéro de téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <button type="submit">Demander une démo</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
