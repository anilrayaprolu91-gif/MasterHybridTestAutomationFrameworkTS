/**
 * JSON Handling and Transformation Scenarios
 *
 * This file demonstrates comprehensive JSON processing patterns:
 *   1. Deep object merging and updates
 *   2. JSON path queries and extraction
 *   3. Payload transformations
 *   4. Data normalization
 *   5. JSON diffing and comparison
 *   6. Edge cases (circular refs, large payloads, special chars)
 *
 * Java equivalent:
 *   - Jackson / Gson for JSON parsing
 *   - JSONPath for querying
 *   - Apache Commons Lang for deep merge
 *   - Google's Guava for transformations
 */

import { test, expect } from '../../src/fixtures/test-fixtures';
import { buildProduct, buildUser } from '../../src/utils/data-factory';

test.describe('JSON handling and transformations @api', () => {
  test('deep merge nested objects', async ({  }) => {
    // -----------------------------------------------------------------------
    // Merge API response with partial updates
    // -----------------------------------------------------------------------
    const originalProduct = {
      id: 'prod-123',
      name: 'Hammer',
      price: 19.99,
      details: {
        weight: '2 lbs',
        material: 'steel'
      }
    };

    const updates = {
      price: 24.99,
      details: {
        color: 'red' // Should merge, not replace
      }
    };

    // Deep merge implementation
    const merged = deepMerge(originalProduct, updates);

    expect(merged.price).toBe(24.99);
    expect(merged.details.weight).toBe('2 lbs'); // Preserved from original
    expect(merged.details.color).toBe('red'); // Added from updates
    expect(merged.details.material).toBe('steel'); // Preserved from original
  });

  test('extract values from deeply nested JSON using paths', async ({ productsApi }) => {
    // -----------------------------------------------------------------------
    // Query nested structures without null checks
    // -----------------------------------------------------------------------
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];
    expect(products.length).toBeGreaterThan(0);

    const product = products[0];

    // Safe nested access
    const productId = getNestedValue(product, 'id');
    const productName = getNestedValue(product, 'name');
    const brandName = getNestedValue(product, 'brand.name'); // Dotted path
    const unknownField = getNestedValue(product, 'deeply.nested.unknown.field', 'DEFAULT');

    expect(productId).toBeTruthy();
    expect(productName).toBeTruthy();
    expect(unknownField).toBe('DEFAULT'); // Graceful default
  });

  test('transform array of objects using map and filter', async ({ productsApi }) => {
    // -----------------------------------------------------------------------
    // Extract specific fields from collection
    // -----------------------------------------------------------------------
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];

    // Extract only id and name, filter out expensive items
    const cheapProducts = products
      .filter((p) => p.price < 50)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price
      }));

    expect(cheapProducts.length).toBeGreaterThan(0);
    cheapProducts.forEach((p) => {
      expect(p.price).toBeLessThan(50);
      expect(Object.keys(p)).toEqual(['id', 'name', 'price']);
    });
  });

  test('normalize JSON data (flatten, rename keys)', async ({  }) => {
    // -----------------------------------------------------------------------
    // Transform API response into internal format
    // -----------------------------------------------------------------------
    const apiResponse = {
      product_id: 'prod-123',
      product_name: 'Hammer',
      product_price: 19.99,
      category: {
        category_id: 'cat-1',
        category_name: 'Tools'
      }
    };

    const normalized = normalizeProductData(apiResponse);

    expect(normalized).toEqual({
      id: 'prod-123',
      name: 'Hammer',
      price: 19.99,
      categoryId: 'cat-1',
      categoryName: 'Tools'
    });
  });

  test('handle JSON with special characters and escaping', async ({  }) => {
    // -----------------------------------------------------------------------
    // Process JSON with quotes, newlines, unicode
    // -----------------------------------------------------------------------
    const productWithSpecialChars = {
      id: 'prod-123',
      name: 'Drill "Professional" Model',
      description: 'Heavy\ndrill\nwith\nnewlines',
      emoji: '🔨⚒️🛠️',
      quote: "It's \"premium\" quality"
    };

    const jsonString = JSON.stringify(productWithSpecialChars);
    expect(jsonString).toContain('\\"');
    expect(jsonString).toContain('\\n');
    expect(jsonString).toContain('🔨');

    const parsed = JSON.parse(jsonString);
    expect(parsed.name).toBe('Drill "Professional" Model');
    expect(parsed.emoji).toBe('🔨⚒️🛠️');
  });

  test('compare JSON objects for equality and differences', async ({  }) => {
    // -----------------------------------------------------------------------
    // Detect changes between two API responses
    // -----------------------------------------------------------------------
    const before = {
      id: 'prod-123',
      name: 'Hammer',
      price: 19.99,
      stock: 100
    };

    const after = {
      id: 'prod-123',
      name: 'Hammer Pro',
      price: 24.99,
      stock: 100,
      onSale: true
    };

    const diff = getObjectDifferences(before, after);

    expect(diff.changed).toContain('name');
    expect(diff.changed).toContain('price');
    expect(diff.added).toContain('onSale');
    expect(diff.removed.length).toBe(0);
  });

  test('filter JSON by conditions (complex queries)', async ({ productsApi }) => {
    // -----------------------------------------------------------------------
    // Build complex queries on collections
    // -----------------------------------------------------------------------
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];

    // Multi-condition filter
    const results = products
      .filter((p) => p.price > 10 && p.price < 100)
      .filter((p) => p.name && p.name.toLowerCase().includes('drill'))
      .map((p) => ({ id: p.id, name: p.name, price: p.price }));

    if (results.length > 0) {
      results.forEach((product) => {
        expect(product.price).toBeGreaterThan(10);
        expect(product.price).toBeLessThan(100);
      });
    }
  });

  test('group and aggregate JSON array data', async ({ productsApi }) => {
    // -----------------------------------------------------------------------
    // Group products by category and calculate totals
    // -----------------------------------------------------------------------
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];

    const grouped = products.reduce(
      (acc, product) => {
        const category = product.brand || 'uncategorized';
        if (!acc[category]) {
          acc[category] = {
            items: [],
            totalPrice: 0,
            count: 0
          };
        }
        acc[category].items.push(product);
        acc[category].totalPrice += product.price;
        acc[category].count += 1;
        return acc;
      },
      {} as Record<string, { items: any[]; totalPrice: number; count: number }>
    );

    const categoryNames = Object.keys(grouped);
    expect(categoryNames.length).toBeGreaterThan(0);

    Object.values(grouped).forEach((group: any) => {
      expect(group.count).toBe(group.items.length);
      expect(group.totalPrice).toBeGreaterThan(0);
    });
  });

  test('handle large JSON payloads efficiently', async ({  }) => {
    // -----------------------------------------------------------------------
    // Process large responses without memory issues
    // -----------------------------------------------------------------------
    const largeArray = Array.from({ length: 10000 }, (_, i) => ({
      id: `item-${i}`,
      value: Math.random() * 1000,
      nested: {
        data: `Item ${i}`,
        timestamp: new Date().toISOString()
      }
    }));

    // Process in chunks to avoid overwhelming memory
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < largeArray.length; i += chunkSize) {
      chunks.push(largeArray.slice(i, i + chunkSize));
    }

    expect(chunks.length).toBe(10); // 10,000 / 1000
    chunks.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(chunkSize);
    });

    // Process first chunk
    const firstChunk = chunks[0];
    if (!firstChunk) {
      throw new Error('First chunk should exist');
    }

    const processedFirst = firstChunk
      .filter((item) => item.value > 500)
      .map((item) => item.id);

    expect(Array.isArray(processedFirst)).toBe(true);
  });

  test('handle circular reference prevention in JSON', async ({  }) => {
    // -----------------------------------------------------------------------
    // Detect and handle circular structures
    // -----------------------------------------------------------------------
    const parent: any = {
      id: 'parent-1',
      name: 'Parent'
    };

    const child = {
      id: 'child-1',
      name: 'Child',
      parent: parent // Intentional reference
    };

    parent.children = [child]; // Creates circular reference

    // Safe serialization with replacer function
    const jsonString = JSON.stringify(parent, (key, value) => {
      if (key === 'parent' || key === 'children') {
        return '[Circular Reference]';
      }
      return value;
    });

    expect(jsonString).toContain('[Circular Reference]');
    const parsed = JSON.parse(jsonString);
    expect(parsed.children[0].parent).toBe('[Circular Reference]');
  });

  test('validate and sanitize user-provided JSON', async ({  }) => {
    // -----------------------------------------------------------------------
    // Clean and validate potentially malicious JSON
    // -----------------------------------------------------------------------
    const userInput = `{
      "name": "John Doe",
      "email": "john@example.com",
      "__proto__": {"isAdmin": true},
      "constructor": {"prototype": {"isAdmin": true}}
    }`;

    let parsed: any;
    try {
      parsed = JSON.parse(userInput);
    } catch (err) {
      throw new Error(`Invalid JSON: ${err}`);
    }

    // Sanitize by extracting only known fields
    const sanitized = {
      name: parsed.name || '',
      email: parsed.email || '',
      // Deliberately exclude __proto__ and constructor
    };

    expect(sanitized.name).toBe('John Doe');
    expect(sanitized.email).toBe('john@example.com');
    expect((sanitized as any).__proto__).toBeUndefined();
  });

  test('patch JSON using RFC 6902 JSON Patch operations', async ({  }) => {
    // -----------------------------------------------------------------------
    // Apply a series of patches to a JSON object
    // -----------------------------------------------------------------------
    const original = {
      id: 'prod-123',
      name: 'Hammer',
      price: 19.99,
      tags: ['tool', 'hand-tool']
    };

    // Patches: replace price, add sku, append tag
    const patches = [
      { op: 'replace', path: '/price', value: 24.99 },
      { op: 'add', path: '/sku', value: 'SKU-123456' },
      { op: 'add', path: '/tags/-', value: 'sale-item' }
    ];

    const patched = applyJsonPatches(original, patches);

    expect(patched.price).toBe(24.99);
    expect(patched.sku).toBe('SKU-123456');
    expect(patched.tags).toContain('sale-item');
  });

  test('convert between JSON and alternative formats', async ({  }) => {
    // -----------------------------------------------------------------------
    // Handle conversion (CSV, XML-like structures, etc.)
    // -----------------------------------------------------------------------
    const products = [
      { id: '1', name: 'Hammer', price: 19.99 },
      { id: '2', name: 'Drill', price: 49.99 }
    ];

    // Convert to CSV-like format
    const csv = jsonToCSV(products);
    expect(csv).toContain('id,name,price');
    expect(csv).toContain('1,Hammer,19.99');

    // Convert back to JSON
    const parsed = csvToJSON(csv);
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe('Hammer');
  });
});

