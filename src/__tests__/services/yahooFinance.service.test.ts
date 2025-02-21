import axios from 'axios';
import dayjs from 'dayjs';
import { getHistoricalData } from '../../services/yahooFinance.service.js';
import { DataValidationError } from '../../types/error.js';
import { CompanySymbol } from '../../types/nasdaq.js';


jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('getHistoricalData', () => {
  const validDate = '2023-01-01';
  const invalidDate = 'invalid-date';
  const OLD_ENV = process.env;
  const TEST_DATES = {
    start: '2023-01-01',
    end: '2023-01-10',
    startTimestamp: 1672531200, // 2023-01-01 00:00:00 UTC
    endTimestamp: 1673308800    // 2023-01-10 00:00:00 UTC
  };
  const nasdacData: CompanySymbol[] = [
    {
      Symbol: 'AAPL',
      'Company Name': 'AAPL company'
    }
  ];
  

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { 
      ...OLD_ENV,
      YAHOO_URL: 'https://api.yahoo.com/v3/get-chart',
      RAPIDAPI_KEY: 'test-api-key'
    };

    // Mock successful API response
    mockAxios.get.mockResolvedValue({
      data: {
        chart: {
          result: [{
            timestamp: [TEST_DATES.startTimestamp, TEST_DATES.endTimestamp],
            indicators: {
              quote: [{
                open: [100, 101],
                high: [102, 103],
                low: [99, 100],
                close: [101, 102],
                volume: [100000, 200000]
              }]
            }
          }]
        }
      }
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('Successful Scenarios', () => {
    it('should return formatted historical data', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          chart: {
            result: [{
              timestamp: [1672531200],
              indicators: {
                quote: [{
                  open: [100],
                  high: [102],
                  low: [99],
                  close: [101],
                  volume: [100000]
                }]
              }
            }]
          }
        }
      });

      const result = await getHistoricalData('AAPL', nasdacData, validDate, validDate);
      
      expect(result).toEqual([{
        date: '01 Jan 2023',
        open: 100,
        high: 102,
        low: 99,
        close: 101,
        volume: 100000
      }]);
    });

    it('should return properly formatted historical data', async () => {
      const result = await getHistoricalData('AAPL', nasdacData, TEST_DATES.start, TEST_DATES.end);
      
      expect(result).toEqual([
        {
          date: dayjs(TEST_DATES.startTimestamp * 1000).format('DD MMM YYYY'),
          open: 100,
          high: 102,
          low: 99,
          close: 101,
          volume: 100000
        },
        {
          date: dayjs(TEST_DATES.endTimestamp * 1000).format('DD MMM YYYY'),
          open: 101,
          high: 103,
          low: 100,
          close: 102,
          volume: 200000
        }
      ]);
    });

    it('should handle empty data response', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          chart: {
            result: []
          }
        }
      });

      await expect(getHistoricalData('AAPL', nasdacData, validDate, validDate))
        .rejects.toThrow(DataValidationError);
    });
  });

  describe('Error Handling', () => {
    it('should throw for invalid symbol', async () => {
      await expect(getHistoricalData('INVALID_SYMBOL', nasdacData, validDate, validDate))
        .rejects.toThrow('Invalid company symbol');
    });

    it('should throw for invalid start date', async () => {
      await expect(getHistoricalData('AAPL', nasdacData, invalidDate, validDate))
        .rejects.toThrow('Please check startDate and endPeriod');
    });

    it('should handle API rate limiting', async () => {
      mockAxios.get.mockRejectedValue({
        response: {
          status: 429,
          data: { message: 'Rate limit exceeded' }
        }
      });

      await expect(getHistoricalData('AAPL', nasdacData, validDate, validDate))
        .rejects.toThrow('Failed to fetch historical data');
    });

    it('should handle network errors', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getHistoricalData('AAPL', nasdacData, validDate, validDate))
        .rejects.toThrow('Failed to fetch historical data');
    });

    it('should handle partial data response', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          chart: {
            result: [{
              timestamp: [1672531200],
              indicators: {
                quote: [{
                  open: [100],
                  high: [102],
                  low: [99],
                  // Missing close and volume
                }]
              }
            }]
          }
        }
      });

      await expect(getHistoricalData('AAPL', nasdacData, validDate, validDate))
        .rejects.toThrow(DataValidationError);
    });
  });


  describe('Data Transformation', () => {
    it('should handle multiple data points', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          chart: {
            result: [{
              timestamp: [1672531200, 1672617600],
              indicators: {
                quote: [{
                  open: [100, 101],
                  high: [102, 103],
                  low: [99, 100],
                  close: [101, 102],
                  volume: [100000, 200000]
                }]
              }
            }]
          }
        }
      });

      const result = await getHistoricalData('AAPL', nasdacData, validDate, validDate);
      expect(result).toHaveLength(2);
      expect(result?.[1]).toEqual({
        date: '02 Jan 2023',
        open: 101,
        high: 103,
        low: 100,
        close: 102,
        volume: 200000
      });
    });

    // it('should filter out invalid data points', async () => {
    //   mockAxios.get.mockResolvedValue({
    //     data: {
    //       chart: {
    //         result: [{
    //           timestamp: [1672531200, null],
    //           indicators: {
    //             quote: [{
    //               open: [100, undefined],
    //               high: [102, null],
    //               low: [99, 100],
    //               close: [101, 102],
    //               volume: [100000, 200000]
    //             }]
    //           }
    //         }]
    //       }
    //     }
    //   });

    //   const result = await getHistoricalData('AAPL', nasdacData, validDate, validDate);
    //   expect(result).toHaveLength(1);
    // });
  });

});