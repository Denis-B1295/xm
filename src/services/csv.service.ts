import { json2csv } from 'json-2-csv';

export const generateCSV = (data: any[]) => {
  const csv = json2csv(
    data,
    // fields: ['date', 'open', 'high', 'low', 'close', 'volume'],
    {
      escapeHeaderNestedDots: false,
    }
  );
  return csv;
};