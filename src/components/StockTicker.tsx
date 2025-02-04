import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const globalIndices = [
  { symbol: 'S&P 500', price: '5,088.80', change: 0.52 },
  { symbol: 'NASDAQ', price: '15,996.82', change: 0.35 },
  { symbol: 'DOW', price: '39,131.53', change: 0.15 },
  { symbol: 'FTSE 100', price: '7,706.28', change: -0.12 },
  { symbol: 'DAX', price: '17,419.33', change: 0.28 },
  { symbol: 'NIKKEI', price: '39,098.68', change: 1.75 },
];

const stockSymbols = [
  { symbol: 'NIFTY', price: '21,571.95', change: -0.52 },
  { symbol: 'SENSEX', price: '71,265.50', change: -0.63 },
  { symbol: 'RELIANCE', price: '2,730.25', change: 1.2 },
  { symbol: 'TCS', price: '3,890.15', change: -0.8 },
  { symbol: 'HDFC', price: '1,670.90', change: 0.45 },
  { symbol: 'INFY', price: '1,520.30', change: -1.1 },
  { symbol: 'AAPL', price: '182.52', change: 0.8 },
  { symbol: 'MSFT', price: '415.10', change: 1.2 },
  { symbol: 'GOOGL', price: '141.80', change: -0.5 },
];

export const GlobalTicker = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap border-b border-gray-200/60 dark:border-gray-800/60 py-1.5">
      <div className="animate-ticker inline-block">
        {[...globalIndices, ...globalIndices].map((index, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded-full transition-colors duration-200"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">{index.symbol}</span>
            <span className="mx-2 font-light tabular-nums">{index.price}</span>
            <span className={`flex items-center ${
              index.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {index.change >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(index.change)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export const StockTicker = () => {
  return (
    <div className="py-2.5 overflow-hidden whitespace-nowrap">
      <div className="animate-ticker inline-block">
        {[...stockSymbols, ...stockSymbols].map((stock, index) => (
          <span
            key={index}
            className="inline-flex items-center mx-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded-full transition-colors duration-200"
          >
            <span className="font-semibold text-gray-900 dark:text-gray-100">{stock.symbol}</span>
            <span className="mx-2 font-light tabular-nums">{stock.price}</span>
            <span className={`flex items-center ${
              stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {stock.change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stock.change)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};