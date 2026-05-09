import pho1g from "../assets/images/gallery/Pho1.jpg";
import pho2g from "../assets/images/gallery/Pho2.jpg";
import pho3g from "../assets/images/gallery/Pho3.jpg";
import salty1g from "../assets/images/gallery/salty1.jpg";
import salty2g from "../assets/images/gallery/salty2.jpg";
import salty3g from "../assets/images/gallery/salty3.jpg";
import mixed1g from "../assets/images/gallery/Mixed1.jpg";
import mixed2g from "../assets/images/gallery/Mixed2.jpg";
import mixed3g from "../assets/images/gallery/Mixed3.jpg";
import drink1g from "../assets/images/gallery/drink1.jpg";
import drink2g from "../assets/images/gallery/drink2.jpg";
import drink3g from "../assets/images/gallery/drink3.jpg";
import dessert1g from "../assets/images/gallery/dessert1.jpg";
import dessert2g from "../assets/images/gallery/dessert2.jpg";
import dessert3g from "../assets/images/gallery/dessert3.jpg";

export const products = [
  // Pho
  {
    id: 1,
    name: "Signature Pho Bo",
    price: 12.99,
    description: "Traditional Vietnamese beef noodle soup with fresh herbs",
    image: pho1g,
    category: "Pho"
  },
  {
    id: 2,
    name: "Classic Bun Mam",
    price: 11.99,
    description: "Beef and vegetables with stir-fried thin rice noodles.",
    image: pho2g,
    category: "Pho"
  },
  {
    id: 3,
    name: "Special Pho Tai",
    price: 13.99,
    description: "Rare beef pho with special house broth",
    image: pho3g,
    category: "Pho"
  },
  
  // salty
  {
    id: 4,
    name: "Grilled Pork Skewers",
    price: 18.99,
    description: "Skewered meat marinated with Vietnamese herbs and served with rice paper rolls.",
    image: salty1g,
    category: "salty"
  },
  {
    id: 5,
    name: "Lemongrass Chicken",
    price: 11.99,
    description: "Fragrant lemongrass chicken with steamed rice",
    image: salty2g,
    category: "salty"
  },
  {
    id: 6,
    name: "Grilled fish",
    price: 11.99,
    description: "Fragrant grilled fish with Vietnamese fermented carrots and daikons",
    image: salty3g,
    category: "salty"
  },
  
  // mixed
  {
    id: 7,
    name: "Steamed rolled rice pancake",
    price: 10.99,
    description: "Steamed rice pancake filled with pork skin and bean sprouts, served with fresh herbs and dipping fish chili sauce",
    image: mixed1g,
    category: "mixed"
  },
  {
    id: 8,
    name: "Rice paper salad",
    price: 11.99,
    description: "Mixed rice paper salad is a dish consisting of small pieces of rice paper mixed with dried beef, dried shrimp, quail eggs, mango, coriander, chili sauce, shrimp salt, and a little kumquat.",
    image: mixed2g,
    category: "mixed"
  },
  {
    id: 9,
    name: "Chef's Special Combo",
    price: 12.99,
    description: "Chef's selection of signature dishes",
    image: mixed3g,
    category: "mixed"
  },
  
  // drinks
  {
    id: 10,
    name: "Orange juice",
    price: 3.99,
    description: "Freshly squeezed orange juice",
    image: drink1g,
    category: "drinks"
  },
  {
    id: 11,
    name: "Vietnamese Iced Coffee",
    price: 3.99,
    description: "Strong coffee with condensed milk over ice",
    image: drink2g,
    category: "drinks"
  },
  {
    id: 12,
    name: "Vietnamese Boba Tea",
    price: 3.99,
    description: "Traditional jasmine or green tea",
    image: drink3g,
    category: "drinks"
  },
  
  // desserts
  {
    id: 13,
    name: "Chocolate Tapioca Pudding",
    price: 5.99,
    description: "Creamy chocolate pudding with chewy tapioca pearls",
    image: dessert1g,
    category: "desserts"
  },
  {
    id: 14,
    name: "Banana Cake",
    price: 6.99,
    description: "Moist Vietnamese banana cake",
    image: dessert2g,
    category: "desserts"
  },
  {
    id: 15,
    name: "Cream Caramel Flan with Chocolate Sauce and pannacotta",
    price: 5.99,
    description: "Rich and creamy caramel flan served with chocolate sauce and pannacotta",
    image: dessert3g,
    category: "desserts"
  }
];