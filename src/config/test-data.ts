export const defaultUsers = {
  admin: {
    email: 'admin@practicesoftwaretesting.com',
    password: 'welcome01',
    firstName: 'John',
    lastName: 'Doe'
  },
  customer: {
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome01',
    firstName: 'Jane',
    lastName: 'Doe'
  },
  customerTwo: {
    email: 'customer2@practicesoftwaretesting.com',
    password: 'welcome01',
    firstName: 'Jack',
    lastName: 'Howe'
  },
  customerThree: {
    email: 'customer3@practicesoftwaretesting.com',
    password: 'pass123',
    firstName: 'Bob',
    lastName: 'Smith'
  }
} as const;

export const hybridPaymentDefaults = {
  paymentMethod: 'credit-card',
  paymentDetails: {
    credit_card_number: '4111111111111111',
    expiration_date: '12/30',
    cvv: '123',
    card_holder_name: 'Jane Doe'
  }
} as const;
