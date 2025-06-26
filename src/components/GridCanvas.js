import React, { useState } from 'react';
import '../styles/GridCanvas.css';

const GridCanvas = ({ placedActions, onActionPlace, onActionRemove, draggedAction }) => {
  const [localDraggedAction, setLocalDraggedAction] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [gridDimensions, setGridDimensions] = useState({ rows: 7, cols: 24 });
  const [actionHistory, setActionHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Create dynamic grid based on dimensions
  const days = gridDimensions.rows === 7 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : Array.from({ length: gridDimensions.rows }, (_, i) => `Day ${i + 1}`);
  const hours = Array.from({ length: gridDimensions.cols }, (_, i) => i);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e, day, hour) => {
    e.preventDefault();
    setHoveredCell({ day, hour });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear hover if we're leaving the cell entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setHoveredCell(null);
    }
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    setHoveredCell(null);
    
    // Check for collision - prevent placing action if cell is occupied
    const existingAction = getActionAtPosition(day, hour);
    if (existingAction) {
      return; // Don't place if cell is occupied
    }

    try {
      const actionData = e.dataTransfer.getData('text/plain');
      if (actionData) {
        const action = JSON.parse(actionData);
        const position = { day, hour };
        
        // Save state for undo functionality
        setActionHistory(prev => [...prev.slice(0, historyIndex + 1), [...placedActions]]);
        setHistoryIndex(prev => prev + 1);
        
        onActionPlace(action, position);
      }
    } catch (error) {
      console.error('Error parsing dropped action:', error);
    }
    
    setLocalDraggedAction(null);
  };

  const handleCellClick = (day, hour) => {
    // Find if there's an action at this position
    const actionAtPosition = placedActions.find(
      action => action.position.day === day && action.position.hour === hour
    );
    
    if (actionAtPosition) {
      // Save state for undo functionality
      setActionHistory(prev => [...prev.slice(0, historyIndex + 1), [...placedActions]]);
      setHistoryIndex(prev => prev + 1);
      
      onActionRemove(actionAtPosition.id);
    }
  };

  const handleRightClick = (e, day, hour) => {
    e.preventDefault();
    const actionAtPosition = placedActions.find(
      action => action.position.day === day && action.position.hour === hour
    );
    
    if (actionAtPosition) {
      // Save state for undo functionality
      setActionHistory(prev => [...prev.slice(0, historyIndex + 1), [...placedActions]]);
      setHistoryIndex(prev => prev + 1);
      
      onActionRemove(actionAtPosition.id);
    }
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const previousState = actionHistory[historyIndex];
      // Update placed actions through parent component
      previousState.forEach(action => {
        if (!placedActions.find(a => a.id === action.id)) {
          onActionPlace(action, action.position);
        }
      });
      placedActions.forEach(action => {
        if (!previousState.find(a => a.id === action.id)) {
          onActionRemove(action.id);
        }
      });
      setHistoryIndex(prev => prev - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < actionHistory.length - 1) {
      setHistoryIndex(prev => prev + 1);
      const nextState = actionHistory[historyIndex + 1];
      // Similar logic for redo
    }
  };

  const handleClearGrid = () => {
    if (placedActions.length > 0) {
      setActionHistory(prev => [...prev.slice(0, historyIndex + 1), [...placedActions]]);
      setHistoryIndex(prev => prev + 1);
      
      placedActions.forEach(action => onActionRemove(action.id));
    }
  };

  const handleGridResize = (newRows, newCols) => {
    setGridDimensions({ rows: newRows, cols: newCols });
  };

  const getActionAtPosition = (day, hour) => {
    return placedActions.find(
      action => action.position.day === day && action.position.hour === hour
    );
  };

  const getActionIcon = (action) => {
    const metriche = action.metriche;
    if (metriche.some(m => m.toLowerCase().includes('co2'))) {
      return '🌱';
    } else if (metriche.some(m => m.toLowerCase().includes('acqua') || m.toLowerCase().includes('litri'))) {
      return '💧';
    } else if (metriche.some(m => m.toLowerCase().includes('energia') || m.toLowerCase().includes('kwh'))) {
      return '⚡';
    }
    return '📋';
  };

  return (
    <div className="grid-canvas">
      <div className="canvas-header">
        <div className="header-content">
          <div className="title-section">
            <h2>Ogni scelta conta</h2>
            <p> Compila la tua giornata come faresti con una normale agenda, ma con un tocco in più: ogni attività ti mostra l’impatto ambientale che comporta. Scopri come piccoli cambiamenti possono fare una grande differenza.</p>
          </div>
          
          <div className="grid-controls">
            <div className="dimension-controls">
              <label>
                Rows: 
                <input 
                  type="number" 
                  min="3" 
                  max="12" 
                  value={gridDimensions.rows}
                  onChange={(e) => handleGridResize(parseInt(e.target.value), gridDimensions.cols)}
                />
              </label>
              <label>
                Cols: 
                <input 
                  type="number" 
                  min="12" 
                  max="48" 
                  value={gridDimensions.cols}
                  onChange={(e) => handleGridResize(gridDimensions.rows, parseInt(e.target.value))}
                />
              </label>
            </div>
            
            <div className="action-controls">
              <button 
                onClick={handleUndo} 
                disabled={historyIndex < 0}
                title="Undo last action"
              >
                ↶ Annulla
              </button>
              <button 
                onClick={handleRedo} 
                disabled={historyIndex >= actionHistory.length - 1}
                title="Redo last action"
              >
                ↷ Ripeti
              </button>
              <button 
                onClick={handleClearGrid}
                disabled={placedActions.length === 0}
                title="Clear all actions"
                className="clear-btn"
              >
                🗑 Cancella tutto
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid-container">
        <div className="time-labels">
          <div className="corner-cell"></div>
          {hours.map(hour => (
            <div key={hour} className="time-label">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>
        
        {days.map(day => (
          <div key={day} className="grid-row">
            <div className="day-label">{day}</div>
            {hours.map(hour => {
              const actionAtPosition = getActionAtPosition(day, hour);
              const isHovered = hoveredCell?.day === day && hoveredCell?.hour === hour;
              
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`grid-cell ${actionAtPosition ? 'has-action' : ''} ${isHovered ? 'hovered' : ''} ${actionAtPosition ? '' : 'drop-zone'}`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, day, hour)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day, hour)}
                  onClick={() => handleCellClick(day, hour)}
                  onContextMenu={(e) => handleRightClick(e, day, hour)}
                  onMouseEnter={() => setHoveredCell({ day, hour })}
                  onMouseLeave={() => setHoveredCell(null)}
                  title={actionAtPosition ? `${actionAtPosition.azione} - Left/Right click to remove` : 'Drop action here'}
                >
                  {actionAtPosition && (
                    <div 
                      className="action-in-cell"
                      title={`${actionAtPosition.azione}\n${actionAtPosition.esempio_divulgativo}\nMetrics: ${actionAtPosition.metriche.join(', ')}\nRight-click or click to remove`}
                    >
                      <div className="action-icon">
                        {getActionIcon(actionAtPosition)}
                      </div>
                      <div className="action-name">
                        {actionAtPosition.azione.substring(0, 15)}
                        {actionAtPosition.azione.length > 15 ? '...' : ''}
                      </div>
                      <div className="action-metrics-preview">
                        {actionAtPosition.metriche.slice(0, 2).map((metric, idx) => (
                          <span key={idx} className="metric-tag">
                            {metric.includes('CO2') ? '🌱' : metric.includes('acqua') || metric.includes('Litri') ? '💧' : '⚡'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="canvas-footer">
        <div className="grid-stats">
          <div className="stat-group">
            <span className="stat-label">Azioni Inserite:</span>
            <span className="stat-value">{placedActions.length}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Griglia:</span>
            <span className="stat-value">{gridDimensions.rows} × {gridDimensions.cols}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Percentuale slot utilizzati:</span>
            <span className="stat-value">
              {((placedActions.length / (days.length * hours.length)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="stat-group">
            <span className="stat-label">Celle disponibili:</span>
            <span className="stat-value">{(days.length * hours.length) - placedActions.length}</span>
          </div>
        </div>
        
        <div className="grid-legend">
          <div className="legend-item">
            <span className="legend-icon">🌱</span>
            <span>Impatto CO2</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">💧</span>
            <span>Consumo di acqua</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⚡</span>
            <span>Consumo di Energia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridCanvas;