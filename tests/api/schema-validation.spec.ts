/**
 * Schema Validation Examples
 *
 * This file demonstrates multiple approaches to validate API responses:
 *   1. Zod runtime schema validation (recommended)
 *   2. TypeScript type guards
 *   3. Manual assertions
 *   4. Structural validation (shape checking)
 *
 * Java equivalent:
 *   - Zod = Bean Validation (JSR 380) / Jakarta Validation
 *   - Type guards = instanceof checks
 *   - Assertions = AssertJ or Hamcrest matchers
 *
 * Benefits:
 *   - Catch API contract violations early
 *   - Runtime validation of types from untyped sources
 *   - Detailed error messages for debugging
 */

import { test, expect } from '../../src/fixtures/test-fixtures';
import { z } from 'zod';

// ============================================================================
// Zod Schema Definitions (can be moved to src/models/ for reuse)
// ============================================================================

const ProductSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1).max(255),
  brand: z.string().optional(),
  price: z.number().positive(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  is_featured: z.boolean().optional(),
  stock: z.number().int().nonnegative().optional()
});

type Product = z.infer<typeof ProductSchema>;

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().optional(),
  avatar: z.string().url().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string()
  }).optional()
});

type User = z.infer<typeof UserSchema>;

const CartSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive()
    })
  ),
  total_price: z.number().nonnegative(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

type Cart = z.infer<typeof CartSchema>;

const PaginatedResponseSchema = z.object({
  data: z.array(z.record(z.string(), z.any())),
  total: z.number().int().nonnegative(),
  per_page: z.number().int().positive(),
  current_page: z.number().int().positive()
});

test.describe('Schema validation @api', () => {
  test('validate a single product response against schema', async ({ productsApi }) => {
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];

    // -----------------------------------------------------------------------
    // Parse the first product with Zod validation
    // If validation fails, Zod throws a ZodError with detailed path/code info
    // -----------------------------------------------------------------------
    expect(products.length).toBeGreaterThan(0);
    const product = products[0];

    // Safe parsing returns { success: true, data } or { success: false, error }
    const result = ProductSchema.safeParse(product);

    if (!result.success) {
      console.error('Validation errors:', result.error.flatten());
      throw new Error(`Product validation failed: ${result.error.message}`);
    }

    const validatedProduct: Product = result.data;
    expect(validatedProduct.id).toBeTruthy();
    expect(validatedProduct.name).toBeTruthy();
  });

  test('validate all products in paginated response', async ({ productsApi }) => {
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];

    // -----------------------------------------------------------------------
    // Validate the entire response structure
    // -----------------------------------------------------------------------
    const validatedProducts = products.map((product: any) => {
      const result = ProductSchema.parse(product); // Throws on error
      return result;
    });

    expect(validatedProducts.length).toBeGreaterThan(0);
    validatedProducts.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
    });
  });

  test('detect schema violations and report detailed errors', async ({ productsApi }) => {
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];
    expect(products.length).toBeGreaterThan(0);

    // -----------------------------------------------------------------------
    // Create a deliberately invalid product object
    // -----------------------------------------------------------------------
    const invalidProduct = {
      id: 'valid-id',
      name: '', // Empty name violates min(1)
      price: -10, // Negative price violates positive()
      email: 'not-an-email' // Unexpected field
    };

    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);

    if (!result.success) {
      // -----------------------------------------------------------------------
      // Inspect detailed validation errors
      // -----------------------------------------------------------------------
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name).toBeDefined(); // min(1) violation
      expect(errors.price).toBeDefined(); // positive() violation
      console.log('Validation errors:', errors);
    }
  });

  test('validate nested structures (e.g., user with address)', async ({  }) => {
    // -----------------------------------------------------------------------
    // Fetch a user and validate nested address object
    // -----------------------------------------------------------------------
    // In a real scenario, you'd fetch from an API that returns full user data
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postal_code: '62701',
        country: 'USA'
      }
    };

    const result = UserSchema.safeParse(mockUser);
    expect(result.success).toBe(true);

    if (result.success) {
      const user: User = result.data;
      expect(user.address?.city).toBe('Springfield');
    }
  });

  test('coerce and transform data with Zod', async ({  }) => {
    // -----------------------------------------------------------------------
    // Use Zod to coerce string prices to numbers
    // -----------------------------------------------------------------------
    const CoercedProductSchema = z.object({
      id: z.string(),
      name: z.string(),
      price: z.coerce.number().positive() // Coerce string "19.99" → 19.99
    });

    const stringPriceProduct = {
      id: '123',
      name: 'Hammer',
      price: '19.99' // String instead of number
    };

    const result = CoercedProductSchema.safeParse(stringPriceProduct);
    expect(result.success).toBe(true);

    if (result.success) {
      const product = result.data;
      expect(typeof product.price).toBe('number');
      expect(product.price).toBe(19.99);
    }
  });

  test('validate array responses with consistent schemas', async ({ productsApi }) => {
    // -----------------------------------------------------------------------
    // Ensure all items in array conform to schema
    // -----------------------------------------------------------------------
    const response = await productsApi.getProducts();
    const products = Array.isArray(response) ? response : response.data || [];

    const ProductArraySchema = z.array(ProductSchema);
    const result = ProductArraySchema.safeParse(products);

    expect(result.success).toBe(true);
    if (result.success) {
      const validatedArray: Product[] = result.data;
      expect(validatedArray.every((p) => p.id && p.name)).toBe(true);
    }
  });

  test('use discriminated unions for polymorphic responses', async ({  }) => {
    // -----------------------------------------------------------------------
    // Handle different response types based on a discriminator field
    // Example: API returns either a Product or an Error
    // -----------------------------------------------------------------------
    const ResponseSchema = z.discriminatedUnion('type', [
      z.object({
        type: z.literal('success'),
        data: ProductSchema
      }),
      z.object({
        type: z.literal('error'),
        message: z.string(),
        code: z.number()
      })
    ]);

    const successResponse = {
      type: 'success',
      data: {
        id: 'prod-123',
        name: 'Drill',
        price: 49.99
      }
    };

    const result = ResponseSchema.safeParse(successResponse);
    expect(result.success).toBe(true);

    if (result.success && result.data.type === 'success') {
      expect(result.data.data.price).toBe(49.99);
    }
  });

  test('validate optional and nullable fields', async ({  }) => {
    // -----------------------------------------------------------------------
    // Distinguish between .optional() (undefined allowed) and .nullable() (null allowed)
    // -----------------------------------------------------------------------
    const FlexibleProductSchema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(), // undefined is okay
      image_url: z.string().url().nullable(), // null is okay
      tags: z.array(z.string()).default([]) // Default if missing
    });

    const product1 = { id: '1', name: 'Hammer' }; // description and image_url omitted
    const product2 = { id: '2', name: 'Drill', image_url: null, tags: ['power-tools'] };

    const result1 = FlexibleProductSchema.safeParse(product1);
    const result2 = FlexibleProductSchema.safeParse(product2);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    if (result1.success) {
      expect(result1.data.description).toBeUndefined();
      expect(result1.data.tags).toEqual([]); // Default applied
    }
  });

  test('validate batch operations with mixed results', async ({  }) => {
    // -----------------------------------------------------------------------
    // Validate responses from bulk API calls
    // -----------------------------------------------------------------------
    const BatchResultSchema = z.object({
      success: z.boolean(),
      items: z.array(
        z.union([
          z.object({ id: z.string(), status: z.literal('created') }),
          z.object({ id: z.string(), status: z.literal('failed'), error: z.string() })
        ])
      )
    });

    const batchResponse = {
      success: true,
      items: [
        { id: '1', status: 'created' },
        { id: '2', status: 'failed', error: 'Duplicate email' },
        { id: '3', status: 'created' }
      ]
    };

    const result = BatchResultSchema.safeParse(batchResponse);
    expect(result.success).toBe(true);

    if (result.success) {
      const failures = result.data.items.filter((item) => item.status === 'failed');
      expect(failures.length).toBe(1);
    }
  });

  test('refine schemas with custom validation logic', async ({  }) => {
    // -----------------------------------------------------------------------
    // Use .refine() to add custom validation beyond type checking
    // -----------------------------------------------------------------------
    const PriceRangeSchema = z
      .object({
        regular_price: z.number().positive(),
        discount_price: z.number().positive()
      })
      .refine((data) => data.discount_price < data.regular_price, {
        message: 'Discount price must be less than regular price',
        path: ['discount_price']
      });

    const validPrice = { regular_price: 100, discount_price: 80 };
    const invalidPrice = { regular_price: 100, discount_price: 120 };

    expect(PriceRangeSchema.safeParse(validPrice).success).toBe(true);
    expect(PriceRangeSchema.safeParse(invalidPrice).success).toBe(false);
  });
});
