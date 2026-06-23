import express = require('express')
const app = express()
app.use(express.json())

import { config } from "../config"
import { lookupSku, addQuantityToSku, safeSubtractFromSku, getFullInventory } from '../db'

// operationId: getInventory
app.get('/inventory/:skuId', async (req, res) => {
    try {
        const { skuId } = req.params
        const lookup = await lookupSku(skuId)
        res.status(200).send(lookup)
    } catch (error) {
        res.status(404).send(error)
    }
})

// operationId: createInventory
app.post('/inventory/:skuId', async (req, res) => {
    try {
        const { quantity } = req.body
        const { skuId } = req.params
        const inventoryItem = { skuId, quantity }
        const upsert = await addQuantityToSku(inventoryItem)
        res.status(200).send(upsert)
    } catch (error) {
        res.status(400).send(error)
    }
})

// operationId: purchaseitem
app.post('/inventory/:skuId/purchase', async (req, res) => {
    try {
        const { quantity } = req.body
        const { skuId } = req.params
        const inventoryItem = { skuId, quantity }
        const purchase = await safeSubtractFromSku(inventoryItem)
        res.status(200).send(purchase)
    } catch (error) {
        // default error status is 400, only use 404 when no SKU found
        let status = 400
        if (error === "NoDataError: SKU not found") status = 404
        res.status(status).send(error)
    }
})

// operationId: listInventory
app.get('/inventory', async (req, res) => {
    try {
        const inventory = await getFullInventory()
        res.status(200).send(inventory)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Simple Inventory Manager listening on port: ${config.port}`);
})
