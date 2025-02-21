import { Router } from 'express';
import { handleHistoricalQuotes } from '../controllers/company.controller.js';
import {validateHistoricalDataInput} from '../services/validations.service.js';
import { getNasdacData } from '../services/nasdaq.service.js';

const COMPANY_ROUTE = 'company';

export const companyRoutes = async (router: Router) => {
    const symbolData = await getNasdacData();
    /**
   * @swagger
   * /company/historical-data:
   *   post:
   *     tags: [Company]
   *     summary: Get historical company quotes
   *     description: Retrieves historical stock data and sends email report with CSV attachment
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CompanyRequest'
   *     responses:
   *       200:
   *         description: Successfully retrieved historical data
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/HistoricalData'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             example:
   *               errors: [{ msg: "Invalid company symbol" }]
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             example:
   *               error: "Failed to process request"
   */
    return router.post(`/${COMPANY_ROUTE}/historical-data`, validateHistoricalDataInput(symbolData), handleHistoricalQuotes);
}