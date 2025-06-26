import React, { useState } from 'react';
import ActionDrawer from './ActionDrawer';
import GridCanvas from './GridCanvas';
import MetricsPanel from './MetricsPanel';
import '../styles/Layout.css';

const Layout = ({ actionsData }) => {
  const [selectedActions, setSelectedActions] = useState([]);
  const [placedActions, setPlacedActions] = useState([]);
  const [draggedAction, setDraggedAction] = useState(null);

  const handleActionSelect = (action) => {
    setSelectedActions(prev => [...prev, action]);
  };

  const handleActionPlace = (action, position) => {
    // Check for existing action at position to prevent duplicates
    const existingAction = placedActions.find(
      a => a.position.day === position.day && a.position.hour === position.hour
    );
    
    if (!existingAction) {
      setPlacedActions(prev => [...prev, { ...action, position }]);
    }
  };

  const handleActionRemove = (actionId) => {
    setPlacedActions(prev => prev.filter(action => action.id !== actionId));
  };

  const handleDragStart = (action) => {
    setDraggedAction(action);
  };

  return (
    <div className="layout-container">
      <ActionDrawer 
        actionsData={actionsData}
        onActionSelect={handleActionSelect}
        selectedActions={selectedActions}
        onDragStart={handleDragStart}
      />
      <GridCanvas 
        placedActions={placedActions}
        onActionPlace={handleActionPlace}
        onActionRemove={handleActionRemove}
        draggedAction={draggedAction}
      />
      <MetricsPanel 
        placedActions={placedActions}
      />
    </div>
  );
};

export default Layout;