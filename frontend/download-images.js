// download-images.js - Run this to download all images
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directories if they don't exist
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Image URLs to download
const images = [
  // Product Images
  {
    url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop&auto=format',
    path: 'src/assets/images/products/sunflower-oil.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop&auto=format',
    path: 'src/assets/images/products/soybean-oil.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&auto=format',
    path: 'src/assets/images/products/palm-oil.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop&auto=format',
    path: 'src/assets/images/products/ricebran-oil.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop&auto=format',
    path: 'src/assets/images/products/groundnut-oil.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop&auto=format',
    path: 'src/assets/images/products/industrial-oil.jpg'
  },
  
  // Hero Images
  {
    url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=600&fit=crop&auto=format',
    path: 'src/assets/images/hero/slide1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=600&fit=crop&auto=format',
    path: 'src/assets/images/hero/slide2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&h=600&fit=crop&auto=format',
    path: 'src/assets/images/hero/slide3.jpg'
  },
  
  // About Image
  {
    url: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=500&fit=crop&auto=format',
    path: 'src/assets/images/about/facility.jpg'
  },
  
  // Event Images
  {
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=300&fit=crop&auto=format',
    path: 'src/assets/images/events/event1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=300&fit=crop&auto=format',
    path: 'src/assets/images/events/event2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop&auto=format',
    path: 'src/assets/images/events/event3.jpg'
  }
];

// Simple download function using fetch
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const fullPath = path.join(__dirname, filepath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, Buffer.from(buffer));
    console.log(`✅ Downloaded: ${filepath}`);
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error.message);
  }
}

// Download all images
async function downloadAll() {
  console.log('📦 Starting image download...');
  createDir('src/assets/images');
  
  for (const image of images) {
    await downloadImage(image.url, image.path);
  }
  
  console.log('✅ All images downloaded!');
}

downloadAll();