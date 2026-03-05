// Mock data for JAVA FOOD HUB

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceForTwo: number;
  promoted: boolean;
  veg: boolean;
  address: string;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg: boolean;
  bestseller: boolean;
  rating: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";
  date: string;
  restaurantName: string;
  address: string;
  paymentMethod: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const categories: Category[] = [
  { id: "1", name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop" },
  { id: "2", name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" },
  { id: "3", name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop" },
  { id: "4", name: "Chinese", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&h=200&fit=crop" },
  { id: "5", name: "Desserts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop" },
  { id: "6", name: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop" },
  { id: "7", name: "Rolls", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop" },
  { id: "8", name: "Thali", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop" },
];

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "The Spice Garden",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    cuisine: ["North Indian", "Mughlai", "Biryani"],
    rating: 4.5,
    deliveryTime: "25-30 min",
    priceForTwo: 500,
    promoted: true,
    veg: false,
    address: "SRM Food Court, Block A",
    description: "Authentic North Indian cuisine with rich flavors and aromatic spices.",
  },
  {
    id: "r2",
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    cuisine: ["Pizza", "Italian", "Pasta"],
    rating: 4.3,
    deliveryTime: "20-25 min",
    priceForTwo: 600,
    promoted: false,
    veg: false,
    address: "SRM Main Canteen, Block B",
    description: "Wood-fired pizzas and fresh pasta made with imported ingredients.",
  },
  {
    id: "r3",
    name: "Green Leaf Veg",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
    cuisine: ["South Indian", "Chinese", "Continental"],
    rating: 4.1,
    deliveryTime: "30-35 min",
    priceForTwo: 350,
    promoted: true,
    veg: true,
    address: "SRM Veg Corner, TP Ganesan Auditorium",
    description: "Pure vegetarian restaurant with a wide variety of cuisines.",
  },
  {
    id: "r4",
    name: "Burger Barn",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
    cuisine: ["Burgers", "American", "Shakes"],
    rating: 4.4,
    deliveryTime: "15-20 min",
    priceForTwo: 450,
    promoted: false,
    veg: false,
    address: "SRM Java Block Canteen",
    description: "Gourmet burgers made with premium patties and fresh toppings.",
  },
  {
    id: "r5",
    name: "Dragon Wok",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
    cuisine: ["Chinese", "Thai", "Asian"],
    rating: 4.2,
    deliveryTime: "25-30 min",
    priceForTwo: 550,
    promoted: true,
    veg: false,
    address: "SRM Food Street, Near Library",
    description: "Authentic Asian cuisine with bold flavors and fresh ingredients.",
  },
  {
    id: "r6",
    name: "Dosa Factory",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    cuisine: ["South Indian", "Dosa", "Idli"],
    rating: 4.6,
    deliveryTime: "20-25 min",
    priceForTwo: 250,
    promoted: false,
    veg: true,
    address: "SRM South Gate Stall",
    description: "Crispy dosas and authentic South Indian delicacies.",
  },
];

export const menuItems: MenuItem[] = [
  // Restaurant r1 - The Spice Garden
  { id: "m1", restaurantId: "r1", name: "Butter Chicken", description: "Tender chicken in rich, creamy tomato gravy", price: 320, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop", category: "Main Course", veg: false, bestseller: true, rating: 4.6 },
  { id: "m2", restaurantId: "r1", name: "Paneer Tikka", description: "Marinated cottage cheese grilled to perfection", price: 260, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop", category: "Starters", veg: true, bestseller: true, rating: 4.4 },
  { id: "m3", restaurantId: "r1", name: "Chicken Biryani", description: "Fragrant basmati rice with tender chicken pieces", price: 280, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop", category: "Biryani", veg: false, bestseller: true, rating: 4.7 },
  { id: "m4", restaurantId: "r1", name: "Dal Makhani", description: "Slow-cooked black lentils in creamy gravy", price: 220, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop", category: "Main Course", veg: true, bestseller: false, rating: 4.3 },
  { id: "m5", restaurantId: "r1", name: "Garlic Naan", description: "Fresh tandoor-baked naan with garlic butter", price: 60, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop", category: "Breads", veg: true, bestseller: false, rating: 4.2 },
  { id: "m6", restaurantId: "r1", name: "Gulab Jamun", description: "Soft milk dumplings soaked in rose-flavored syrup", price: 120, image: "https://images.unsplash.com/photo-1666190059772-ceb1b0c3c51b?w=300&h=200&fit=crop", category: "Desserts", veg: true, bestseller: false, rating: 4.5 },

  // Restaurant r2 - Pizza Paradise
  { id: "m7", restaurantId: "r2", name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella and basil", price: 299, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop", category: "Pizza", veg: true, bestseller: true, rating: 4.5 },
  { id: "m8", restaurantId: "r2", name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni and cheese", price: 399, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop", category: "Pizza", veg: false, bestseller: true, rating: 4.6 },
  { id: "m9", restaurantId: "r2", name: "Pasta Alfredo", description: "Creamy white sauce pasta with herbs", price: 249, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&h=200&fit=crop", category: "Pasta", veg: true, bestseller: false, rating: 4.3 },
  { id: "m10", restaurantId: "r2", name: "Garlic Bread", description: "Toasted bread with garlic butter and herbs", price: 149, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300&h=200&fit=crop", category: "Sides", veg: true, bestseller: false, rating: 4.1 },

  // Restaurant r3 - Green Leaf Veg
  { id: "m11", restaurantId: "r3", name: "Masala Dosa", description: "Crispy crepe filled with spiced potato", price: 120, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop", category: "South Indian", veg: true, bestseller: true, rating: 4.5 },
  { id: "m12", restaurantId: "r3", name: "Veg Fried Rice", description: "Wok-tossed rice with fresh vegetables", price: 180, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop", category: "Chinese", veg: true, bestseller: false, rating: 4.2 },
  { id: "m13", restaurantId: "r3", name: "Paneer Butter Masala", description: "Rich and creamy paneer curry", price: 240, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop", category: "Main Course", veg: true, bestseller: true, rating: 4.4 },

  // Restaurant r4 - Burger Barn
  { id: "m14", restaurantId: "r4", name: "Classic Smash Burger", description: "Double patty with cheese and special sauce", price: 249, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop", category: "Burgers", veg: false, bestseller: true, rating: 4.7 },
  { id: "m15", restaurantId: "r4", name: "Crispy Chicken Burger", description: "Crunchy fried chicken with coleslaw", price: 229, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&h=200&fit=crop", category: "Burgers", veg: false, bestseller: true, rating: 4.5 },
  { id: "m16", restaurantId: "r4", name: "Loaded Fries", description: "Crispy fries topped with cheese and jalapeños", price: 179, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", category: "Sides", veg: true, bestseller: false, rating: 4.3 },

  // Restaurant r5 - Dragon Wok
  { id: "m17", restaurantId: "r5", name: "Chicken Manchurian", description: "Indo-Chinese chicken in spicy gravy", price: 260, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=200&fit=crop", category: "Chinese", veg: false, bestseller: true, rating: 4.4 },
  { id: "m18", restaurantId: "r5", name: "Hakka Noodles", description: "Stir-fried noodles with vegetables", price: 200, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop", category: "Chinese", veg: true, bestseller: false, rating: 4.2 },
  { id: "m19", restaurantId: "r5", name: "Spring Rolls", description: "Crispy rolls filled with vegetables", price: 180, image: "https://images.unsplash.com/photo-1548507652-da4b5042cc2c?w=300&h=200&fit=crop", category: "Starters", veg: true, bestseller: false, rating: 4.1 },

  // Restaurant r6 - Dosa Factory
  { id: "m20", restaurantId: "r6", name: "Rava Dosa", description: "Crispy semolina dosa with chutneys", price: 110, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop", category: "Dosa", veg: true, bestseller: true, rating: 4.5 },
  { id: "m21", restaurantId: "r6", name: "Idli Sambar", description: "Soft steamed idlis with lentil soup", price: 80, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop", category: "South Indian", veg: true, bestseller: false, rating: 4.3 },
  { id: "m22", restaurantId: "r6", name: "Filter Coffee", description: "Authentic South Indian filter coffee", price: 50, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop", category: "Beverages", veg: true, bestseller: true, rating: 4.8 },
];

export const sampleOrders: Order[] = [
  {
    id: "ORD001",
    items: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[4], quantity: 3 },
    ],
    total: 820,
    status: "delivered",
    date: "2026-02-25",
    restaurantName: "The Spice Garden",
    address: "SRM Hostel Block C, Room 204",
    paymentMethod: "UPI",
  },
  {
    id: "ORD002",
    items: [
      { ...menuItems[6], quantity: 1 },
      { ...menuItems[9], quantity: 2 },
    ],
    total: 597,
    status: "preparing",
    date: "2026-02-27",
    restaurantName: "Pizza Paradise",
    address: "SRM Hostel Block C, Room 204",
    paymentMethod: "Card",
  },
  {
    id: "ORD003",
    items: [
      { ...menuItems[13], quantity: 2 },
      { ...menuItems[15], quantity: 1 },
    ],
    total: 677,
    status: "accepted",
    date: "2026-02-27",
    restaurantName: "Burger Barn",
    address: "SRM Library, Ground Floor",
    paymentMethod: "Cash",
  },
];

export const adminStats = {
  totalRevenue: 125400,
  totalOrders: 342,
  activeCustomers: 1289,
  avgOrderValue: 367,
  revenueData: [
    { day: "Mon", revenue: 12400 },
    { day: "Tue", revenue: 18200 },
    { day: "Wed", revenue: 15600 },
    { day: "Thu", revenue: 21300 },
    { day: "Fri", revenue: 24800 },
    { day: "Sat", revenue: 19100 },
    { day: "Sun", revenue: 14000 },
  ],
  topItems: [
    { name: "Butter Chicken", orders: 89, revenue: 28480 },
    { name: "Chicken Biryani", orders: 76, revenue: 21280 },
    { name: "Classic Smash Burger", orders: 65, revenue: 16185 },
    { name: "Margherita Pizza", orders: 58, revenue: 17342 },
    { name: "Masala Dosa", orders: 52, revenue: 6240 },
  ],
};
