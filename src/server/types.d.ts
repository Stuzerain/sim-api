export type InventoryQuantity = {
    // an int, really, but TS doesn't get that granular
    quantity: number,
}

export type InventoryItem = InventoryQuantity & {
    skuId: string,
}

// this doesn't really do a lot for us except specify a distinct purpose
export type Error = string;
