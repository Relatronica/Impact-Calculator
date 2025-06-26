import React from 'react';
import '../styles/MetricsPanel.css';
import {
  calculateTotalMetrics,
  calculateCO2Equivalents,
  calculateWaterEquivalents,
  calculateEnergyEquivalents,
  getImpactLevel,
  formatNumber,
  validateMetricData,
  extractMetricValue
} from '../utils/calculations';

const MetricsPanel = ({ placedActions }) => {
  // Validate placed actions data
  const validatedActions = placedActions.filter(action => {
    const validation = validateMetricData(action);
    if (!validation.isValid) {
      console.warn('Invalid action data:', validation.errors, action);
    }
    return validation.isValid;
  });

  // Calculate totals using enhanced utilities
  const totals = calculateTotalMetrics(validatedActions);
  
  // Calculate educational equivalents
  const co2Equivalents = calculateCO2Equivalents(totals.co2);
  const waterEquivalents = calculateWaterEquivalents(totals.water);
  const energyEquivalents = calculateEnergyEquivalents(totals.energy);

  return (
    <div className="metrics-panel">
       <div className="panel-header">
        <h2>Environmental Impact</h2>
        <p>Real-time calculations based on your actions</p>
      </div> 

      <div className="metrics-summary">
        <div className={`metric-card co2 ${getImpactLevel(totals.co2, 'co2')}`}>
          <div className="metric-icon">🌱</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(totals.co2)}</div>
            <div className="metric-unit">kg CO₂e</div>
            <div className="metric-label">Impronta di Carbonio</div>
            {co2Equivalents && (
              <div className="metric-examples">
                <div className="example-item">{co2Equivalents.examples.it.car}</div>
                <div className="example-item">{co2Equivalents.examples.it.trees}</div>
                <div className={`impact-indicator ${getImpactLevel(totals.co2, 'co2')}`}>
                  {co2Equivalents.examples.it.comparison}
                </div>
              </div>
            )}
          </div>
          <div className="metric-progress">
            <div className={`progress-bar co2 ${getImpactLevel(totals.co2, 'co2')}`} 
                 style={{width: `${Math.min(100, (totals.co2 / 20) * 100)}%`}}></div>
          </div>
        </div>

        <div className={`metric-card water ${getImpactLevel(totals.water, 'water')}`}>
          <div className="metric-icon">💧</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(totals.water)}</div>
            <div className="metric-unit">Litri</div>
            <div className="metric-label">Consumo d'Acqua</div>
            {waterEquivalents && (
              <div className="metric-examples">
                <div className="example-item">{waterEquivalents.examples.it.bottles}</div>
                <div className="example-item">{waterEquivalents.examples.it.shower}</div>
                <div className={`impact-indicator ${getImpactLevel(totals.water, 'water')}`}>
                  {waterEquivalents.examples.it.comparison}
                </div>
              </div>
            )}
          </div>
          <div className="metric-progress">
            <div className={`progress-bar water ${getImpactLevel(totals.water, 'water')}`} 
                 style={{width: `${Math.min(100, (totals.water / 5000) * 100)}%`}}></div>
          </div>
        </div>

        <div className={`metric-card energy ${getImpactLevel(totals.energy, 'energy')}`}>
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(totals.energy)}</div>
            <div className="metric-unit">kWh</div>
            <div className="metric-label">Consumo Energetico</div>
            {energyEquivalents && (
              <div className="metric-examples">
                <div className="example-item">{energyEquivalents.examples.it.ledBulb}</div>
                <div className="example-item">{energyEquivalents.examples.it.smartphone}</div>
                <div className="example-item">{energyEquivalents.examples.it.co2}</div>
                <div className={`impact-indicator ${getImpactLevel(totals.energy, 'energy')}`}>
                  {energyEquivalents.examples.it.comparison}
                </div>
              </div>
            )}
          </div>
          <div className="metric-progress">
            <div className={`progress-bar energy ${getImpactLevel(totals.energy, 'energy')}`} 
                 style={{width: `${Math.min(100, (totals.energy / 15) * 100)}%`}}></div>
          </div>
        </div>
      </div>

      <div className="actions-breakdown">
        <h3>Dettaglio Azioni</h3>
        {validatedActions.length === 0 ? (
          <p className="no-actions">Nessuna azione inserita. Aggiungi azioni per vedere il loro impatto ambientale.</p>
        ) : (
          <>
            <div className="breakdown-summary">
              <div className="summary-stats">
                <span className="stat-item">
                  <strong>{validatedActions.length}</strong> azioni totali
                </span>
                <span className="stat-item">
                  <strong>{Object.keys(totals.actionCounts).length}</strong> tipi diversi
                </span>
              </div>
            </div>
            
            <div className="breakdown-list">
              {Object.entries(totals.actionCounts).map(([actionName, count]) => {
                const sampleAction = validatedActions.find(a => a.azione === actionName);
                const actionCO2 = calculateCO2Equivalents(extractMetricValue(sampleAction, 'co2') * count);
                const actionWater = calculateWaterEquivalents(extractMetricValue(sampleAction, 'water') * count);
                const actionEnergy = calculateEnergyEquivalents(extractMetricValue(sampleAction, 'energy') * count);
                
                return (
                  <div key={actionName} className="breakdown-item">
                    <div className="breakdown-header">
                      <div className="breakdown-action">
                        {actionName}
                        {count > 1 && <span className="action-count">×{count}</span>}
                      </div>
                      <div className="breakdown-impact">
                        {sampleAction.metriche.map((metrica, idx) => (
                          <span key={idx} className={`breakdown-metric ${metrica.toLowerCase().includes('co2') ? 'co2' : 
                            metrica.toLowerCase().includes('acqua') || metrica.toLowerCase().includes('litri') ? 'water' : 
                            metrica.toLowerCase().includes('energia') ? 'energy' : ''}`}>
                            {metrica}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="breakdown-details">
                      <div className="breakdown-examples">
                        {actionCO2 && (
                          <div className="example-line co2">
                            <span className="example-icon">🌱</span>
                            <span className="example-text">{actionCO2.examples.it.car}</span>
                          </div>
                        )}
                        {actionWater && (
                          <div className="example-line water">
                            <span className="example-icon">💧</span>
                            <span className="example-text">{actionWater.examples.it.bottles}</span>
                          </div>
                        )}
                        {actionEnergy && (
                          <div className="example-line energy">
                            <span className="example-icon">⚡</span>
                            <span className="example-text">{actionEnergy.examples.it.ledBulb}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="breakdown-positions">
                        {validatedActions
                          .filter(a => a.azione === actionName)
                          .map((action, idx) => (
                            <span key={idx} className="position-tag">
                              {action.position.day} {action.position.hour}:00
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="panel-footer">
        <div className="total-actions">
          Azioni selezionate: {placedActions.length}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;