import React, { useState } from 'react';
import "../styles.css"

const Dashboard = () => {
  const [active, setActive] = useState('overview');

  const renderContent = () => {
    switch (active) {
      case 'overview':
        return <Overview />;
      case 'diagnostics':
        return <Diagnostics />;
      case 'plans':
        return <Plans />;
      case 'messages':
        return <Messages />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar-nav">
        <h2 className="sidebar-title">CoachLife</h2>
        <nav className="sidebar-menu">
          <button className={active === 'overview' ? 'active-btn' : ''} onClick={() => setActive('overview')}>🏠 Tableau de bord</button>
          <button className={active === 'diagnostics' ? 'active-btn' : ''} onClick={() => setActive('diagnostics')}>🧠 Diagnostics</button>
          <button className={active === 'plans' ? 'active-btn' : ''} onClick={() => setActive('plans')}>📝 Plans</button>
          <button className={active === 'messages' ? 'active-btn' : ''} onClick={() => setActive('messages')}>💬 Messages</button>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="main-header">
          <h1>Bienvenue  👋</h1>
        </header>
        <section className="main-section">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

const Overview = () => (
  <div className="overview-cards">
    <div className="overview-card">
      <h3>Clients coachés</h3>
      <p>32</p>
    </div>
    <div className="overview-card">
      <h3>Diagnostics faits</h3>
      <p>18</p>
    </div>
    <div className="overview-card">
      <h3>Plans d’action</h3>
      <p>24</p>
    </div>
  </div>
);

const Diagnostics = () => <div><h2>Diagnostics</h2><p>Liste des diagnostics réalisés.</p></div>;
const Plans = () => <div><h2>Plans d’action</h2><p>Création et gestion de plans personnalisés.</p></div>;
const Messages = () => <div><h2>Messagerie</h2><p>Vos échanges avec les clients.</p></div>;

export default Dashboard;
