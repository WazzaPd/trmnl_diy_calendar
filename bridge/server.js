require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const https = require('https');
const path = require('path');
const sharp = require('sharp');
const app = express();

const PORT = 3002;

// ⚠️ YOUR PRIVATE ICAL URL
const GOOGLE_ICAL_URL = process.env.ICAL_URL;

let browserInstance = null;

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/feed.ics', (req, res) => {
  https.get(GOOGLE_ICAL_URL, (response) => {
    response.pipe(res);
  }).on('error', (e) => res.status(500).send(e.message));
});

app.get('/calendar.png', async (req, res) => {
  console.log('📸 Generating Perfect E-ink Snapshot...');
  let page = null;
  
  try {
    if (!browserInstance || !browserInstance.isConnected()) {
      browserInstance = await puppeteer.launch({ 
        headless: "new", 
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage', 
          '--disable-accelerated-2d-canvas', 
          '--disable-gpu',
          '--font-render-hinting=none' // Prevents "wispy" fonts
        ] 
      });
    }

    page = await browserInstance.newPage();
    
    // 1. Render at Retina Resolution (2x)
    // This creates "more pixels" for the text, making it sharper before we shrink it.
    await page.setViewport({ 
      width: 800, 
      height: 480, 
      deviceScaleFactor: 2 
    });

    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.fc-timegrid-slots');
    await new Promise(r => setTimeout(r, 2000)); 

    const screenshotBuffer = await page.screenshot();

    // 2. The "Perfect" Conversion Pipeline
    const optimizedImage = await sharp(screenshotBuffer)
      // Resize nicely
      .resize(800, 480, { kernel: 'lanczos3' }) 
      
      // Force Greyscale
      .toColourspace('b-w') 
      
      // Threshold 200:
      // - Anything lighter than light-grey becomes WHITE.
      // - Anything darker than light-grey becomes BLACK.
      // This eliminates the "grey haze" background while keeping text readable.
      .threshold(160) 
      
      .png({ palette: true, colors: 2 })
      .toBuffer();

    res.set('Content-Type', 'image/png');
    res.send(optimizedImage);

  } catch (error) {
    console.error("❌ Screenshot failed:", error);
    res.status(500).send("Error generating screenshot");
    if (browserInstance) { await browserInstance.close(); browserInstance = null; }
  } finally {
    if (page) await page.close();
  }
});

process.on('SIGINT', async () => {
  if (browserInstance) await browserInstance.close();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`✅ SERVER RUNNING!`);
  console.log(`   👉 App:   http://localhost:${PORT}`);
  console.log(`   👉 Image: http://localhost:${PORT}/calendar.png`);
});
