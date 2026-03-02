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
    name: "Classic Pho Ga",
    price: 11.99,
    description: "Aromatic chicken pho with rice noodles",
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
    name: "Crispy Spring Rolls",
    price: 8.99,
    description: "Golden fried spring rolls with vegetables and pork",
    image: salty1g,
    category: "salty"
  },
  {
    id: 5,
    name: "Grilled Pork Skewers",
    price: 10.99,
    description: "Marinated pork skewers with Vietnamese herbs",
    image: salty2g,
    category: "salty"
  },
  {
    id: 6,
    name: "Lemongrass Chicken",
    price: 11.99,
    description: "Fragrant lemongrass chicken with steamed rice",
    image: salty3g,
    category: "salty"
  },
  
  // mixed
  {
    id: 7,
    name: "Vietnamese Mixed Platter",
    price: 15.99,
    description: "Assorted Vietnamese favorites on one plate",
    image: mixed1g,
    category: "mixed"
  },
  {
    id: 8,
    name: "Traditional Rice Dishes",
    price: 14.99,
    description: "Combination of grilled meats with broken rice",
    image: mixed2g,
    category: "mixed"
  },
  {
    id: 9,
    name: "Chef's Special Combo",
    price: 16.99,
    description: "Chef's selection of signature dishes",
    image: mixed3g,
    category: "mixed"
  },
  
  // drinks
  {
    id: 10,
    name: "Vietnamese Iced Coffee",
    price: 4.99,
    description: "Strong coffee with condensed milk over ice",
    image: drink1g,
    category: "drinks"
  },
  {
    id: 11,
    name: "Fresh Coconut Water",
    price: 3.99,
    description: "Refreshing natural coconut water",
    image: drink2g,
    category: "drinks"
  },
  {
    id: 12,
    name: "Vietnamese Tea",
    price: 2.99,
    description: "Traditional jasmine or green tea",
    image: drink3g,
    category: "drinks"
  },
  
  // desserts
  {
    id: 13,
    name: "Sweet Che",
    price: 5.99,
    description: "Traditional Vietnamese sweet dessert soup",
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
    name: "Coconut Flan",
    price: 5.99,
    description: "Creamy coconut caramel flan",
    image: dessert3g,
    category: "desserts"
  }
];