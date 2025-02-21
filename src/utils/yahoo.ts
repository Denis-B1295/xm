import { DataValidationError, YahooApiError } from "../types/error.js";
import { YahooChartResponse } from "../types/yahoo.js";

export const validateYahooResponseStructure = (data: YahooChartResponse): void => {
    if (!data.chart) {
      throw new YahooApiError('Invalid API response structure - missing chart property');
    }
  
    if (data.chart.error) {
      throw new YahooApiError(`API Error: ${data.chart.error.description}`);
    }
  
    if (!data.chart.result?.[0]?.timestamp) {
      throw new DataValidationError('Missing or invalid timestamp data');
    }
  
    const quote = data.chart.result[0].indicators.quote?.[0];
    if (!quote || Object.keys(quote).length !== 5) {
      throw new DataValidationError('Invalid quote data structure');
    }
  
    const expectedLength = data.chart.result[0].timestamp.length;
    const isValidLength = Object.values(quote)
      .every((arr: any) => arr.length === expectedLength);
  
    if (!isValidLength) {
      throw new DataValidationError('Mismatch between timestamp and quote data lengths');
    }
  };
  