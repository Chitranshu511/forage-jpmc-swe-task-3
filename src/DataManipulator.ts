import { ServerRespond } from './DataStreamer';

export interface Row {
  stock: string,
  top_ask_price: number,
  timestamp: Date,
  price_abc: number, // Add 'price_abc' field
  price_def: number, // Add 'price_def' field
  ratio: number, // Add 'ratio' field
  lower_bound: number, // Add 'lower_bound' field
  upper_bound: number, // Add 'upper_bound' field
  trigger_alert: number, // Add 'trigger_alert' field
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    return serverResponds.map((el: any) => {
      // Calculate 'price_abc' and 'price_def' as in Task 1
      const price_abc = el.top_ask && el.top_ask.price || 0;
      const price_def = el.top_bid && el.top_bid.price || 0;

      // Calculate the 'ratio'
      const ratio = price_abc / price_def;

      // Set 'lower_bound' and 'upper_bound' (adjust these values as needed)
      const lower_bound = ratio * 0.95; // Example value, adjust as needed
      const upper_bound = ratio * 1.05; // Example value, adjust as needed

      // Determine 'trigger_alert' based on whether the ratio crosses the bounds
      let trigger_alert = undefined;
      if (ratio > upper_bound || ratio < lower_bound) {
        trigger_alert = ratio;
      }

      return {
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        timestamp: el.timestamp,
        price_abc,
        price_def,
        ratio,
        lower_bound,
        upper_bound,
        trigger_alert,
      };
    });
  }
}
