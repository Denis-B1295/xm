
import { Request, Response } from "express";

export const notFoundRoute = (_req: Request, res: Response) => {
  res.send("Wrong path, only POST '/api/company/historical-data' is available");
}