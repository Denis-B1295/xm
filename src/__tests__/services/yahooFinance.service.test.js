// historicalData.test.ts
import axios from 'axios';
import { getHistoricalData } from '../../services/yahooFinance.service';
import { DataValidationError, YahooApiError } from '../../types/error';
jest.mock('axios');
const mockedAxios = axios;
describe('getHistoricalData', () => {
    const originalEnv = process.env;
    const mockData = {
        chart: {
            result: [{
                    timestamp: [1638316800, 1638403200],
                    indicators: {
                        quote: [{
                                open: [100, 101],
                                high: [102, 103],
                                low: [99, 100],
                                close: [101, 102],
                                volume: [10000, 20000]
                            }]
                    }
                }]
        }
    };
    beforeEach(() => {
        jest.resetAllMocks();
        process.env = { ...originalEnv };
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    it('should return formatted historical data on successful API call', async () => {
        process.env.YAHOO_URL = 'https://api.yahoo.com';
        process.env.RAPIDAPI_KEY = 'test-key';
        mockedAxios.get.mockResolvedValue({ data: mockData });
        const result = await getHistoricalData('AAPL', '2023-01-01', '2023-01-10');
        expect(result).toEqual([
            {
                date: '01 Dec 2021',
                open: 100,
                high: 102,
                low: 99,
                close: 101,
                volume: 10000
            },
            {
                date: '02 Dec 2021',
                open: 101,
                high: 103,
                low: 100,
                close: 102,
                volume: 20000
            }
        ]);
    });
    it('should throw DataValidationError when response structure is invalid', async () => {
        process.env.YAHOO_URL = 'https://api.yahoo.com';
        process.env.RAPIDAPI_KEY = 'test-key';
        const invalidData = { chart: { result: [{}] } };
        mockedAxios.get.mockResolvedValue({ data: invalidData });
        await expect(getHistoricalData('AAPL', '2023-01-01', '2023-01-10'))
            .rejects.toThrow(DataValidationError);
    });
    it('should handle API errors properly', async () => {
        process.env.YAHOO_URL = 'https://api.yahoo.com';
        process.env.RAPIDAPI_KEY = 'test-key';
        mockedAxios.get.mockRejectedValue(new YahooApiError('API rate limit exceeded'));
        await expect(getHistoricalData('AAPL', '2023-01-01', '2023-01-10'))
            .rejects.toThrow(YahooApiError);
    });
    it('should throw generic error for unexpected exceptions', async () => {
        process.env.YAHOO_URL = 'https://api.yahoo.com';
        process.env.RAPIDAPI_KEY = 'test-key';
        mockedAxios.get.mockRejectedValue(new Error('Network error'));
        await expect(getHistoricalData('AAPL', '2023-01-01', '2023-01-10'))
            .rejects.toThrow('Failed to fetch historical data');
    });
    it('should validate response structure before processing', async () => {
        process.env.YAHOO_URL = 'https://api.yahoo.com';
        process.env.RAPIDAPI_KEY = 'test-key';
        // Malformed response missing timestamp
        const invalidData = {
            chart: {
                result: [{
                        indicators: { quote: [{}] }
                    }]
            }
        };
        mockedAxios.get.mockResolvedValue({ data: invalidData });
        await expect(getHistoricalData('AAPL', '2023-01-01', '2023-01-10'))
            .rejects.toThrow(DataValidationError);
    });
});
