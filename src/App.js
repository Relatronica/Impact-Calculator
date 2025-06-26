import React from 'react';
import './styles/App.css';
import Layout from './components/Layout';
import actionsData from './data/azioni_impatto_ambientale.json';

function App() {
  return (
    <div className="App">
      <Layout actionsData={actionsData} />
    </div>
  );
}

export default App;