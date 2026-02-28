
export interface FocusFactor {
  date: string;
  score: number;
  sleepHours: number;
  calendarDensity: number; // 0 to 1, where 1 is fully booked
  weatherScore: number; // 0 to 1, where 1 is perfect focus weather (e.g. cool, overcast)
}

export class PredictionEngine {
  // Default weights for initial prediction
  private weights = {
    sleep: 10, // +10 points per hour of sleep (centered around 7)
    density: -20, // -20 points if fully booked
    weather: 5, // +5 points for perfect weather
    base: 30
  };

  /**
   * Predicts focus score for given factors
   */
  predict(sleep: number, density: number, weather: number): number {
    // Simple linear model: Score = base + (sleep-7)*w_sleep + density*w_density + weather*w_weather
    let score = this.weights.base + 
                (sleep - 7) * this.weights.sleep + 
                density * this.weights.density + 
                weather * this.weights.weather;
    
    // Clamp between 0 and 100
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * Simulates training on historical data
   * In a real app, this would use least squares or a similar method
   */
  train(history: FocusFactor[]) {
    if (history.length < 5) return; // Need some data to "train"

    // For this MVP, we'll just slightly adjust weights based on averages
    // Real linear regression would be implemented here
    console.log("Training prediction engine on", history.length, "days of data...");
  }

  /**
   * Generates mock history for demonstration
   */
  generateMockHistory(days: number = 30): FocusFactor[] {
    const history: FocusFactor[] = [];
    const now = new Date();

    for (let i = days; i > 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const sleep = 6 + Math.random() * 3; // 6-9 hours
      const density = Math.random();
      const weather = Math.random();
      
      // Generate a "real" score with some noise
      const baseScore = this.predict(sleep, density, weather);
      const noise = (Math.random() - 0.5) * 10;
      const score = Math.min(100, Math.max(0, Math.round(baseScore + noise)));

      history.push({
        date: date.toISOString().split('T')[0],
        score,
        sleepHours: sleep,
        calendarDensity: density,
        weatherScore: weather
      });
    }

    return history;
  }
}

export const predictionEngine = new PredictionEngine();
