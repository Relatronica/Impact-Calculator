import React from 'react';
import '../styles/ActionDrawer.css';

const ActionDrawer = ({ actionsData, onActionSelect, selectedActions, onDragStart }) => {
  const handleActionClick = (action, index) => {
    const actionWithId = { ...action, id: `action-${index}-${Date.now()}` };
    onActionSelect(actionWithId);
  };

  const handleDragStart = (e, action, index) => {
    const actionWithId = { ...action, id: `action-${index}-${Date.now()}` };
    e.dataTransfer.setData('text/plain', JSON.stringify(actionWithId));
    e.dataTransfer.effectAllowed = 'copy';
    if (onDragStart) {
      onDragStart(actionWithId);
    }
  };

  const getMetricIcons = (metriche) => {
    const icons = [];
    metriche.forEach(metrica => {
      if (metrica.toLowerCase().includes('co2')) {
        icons.push('🌱');
      } else if (metrica.toLowerCase().includes('acqua') || metrica.toLowerCase().includes('litri')) {
        icons.push('💧');
      } else if (metrica.toLowerCase().includes('energia') || metrica.toLowerCase().includes('kwh')) {
        icons.push('⚡');
      }
    });
    return icons.join(' ');
  };

  return (
<div className="action-drawer">
  <div className="drawer-header">
    <h1>Impact Lab</h1>
    <p className="version-credit">Beta v2.1 · Designed by Relatronica</p>
    <p className="description">
      Costruisci la <strong>giornata-tipo</strong> della tua vita trascinando nella griglia le azioni che compi ogni giorno: fare colazione, prendere i mezzi, lavorare da casa o ordinare online. Ogni scelta ha un impatto, e qui lo vedi prendere forma: <em>CO₂e, acqua, energia</em>.
    </p>
    <p className="description provocative">
      Forse scoprirai che <strong>l’ascensore</strong> pesa più della tua call su Zoom. Forse no. L’unico modo per saperlo è <em>giocare</em> con le tue abitudini. Sei pronto a metterti in discussione?
    </p>
    <ol className="instructions">
      <li>Trascina un'azione dalla lista qui sotto.</li>
      <li>Rilasciala sulla griglia temporale della tua giornata.</li>
      <li>Guarda l'impatto aggiornarsi in tempo reale.</li>
      <li>Modifica, sperimenta, trova alternative più sostenibili.</li>
    </ol>
  </div>

  <div className="actions-list">
    {actionsData.map((action, index) => (
      <div 
        key={index}
        className="action-item"
        draggable={true}
        onClick={() => handleActionClick(action, index)}
        onDragStart={(e) => handleDragStart(e, action, index)}
      >
        <div className="action-content">
          <div className="action-title">
            {action.azione}
          </div>
          <div className="action-metrics">
            <span className="metric-icons">
              {getMetricIcons(action.metriche)}
            </span>
            <span className="metric-text">
              {action.metriche.join(', ')}
            </span>
          </div>
          <div className="action-example">
            {action.esempio_divulgativo}
          </div>
        </div>
        <div className="action-add-btn">
          +
        </div>
      </div>
    ))}
  </div>


      
      {selectedActions.length > 0 && (
        <div className="selected-counter">
          {selectedActions.length} action{selectedActions.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default ActionDrawer;