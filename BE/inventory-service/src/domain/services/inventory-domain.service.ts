// src/domain/services/inventory-domain.service.ts
import { Injectable } from '@nestjs/common';
import { InventoryItem } from '../entities/inventory-item.entity';

/**
 * Domain service for Inventory logic.
 * Pure business rules → No Nest, No DB, No HTTP, No logging.
 *
 * This layer ensures:
 * ✅ Stock cannot go negative
 * ✅ Reserved stock cannot exceed available stock
 * ✅ Adjusting stock respects domain invariants
 * ✅ Out-of-stock detection
 */

@Injectable()
export class InventoryDomainService {
  /**
   * Increase stock.
   */
  increaseStock(inventory: InventoryItem, quantity: number): InventoryItem {
    if (quantity <= 0) throw new Error('Quantity must be positive');

    inventory.stock += quantity;
    inventory.updatedAt = new Date();

    return inventory;
  }

  /**
   * Decrease stock (cannot go negative).
   */
  decreaseStock(inventory: InventoryItem, quantity: number): InventoryItem {
    if (quantity <= 0) throw new Error('Quantity must be positive');

    if (inventory.stock - quantity < 0) {
      throw new Error('Insufficient stock');
    }

    inventory.stock -= quantity;
    inventory.updatedAt = new Date();

    return inventory;
  }

  /**
   * Reserve stock for an order.
   */
  reserveStock(inventory: InventoryItem, quantity: number): InventoryItem {
    if (quantity <= 0) throw new Error('Quantity must be positive');

    if (inventory.stock < quantity) {
      throw new Error('Not enough stock to reserve');
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;
    inventory.updatedAt = new Date();

    return inventory;
  }

  /**
   * Release reserved stock (e.g., canceled order).
   */
  releaseReservedStock(inventory: InventoryItem, quantity: number): InventoryItem {
    if (quantity <= 0) throw new Error('Quantity must be positive');

    if (inventory.reserved - quantity < 0) {
      throw new Error('Reserved stock cannot go negative');
    }

    inventory.reserved -= quantity;
    inventory.stock += quantity;
    inventory.updatedAt = new Date();

    return inventory;
  }

  /**
   * Confirm reserved stock (order successful).
   * Reserved decreases, sold increases.
   */
  confirmReserved(inventory: InventoryItem, quantity: number): InventoryItem {
    if (quantity <= 0) throw new Error('Quantity must be positive');

    if (inventory.reserved - quantity < 0) {
      throw new Error('Reserved stock insufficient');
    }

    inventory.reserved -= quantity;
    inventory.sold += quantity;
    inventory.updatedAt = new Date();

    return inventory;
  }

  /**
   * Check if item is out of stock.
   */
  isOutOfStock(inventory: InventoryItem): boolean {
    return inventory.stock <= 0;
  }

  /**
   * Validate initial inventory creation.
   */
  validateCreation(stock: number, reserved: number, sold: number) {
    if (stock < 0) throw new Error('Stock cannot be negative');
    if (reserved < 0) throw new Error('Reserved cannot be negative');
    if (sold < 0) throw new Error('Sold cannot be negative');

    if (reserved > stock) {
      throw new Error('Reserved stock cannot exceed available stock');
    }
  }
}
