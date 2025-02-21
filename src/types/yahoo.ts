export interface YahooChartResponse {
    chart: {
        result: {
            meta: any;
            timestamp: number[];
            indicators: {
            quote: Array<{
                open: number[];
                high: number[];
                low: number[];
                close: number[];
                volume: number[];
            }>;
            };
        }[];
        error?: {
            code: string;
            description: string;
        };
    };
}
  
export interface HistoricalData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
  