import axios from 'axios';
import dayjs from 'dayjs';
import { HistoricalData } from '../types/yahoo.js';
import { validateYahooResponseStructure } from '../utils/yahoo.js';
import { DataValidationError, YahooApiError } from '../types/error.js';

export const getHistoricalData = async (symbol: string, startDate: string, endDate: string): Promise<HistoricalData[] | undefined> => {
    try{
        if(!process.env.YAHOO_URL || !process.env.RAPIDAPI_KEY){
            throw `Env var YAHOO_URL or RAPIDAPI_KEY are not set`;
        }
        const startPeriod = dayjs(startDate).startOf('day').valueOf() / 1000;
        const endPeriod = dayjs(endDate).startOf('day').valueOf() / 1000;
    
        const { data } = await axios.get(process.env.YAHOO_URL, {
            params: {
                interval: '1d',
                symbol,
                period1: startPeriod,
                period2: endPeriod,
                region: 'US',
                includePrePost: false,
                useYfid: true,
                includeAdjustedClose: true,
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
            },
        });
        
        validateYahooResponseStructure(data);
        
        const { timestamp: timestamps } = data.chart.result[0];
        const quotes = data.chart.result[0].indicators.quote[0];

        const result = timestamps.map((t: number, i: number) => ({
                date: dayjs(t * 1000).format("DD MMM YYYY"),
                open: quotes.open[i],
                high: quotes.high[i],
                low: quotes.low[i],
                close: quotes.close[i],
                volume: quotes.volume[i],
            })
        );
        return result;
    } catch (error) {
        if (error instanceof YahooApiError || error instanceof DataValidationError) {
            console.error(`Historical data error: ${error.message}`);
            throw error;
          }
          
          console.error('Unexpected error fetching historical data:', error);
          throw new Error('Failed to fetch historical data');
    }
};