// ============================================================================
// Helper Functions (move to src/utils/ for production use)
// ============================================================================

function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
}

function normalizeProductData(apiResponse: any): any {
  return {
    id: apiResponse.product_id,
    name: apiResponse.product_name,
    price: apiResponse.product_price,
    categoryId: apiResponse.category?.category_id,
    categoryName: apiResponse.category?.category_name
  };
}

function getObjectDifferences(before: any, after: any): any {
  const changed: string[] = [];
  const added: string[] = [];
  const removed: string[] = [];

  for (const key in before) {
    if (!(key in after)) {
      removed.push(key);
    } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed.push(key);
    }
  }

  for (const key in after) {
    if (!(key in before)) {
      added.push(key);
    }
  }

  return { changed, added, removed };
}

function applyJsonPatches(obj: any, patches: any[]): any {
  let result = JSON.parse(JSON.stringify(obj)); // Deep clone

  for (const patch of patches) {
    const pathParts = patch.path.split('/').filter((p: string) => p);

    if (patch.op === 'replace' || patch.op === 'add') {
      let current = result;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!(pathParts[i] in current)) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      const lastKey = pathParts[pathParts.length - 1];
      if (lastKey === '-') {
        current.push(patch.value);
      } else {
        current[lastKey] = patch.value;
      }
    }
  }

  return result;
}

function jsonToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => row[h]).join(','));

  return [headers.join(','), ...rows].join('\n');
}

function csvToJSON(csv: string): any[] {
  const lines = csv.trim().split('\n');
  const firstLine = lines[0];
  if (!firstLine) {
    return [];
  }
  const headers = firstLine.split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}
