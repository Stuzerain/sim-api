import express = require('express');
const app = express();
const PORT = 3000;

// operationId: getInventory
app.get('/inventory/:skuId', (req, res) => {
    /**
     * look up skuId
     * if exists, return 200 + quantity
     * else return 404
     */
  res.send('Hello World!');
});

// operationId: createInventory
app.post('/inventory/:skuId', (req, res) => {
    /**
     * attempt upsert quantity for skuId
     * if successful, return 200 + quantity
     * else return 400
     */
  res.send('Hello World!');
});

// operationId: purchaseitem
app.post('/inventory/:skuId/purchase', (req, res) => {
    /**
     * look up skuId
     * if exists and purchase amount < quantity, subtract purchase amount
     *     return 200 + quantity
     * if insufficient inventory or invalid request, return 400
     * if SKU not found, return 404
     */
  res.send('Hello World!');
});

// operationId: listInventory
app.get('/inventory', (req, res) => {
    /**
     * returns array of all SKUs + quantity (can be empty)
     */
  res.send('Hello World!');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Simple Inventory Manager listening on port: ${PORT}`);
});
