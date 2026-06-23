import {Pool, PoolConfig} from 'pg';
import {InventoryItem} from '../types';
import {config} from '../config';

const createDBPool = (config: PoolConfig) => {
  return new Pool(config);
};
const pool = createDBPool(config.dbConfig);

const createLookupFn = (pool: Pool) => async (skuId: string) => {
  const query = {
    name: 'getInventory',
    text: 'SELECT * FROM skuTable WHERE skuId = $1',
    values: [skuId],
  };
  const {rows} = await pool.query(query);
  // there is certainly a more elegant handling of this, but we decide
  // the DB schema and we know skuId is a primary key, so there will
  // always either be 0 or 1 result, never more
  if (rows[0]) return rows[0];
  // would rather throw a more detailed error obj, but spec treats Error
  // as a string and this lets us handle our 404 pretty easily
  else throw 'NoDataError: SKU not found';
};
export const lookupSku = createLookupFn(pool);

const createUpsertFn = (pool: Pool) => async (values: InventoryItem) => {
  const {skuId, quantity} = values;
  if (quantity && Number.isInteger(quantity)) {
    const query = {
      name: 'createInventory',
      text: `INSERT INTO skuTable (skuId, quantity)
                VALUES($1, $2)
                ON CONFLICT (skuId)
                    DO UPDATE SET quantity = skuTable.quantity + $2
                RETURNING skuId, quantity`,
      values: [skuId, quantity],
    };
    const {rows} = await pool.query(query);
    // this is an upsert, so as long as we don't have DB problems,
    // we always get one row back
    return rows[0];
  } else throw 'RequestError: Invalid request';
};
export const addQuantityToSku = createUpsertFn(pool);

const createSubtractFn = (pool: Pool) => async (values: InventoryItem) => {
  const {skuId, quantity} = values;
  if (quantity && Number.isInteger(quantity)) {
    // this can throw its own "NoDataError"
    const {quantity: inStock} = await lookupSku(skuId);

    // if the prospective purchase amount > stock, throw error for 400 response
    if (quantity > inStock)
      throw 'InventoryError: Purchase request exceeds inventory';

    // if the SKU is present, the request is properly formed, AND there is enough stock to deduct from, deduct the stock
    const query = {
      name: 'purchaseItem',
      text: `UPDATE skuTable
                    SET quantity = quantity - $2
                    WHERE skuId = $1
                    RETURNING skuId, quantity`,
      values: [skuId, quantity],
    };

    const {rows} = await pool.query(query);
    return rows[0];
  } else throw 'RequestError: Invalid request';
};
export const safeSubtractFromSku = createSubtractFn(pool);

const createGetFullInventoryFn = (pool: Pool) => async () => {
  const query = {
    name: 'getInventory',
    text: 'SELECT * FROM skuTable',
  };
  const {rows} = await pool.query(query);
  return rows;
};
export const getFullInventory = createGetFullInventoryFn(pool);
