import { faker } from '@faker-js/faker';
import type { Address } from '../models/user.model';
import type { ProductRequest } from '../models/product.model';
import type { InvoiceRequest } from '../models/invoice.model';

export function buildUser(): { first_name: string; last_name: string; email: string; password: string; address: Address } {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'Welcome@123',
    address: {
      street: faker.location.streetAddress(),
      house_number: faker.number.int({ min: 1, max: 999 }).toString(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postal_code: faker.location.zipCode()
    }
  };
}

export function buildProduct(): ProductRequest {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 5, max: 500 })),
    co2_rating: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
    is_rental: false,
    is_location_offer: false
  };
}

export function buildInvoice(cartId: string): InvoiceRequest {
  return {
    billing_street: faker.location.streetAddress(),
    billing_city: faker.location.city(),
    billing_state: faker.location.state(),
    billing_country: faker.location.country(),
    billing_postal_code: faker.location.zipCode(),
    payment_method: 'credit-card',
    payment_details: {
      credit_card_number: '4111111111111111',
      expiration_date: '12/30',
      cvv: '123',
      card_holder_name: `${faker.person.firstName()} ${faker.person.lastName()}`
    },
    cart_id: cartId
  };
}
