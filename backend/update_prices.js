/**
 * update_prices.js
 * Directly updates all product prices in data.json to realistic INR values.
 * Run once with: node update_prices.js
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Map of product name -> { price, original_price } in INR
const INR_PRICES = {
  // Electronics
  'Sony WH-1000XM5 Headphones':       { price: 23999, original_price: 28999 },
  'Apple Watch Series 9':             { price: 33999, original_price: 36999 },
  '4K Ultra HD Monitor':              { price: 37999, original_price: 45999 },
  'Mechanical Gaming Keyboard':       { price: 10999, original_price: 13499 },
  'Laptop Stand Aluminum':            { price: 3999,  original_price: 6499  },
  'Smart Fitness Tracker':            { price: 12499, original_price: 16499 },
  'Wireless Charging Pad':            { price: 1999,  original_price: 3299  },
  'Bluetooth Speaker Portable':       { price: 7499,  original_price: 9999  },
  'USB-C Hub 10-in-1':               { price: 4999,  original_price: 7499  },
  '1080p Webcam':                     { price: 6499,  original_price: 8299  },
  'Portable SSD 1TB':                 { price: 8999,  original_price: 11499 },
  'Smart LED Bulbs 4-Pack':           { price: 3299,  original_price: 4999  },
  'True Wireless Earbuds':            { price: 9999,  original_price: 13299 },
  'Gaming Mouse Wireless':            { price: 6599,  original_price: 9099  },
  'Portable Projector':               { price: 28999, original_price: 37499 },
  'LED Strip Lights 10m':             { price: 2499,  original_price: 4199  },
  'Gaming Headset 7.1':              { price: 5799,  original_price: 8299  },
  'Mini Dash Cam 4K':                { price: 9999,  original_price: 13999 },
  'Graphics Drawing Tablet':          { price: 12499, original_price: 16499 },
  'Smart Security Camera':            { price: 4199,  original_price: 6699  },
  'Noise Canceling Earphones':        { price: 4999,  original_price: 7499  },
  'Laptop Backpack 15.6"':           { price: 4199,  original_price: 5799  },
  'Solar Power Bank 26800mAh':        { price: 3799,  original_price: 5799  },
  'Smart Plug WiFi 4-Pack':          { price: 2499,  original_price: 3699  },
  'Wireless Keyboard & Mouse':        { price: 3299,  original_price: 4999  },
  'Action Camera 4K':                 { price: 16599, original_price: 22499 },
  'Smart Doorbell Camera':            { price: 8299,  original_price: 11599 },
  'Portable Bluetooth Keyboard':      { price: 4199,  original_price: 5799  },
  'VR Headset PC':                    { price: 24999, original_price: 33299 },
  'Monitor Light Bar':                { price: 2999,  original_price: 4199  },
  // Clothing
  'Premium Oversized Hoodie':         { price: 2999,  original_price: 3999  },
  'Classic Pima Cotton T-Shirt':      { price: 899,   original_price: null  },
  'Slim Fit Denim Jacket':            { price: 3499,  original_price: 4999  },
  'High-Waist Yoga Leggings':         { price: 1999,  original_price: 2799  },
  'Cargo Jogger Pants':               { price: 1799,  original_price: 2499  },
  'Puffer Jacket Lightweight':        { price: 4999,  original_price: 6999  },
  'Polo Shirt Performance':           { price: 1499,  original_price: 1999  },
  'Linen Button-Down Shirt':          { price: 1999,  original_price: 2799  },
  'Bomber Jacket Satin':              { price: 3499,  original_price: 4999  },
  'Athletic Shorts 5"':               { price: 999,   original_price: 1499  },
  'Turtleneck Knit Sweater':          { price: 3499,  original_price: 4999  },
  'Maxi Wrap Dress':                  { price: 2499,  original_price: 3499  },
  'Slim Chino Pants':                 { price: 2199,  original_price: 2999  },
  'Sports Bra High-Impact':           { price: 1499,  original_price: 1999  },
  'Fleece Zip-Up Jacket':             { price: 1999,  original_price: 2799  },
  'Cropped Tank Top':                 { price: 799,   original_price: 1199  },
  'Trench Coat Classic':              { price: 6999,  original_price: 8999  },
  'Swim Trunks Quick-Dry':            { price: 1199,  original_price: 1699  },
  'Beanie Knit Hat':                  { price: 699,   original_price: 1099  },
  'Compression Running Socks':        { price: 999,   original_price: 1499  },
  // Home
  'Luxury Scented Candle Set':        { price: 3799,  original_price: 4999  },
  'Minimalist LED Desk Lamp':         { price: 5999,  original_price: 7999  },
  'Ceramic Coffee Mug Set':           { price: 3299,  original_price: null  },
  'Chunky Knit Throw Blanket':        { price: 7499,  original_price: 9999  },
  'Air Purifier HEPA H13':            { price: 15999, original_price: 20999 },
  'Ultrasonic Humidifier 5L':         { price: 4999,  original_price: 7499  },
  'Pour-Over Coffee Maker':           { price: 4199,  original_price: 5799  },
  'Electric Kettle 1.7L':            { price: 5999,  original_price: 7499  },
  'Countertop Blender Pro':           { price: 8499,  original_price: 12499 },
  'Bamboo Cutting Board Set':         { price: 2999,  original_price: 4199  },
  'Wall Art Print Set 3-Piece':       { price: 4199,  original_price: 6199  },
  'Storage Basket Set 3-Pack':        { price: 3799,  original_price: 5399  },
  'Blackout Curtains 2-Pack':         { price: 4199,  original_price: 5799  },
  'Memory Foam Pillow':               { price: 4999,  original_price: 7499  },
  'Indoor Plant Ceramic Pot Set':     { price: 2899,  original_price: 4199  },
  'Kitchen Scale Digital':            { price: 1599,  original_price: 2499  },
  'Dish Drying Rack 2-Tier':         { price: 3299,  original_price: 4599  },
  'Scented Reed Diffuser Set':        { price: 2399,  original_price: 3299  },
  'Non-Stick Cookware Set 10pc':      { price: 10999, original_price: 15999 },
  'Shower Head Rain-Style':           { price: 3799,  original_price: 5399  },
  // Sports
  'Premium Yoga Mat':                 { price: 4599,  original_price: 5999  },
  'Insulated Water Bottle 32oz':      { price: 2899,  original_price: 4199  },
  'Adjustable Dumbbell Set':          { price: 24999, original_price: 33299 },
  'Pro Running Shoes':                { price: 14999, original_price: 18299 },
  'Resistance Bands Set 11pc':        { price: 2499,  original_price: 3799  },
  'Jump Rope Speed Cable':            { price: 1699,  original_price: 2499  },
  'Pull-Up Bar Doorway':              { price: 3799,  original_price: 5399  },
  'Foam Roller High-Density':         { price: 2099,  original_price: 3299  },
  'Ab Roller Wheel Pro':              { price: 1899,  original_price: 2899  },
  'Kettlebell Cast Iron':             { price: 3299,  original_price: 4599  },
  'Boxing Gloves Pro 12oz':           { price: 5799,  original_price: 8299  },
  'Gym Bag Duffel 40L':              { price: 4599,  original_price: 6199  },
  'Cycling Helmet MIPS':              { price: 7499,  original_price: 9999  },
  'Swimming Goggles Anti-Fog':        { price: 1699,  original_price: 2499  },
  'Tennis Racket Carbon':             { price: 7499,  original_price: 10799 },
  'Smart Jump Rope Digital':          { price: 2899,  original_price: 4199  },
  'Hiking Boots Waterproof':          { price: 12499, original_price: 16599 },
  'Lifting Belt Leather 4"':         { price: 4999,  original_price: 7099  },
  'Yoga Block 2-Pack':                { price: 1599,  original_price: 2299  },
  'Sports Knee Sleeve 2-Pack':        { price: 2099,  original_price: 3299  },
  // Beauty
  'Vitamin C Face Serum 30ml':        { price: 3249,  original_price: 4599  },
  'Daily Moisturizer SPF 50':         { price: 2399,  original_price: 3299  },
  'Professional Makeup Brush Set 12pc': { price: 3749, original_price: 5399 },
  'Hair Dryer 2200W Professional':    { price: 6699,  original_price: 9199  },
  'Jade Facial Roller & Gua Sha':     { price: 2099,  original_price: 3299  },
  'Sheet Mask Set 20-Pack':           { price: 2499,  original_price: 3749  },
  'Electric Face Cleanser':           { price: 4999,  original_price: 7499  },
  'Retinol Night Cream 50ml':         { price: 4199,  original_price: 5799  },
  'Eau de Parfum 50ml':               { price: 7499,  original_price: 9999  },
  'Eyebrow Microblading Kit':         { price: 1699,  original_price: 2499  },
};

let updated = 0;
let notFound = [];

data.products = data.products.map(product => {
  const inr = INR_PRICES[product.name];
  if (inr) {
    updated++;
    return { ...product, price: inr.price, original_price: inr.original_price };
  } else {
    notFound.push(product.name);
    return product;
  }
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

console.log(`✅ Updated ${updated} products to INR prices`);
console.log(`📦 Total products in DB: ${data.products.length}`);
if (notFound.length > 0) {
  console.log(`⚠️  Could not find price mapping for (${notFound.length}):`);
  notFound.forEach(n => console.log(`   - ${n}`));
}
