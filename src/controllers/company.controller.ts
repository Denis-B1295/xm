
import { Request, Response } from "express";
import { getHistoricalData } from "../services/yahooFinance.service.js";
import { generateCSV } from "../services/csv.service.js";
import { getCompanyName } from "../utils/company.js";
import { getNasdacData } from "../services/nasdaq.service.js";

export const handleHistoricalQuotes = async (req: Request, res: Response) => {
  const { symbol, startDate, endDate, email } = req.body;

  try {
    const data = await getHistoricalData(symbol, startDate, endDate);
    if(!data){
      throw ("No historical data was returned from Yahoo, please contact administrators...")
    }
    const nasdaqData = await getNasdacData();
    const companyName = getCompanyName(symbol, nasdaqData) || 'Unknown Company';

    const csv = generateCSV(data);

    // await sendEmail(email, companyName, `From ${startDate} to ${endDate}`, csv);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to process request: ${error}` });
  }
}