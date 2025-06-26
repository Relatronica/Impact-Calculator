// Environmental Impact Calculation Utilities
// Based on verified 2024 data sources

// Conversion factors based on real 2024 data
const CONVERSION_FACTORS = {
  // Car emissions: EU average 2024 = 185.4g CO2/km
  CAR_CO2_PER_KM: 0.1854, // kg CO2 per km
  
  // LED bulb: average 10 watts
  LED_BULB_WATTS: 10,
  
  // Smartphone charging: ~19 Wh per full charge
  SMARTPHONE_CHARGE_WH: 19,
  
  // Standard water bottle: 500ml
  WATER_BOTTLE_LITERS: 0.5,
  
  // Tree CO2 sequestration: approximately 21.8 kg CO2 per year per tree
  TREE_CO2_SEQUESTRATION_PER_YEAR: 21.8,
  
  // Shower water usage: approximately 10 liters per minute
  SHOWER_LITERS_PER_MINUTE: 10,
  
  // Energy to CO2 conversion (EU grid average): ~0.3 kg CO2 per kWh
  ENERGY_TO_CO2_KG_PER_KWH: 0.3
};

/**
 * Extract numeric values from Italian descriptive text
 * Enhanced version with better pattern matching
 */
export const extractMetricValue = (action, metricType) => {
  const esempio = action.esempio_divulgativo.toLowerCase();
  
  if (metricType === 'co2') {
    // Look for CO2 values in kg
    const kgMatch = esempio.match(/(\d+(?:[.,]\d+)?)\s*kg.*co2/);
    if (kgMatch) {
      return parseFloat(kgMatch[1].replace(',', '.'));
    }
    
    // Look for CO2 values in grams
    const gMatch = esempio.match(/(\d+(?:[.,]\d+)?)\s*g.*co2/);
    if (gMatch) {
      return parseFloat(gMatch[1].replace(',', '.')) / 1000; // Convert g to kg
    }
    
    // Handle ranges (take average)
    const rangeKgMatch = esempio.match(/(\d+(?:[.,]\d+)?)[-–](\d+(?:[.,]\d+)?)\s*kg.*co2/);
    if (rangeKgMatch) {
      const val1 = parseFloat(rangeKgMatch[1].replace(',', '.'));
      const val2 = parseFloat(rangeKgMatch[2].replace(',', '.'));
      return (val1 + val2) / 2;
    }
    
    // Handle decimal ranges
    const decimalRangeMatch = esempio.match(/(\d+[.,]\d+)[-–](\d+[.,]\d+)\s*kg.*co2/);
    if (decimalRangeMatch) {
      const val1 = parseFloat(decimalRangeMatch[1].replace(',', '.'));
      const val2 = parseFloat(decimalRangeMatch[2].replace(',', '.'));
      return (val1 + val2) / 2;
    }
  }
  
  if (metricType === 'water') {
    // Look for water values in liters with thousand separators
    const literMatch = esempio.match(/(\d+(?:[.,]\d{3})*)\s*l/);
    if (literMatch) {
      const value = literMatch[1].replace(/[.,](?=\d{3})/g, ''); // Remove thousand separators
      return parseFloat(value.replace(',', '.'));
    }
    
    // Handle ranges
    const rangeMatch = esempio.match(/(\d+(?:[.,]\d{3})*)[-–](\d+(?:[.,]\d{3})*)\s*l/);
    if (rangeMatch) {
      const val1 = parseFloat(rangeMatch[1].replace(/[.,](?=\d{3})/g, '').replace(',', '.'));
      const val2 = parseFloat(rangeMatch[2].replace(/[.,](?=\d{3})/g, '').replace(',', '.'));
      return (val1 + val2) / 2;
    }
    
    // Handle "oltre" (over) values
    const oltreMatch = esempio.match(/oltre\s+(\d+(?:[.,]\d{3})*)\s*l/);
    if (oltreMatch) {
      const value = oltreMatch[1].replace(/[.,](?=\d{3})/g, '');
      return parseFloat(value.replace(',', '.'));
    }
  }
  
  if (metricType === 'energy') {
    // Look for energy values in kWh
    const kwhMatch = esempio.match(/(\d+(?:[.,]\d+)?)[-–]?(\d+(?:[.,]\d+)?)?\s*kwh/);
    if (kwhMatch) {
      const val1 = parseFloat(kwhMatch[1].replace(',', '.'));
      if (kwhMatch[2]) {
        const val2 = parseFloat(kwhMatch[2].replace(',', '.'));
        return (val1 + val2) / 2;
      }
      return val1;
    }
  }
  
  return 0;
};

/**
 * Calculate CO2 equivalencies with educational examples
 */
