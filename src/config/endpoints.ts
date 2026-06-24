export const endpoints = {
  auth: {
    login: '/users/login',
    logout: '/users/logout',
    refresh: '/users/refresh',
    me: '/users/me',
    register: '/users/register',
    forgotPassword: '/users/forgot-password',
    changePassword: '/users/change-password'
  },
  brands: '/brands',
  carts: {
    root: '/carts',
    item: (cartId: string) => `/carts/${cartId}`,
    addItem: (cartId: string) => `/carts/${cartId}`,
    quantity: (cartId: string) => `/carts/${cartId}/product/quantity`,
    product: (cartId: string, productId: string) => `/carts/${cartId}/product/${productId}`
  },
  categories: {
    root: '/categories',
    tree: '/categories/tree',
    search: '/categories/search',
    item: (categoryId: string) => `/categories/${categoryId}`,
    treeItem: (categoryId: string) => `/categories/tree/${categoryId}`
  },
  contact: {
    messages: '/messages',
    message: (messageId: string) => `/messages/${messageId}`,
    attachFile: (messageId: string) => `/messages/${messageId}/attach-file`,
    reply: (messageId: string) => `/messages/${messageId}/reply`,
    status: (messageId: string) => `/messages/${messageId}/status`
  },
  favorites: {
    root: '/favorites',
    item: (favoriteId: string) => `/favorites/${favoriteId}`
  },
  invoices: {
    root: '/invoices',
    guest: '/invoices/guest',
    item: (invoiceId: string) => `/invoices/${invoiceId}`,
    pdf: (invoiceNumber: string) => `/invoices/${invoiceNumber}/download-pdf`,
    pdfStatus: (invoiceNumber: string) => `/invoices/${invoiceNumber}/download-pdf-status`,
    status: (invoiceId: string) => `/invoices/${invoiceId}/status`,
    search: '/invoices/search'
  },
  payment: {
    check: '/payment/check'
  },
  postcode: '/postcode-lookup',
  products: {
    root: '/products',
    search: '/products/search',
    related: (productId: string) => `/products/${productId}/related`,
    specs: (productId: string) => `/products/${productId}/specs`,
    spec: (productId: string, specId: string) => `/products/${productId}/specs/${specId}`,
    item: (productId: string) => `/products/${productId}`
  },
  reports: {
    totalSalesPerCountry: '/reports/total-sales-per-country',
    top10PurchasedProducts: '/reports/top10-purchased-products',
    top10BestSellingCategories: '/reports/top10-best-selling-categories',
    totalSalesOfYears: '/reports/total-sales-of-years',
    averageSalesPerMonth: '/reports/average-sales-per-month',
    averageSalesPerWeek: '/reports/average-sales-per-week',
    customersByCountry: '/reports/customers-by-country'
  },
  totp: {
    setup: '/totp/setup',
    verify: '/totp/verify'
  },
  users: {
    root: '/users',
    register: '/users/register',
    login: '/users/login',
    forgotPassword: '/users/forgot-password',
    changePassword: '/users/change-password',
    me: '/users/me',
    logout: '/users/logout',
    refresh: '/users/refresh',
    search: '/users/search',
    item: (userId: string) => `/users/${userId}`
  }
} as const;
