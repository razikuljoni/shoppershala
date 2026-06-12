export const DELIVERY_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  FAILED_ATTEMPT: 'Failed Attempt',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return Requested',
  RETURNED: 'Returned',
};

export const USER_STATUS = {
  PENDING_VERIFICATION: 'Pending Verification',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  BANNED: 'Banned',
};

// Controls product visibility on the storefront
export const PRODUCT_VISIBILITY = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
  HIDDEN: 'Hidden',
};

// Controls stock tracking and purchase availability
export const PRODUCT_STATUS = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
  LOW_STOCK: 'Low Stock',
  PRE_ORDER: 'Pre Order',
};

export const REVIEW_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const COUPON_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  USED: 'Used',
  DISABLED: 'Disabled',
};