export const calculateCO2Equivalents = (co2Kg) => {
  if (co2Kg <= 0) return null;
  
  const carKm = co2Kg / CONVERSION_FACTORS.CAR_CO2_PER_KM;
  const treesNeeded = co2Kg / CONVERSION_FACTORS.TREE_CO2_SEQUESTRATION_PER_YEAR;
  
  return {
    carKm: Math.round(carKm * 10) / 10,
    treesNeeded: Math.round(treesNeeded * 100) / 100,
    examples: {
      it: {
        car: `Equivale a ${Math.round(carKm)} km percorsi in auto`,
        trees: `${Math.ceil(treesNeeded)} alberi necessari per compensare (1 anno)`,
        comparison: co2Kg > 10 ? 'Impatto elevato' : co2Kg > 2 ? 'Impatto moderato' : 'Impatto basso'
      }
    }
  };
};

/**
 * Calculate water usage equivalencies with educational examples
 */
export const calculateWaterEquivalents = (waterLiters) => {
  if (waterLiters <= 0) return null;
  
  const waterBottles = waterLiters / CONVERSION_FACTORS.WATER_BOTTLE_LITERS;
  const showerMinutes = waterLiters / CONVERSION_FACTORS.SHOWER_LITERS_PER_MINUTE;
  
  return {
    waterBottles: Math.round(waterBottles),
    showerMinutes: Math.round(showerMinutes * 10) / 10,
    examples: {
      it: {
        bottles: `Equivale a ${Math.round(waterBottles)} bottiglie d'acqua`,
        shower: `Equivale a ${Math.round(showerMinutes)} minuti di doccia`,
        comparison: waterLiters > 1000 ? 'Consumo elevato' : waterLiters > 100 ? 'Consumo moderato' : 'Consumo basso'
      }
    }
  };
};

/**
 * Calculate energy equivalencies with educational examples
 */
export const calculateEnergyEquivalents = (energyKwh) => {
  if (energyKwh <= 0) return null;
  
  const ledBulbHours = (energyKwh * 1000) / CONVERSION_FACTORS.LED_BULB_WATTS;
  const smartphoneCharges = (energyKwh * 1000) / CONVERSION_FACTORS.SMARTPHONE_CHARGE_WH;
  const co2Equivalent = energyKwh * CONVERSION_FACTORS.ENERGY_TO_CO2_KG_PER_KWH;
  
  return {
    ledBulbHours: Math.round(ledBulbHours),
    smartphoneCharges: Math.round(smartphoneCharges),
    co2Equivalent: Math.round(co2Equivalent * 1000) / 1000,
    examples: {
      it: {
        ledBulb: `Equivale a ${Math.round(ledBulbHours)} ore di lampadina LED`,
        smartphone: `Equivale a ${Math.round(smartphoneCharges)} ricariche di smartphone`,
        co2: `Produce ${Math.round(co2Equivalent * 1000)} g di CO2`,
        comparison: energyKwh > 5 ? 'Consumo elevato' : energyKwh > 1 ? 'Consumo moderato' : 'Consumo basso'
      }
    }
  };
};

/**
 * Calculate aggregated metrics for multiple actions
 */
export const calculateTotalMetrics = (placedActions) => {
  const totals = {
    co2: 0,
    water: 0,
    energy: 0,
    actionCounts: {}
  };

  placedActions.forEach(action => {
    // Count action instances
    const actionName = action.azione;
    totals.actionCounts[actionName] = (totals.actionCounts[actionName] || 0) + 1;
    
    const metriche = action.metriche;
    
    // CO2 calculations
    if (metriche.some(m => m.toLowerCase().includes('co2'))) {
      totals.co2 += extractMetricValue(action, 'co2');
    }
    
    // Water calculations
    if (metriche.some(m => m.toLowerCase().includes('acqua') || m.toLowerCase().includes('litri'))) {
      totals.water += extractMetricValue(action, 'water');
    }
    
    // Energy calculations
    if (metriche.some(m => m.toLowerCase().includes('energia') || m.toLowerCase().includes('kwh'))) {
      totals.energy += extractMetricValue(action, 'energy');
    }
  });

  return totals;
};

/**
 * Get impact level classification
 */
export const getImpactLevel = (value, type) => {
  if (type === 'co2') {
    if (value < 2) return 'low';
    if (value < 10) return 'medium';
    return 'high';
  }
  if (type === 'water') {
    if (value < 500) return 'low';
    if (value < 2000) return 'medium';
    return 'high';
  }
  if (type === 'energy') {
    if (value < 1) return 'low';
    if (value < 5) return 'medium';
    return 'high';
  }
  return 'low';
};

/**
 * Format numbers for display
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  if (num < 1) {
    return num.toFixed(3);
  }
  return num.toFixed(2);
};

/**
 * Validate metric data integrity
 */
export const validateMetricData = (action) => {
  const errors = [];
  
  if (!action.azione) {
    errors.push('Missing action name');
  }
  
  if (!action.metriche || !Array.isArray(action.metriche)) {
    errors.push('Missing or invalid metrics array');
  }
  
  if (!action.esempio_divulgativo) {
    errors.push('Missing educational example');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};