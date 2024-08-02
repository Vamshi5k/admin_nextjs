export interface Product {
    productName: string;
    quantity: number;
    price: number;
  }
  
  export interface DeliveryAddress {
    addressLine: string;
    buildingName: string;
    streetNo: string;
    postalCode: string;
  }
  
  export interface CustomerDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    orderType: string;
  }
  
  export interface OrderDetails {
    orderId: string;
    customerDetails: CustomerDetails;
    products: Product[];
    totalCost: number;
    subTotal: number;
    deliveryFee: number;
    status: number;
    orderDate: string;
    orderTime: string;
    deliveryAddress: DeliveryAddress;
    billingAddress: string;
  }
  