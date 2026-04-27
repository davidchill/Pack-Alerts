export type Retailer = 'pokemon-center' | 'target' | 'best-buy' | 'gamestop' | 'walmart';

export interface Product {
  id: string;
  name: string;
  retailer: Retailer;
  url: string;
  tcin?: string;      // Target product ID (required for Target Redsky API)
  sku?: string;       // Best Buy SKU
  walmartId?: string; // Walmart item ID (usItemId, found in the product URL)
}

export interface StockResult {
  product: Product;
  inStock: boolean;
  timestamp: Date;
  price?: string;
}
