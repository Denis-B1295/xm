import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from "express";
import dayjs from 'dayjs';
import { isValidSymbol } from '../utils/company.js';
import { CompanySymbol } from '../types/nasdaq.js';

export const validateHistoricalDataInput = (symbols: CompanySymbol[]): any[] => { 
  return [
    body('symbol')
      .trim()
      .notEmpty().withMessage('Company symbol is required')
      .custom((value) => isValidSymbol(value, symbols)).withMessage('Invalid company symbol'),
    body('startDate').trim().notEmpty()
      .isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid start date')
      .custom((value, { req }) => 
        dayjs(value).isBefore(dayjs(req.body.endDate))
      ).withMessage('Start date must be <= End date')
      .custom((value) => 
        dayjs(value).isBefore(dayjs())
      ).withMessage('Start date must be <= today'),
    body('endDate').trim().notEmpty()
      .isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid end date')
      .custom((value, { req }) => 
        dayjs(value).isAfter(dayjs(req.body.startDate))
      ).withMessage('End date must be >= Start date')
      .custom((value) => 
        dayjs(value).isBefore(dayjs())
      ).withMessage('End date must be <= today'),
    body('email').trim()
      .isEmail().withMessage('Invalid email address'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ]
};
