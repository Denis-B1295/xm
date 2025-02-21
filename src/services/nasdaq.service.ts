import axios from "axios";
import { getRedisClient } from "./redis.service.js";
import { CompanySymbol } from "../types/nasdaq.js";

const CACHE_KEY = 'nasdaq_data';
const CACHE_TTL = 24 * 60 * 60;

export const getNasdacData = async (): Promise<CompanySymbol[]> => {
    try {
      if(!process.env.NASDAQ_LIST_URL){
          throw `Env var NASDAQ_LIST_URL is not set`;
      }
      const redis = getRedisClient();
    
      const cachedData = await redis.get(CACHE_KEY);
      console.log('useRedis')
      if (cachedData) {
        console.log('useRedis - hit cache')
        return JSON.parse(cachedData);
      }
      console.log('useRedis - miss')
  
      const { data } = await axios.get<CompanySymbol[]>(
        process.env.NASDAQ_LIST_URL
      );

      await redis.set(CACHE_KEY, JSON.stringify(data), {
        EX: CACHE_TTL,
        NX: true
      });
      return data;
    } catch (error) {
      console.error('Error fetching nasdaq data:', error);
      return [];
    }
  };