# Setup Guide for ShopNiceKicks Automation

## Prerequisites

Before running the automation script, you need to install Node.js and npm.

### Installing Node.js

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - Choose the Windows installer (.msi) for your system

2. **Install Node.js**:
   - Run the downloaded installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" during installation

3. **Verify Installation**:
   Open a new PowerShell/Command Prompt and run:
   ```bash
   node --version
   npm --version
   ```

## Project Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure the Script**:
   ```bash
   # Copy the configuration template
   copy config.example .env
   
   # Edit the .env file with your settings
   notepad .env
   ```

3. **Edit Configuration**:
   Open the `.env` file and update:
   ```env
   PRODUCT_URL=https://shopnicekicks.com/products/your-product-url
   SHOE_SIZE=10
   ```

## Running the Automation

### Basic Usage
```bash
npm start
```

### With Custom Parameters
```bash
PRODUCT_URL=https://shopnicekicks.com/products/your-product SHOE_SIZE=11 npm start
```

### Debug Mode
```bash
npm run dev
```

## Troubleshooting

### "npm is not recognized"
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)
- **Alternative**: Use the Windows installer and restart your terminal

### "Puppeteer failed to launch"
- **Solution**: The script will download Chromium automatically
- **Alternative**: Install Chrome browser manually

### "Element not found"
- **Solution**: The website structure may have changed
- **Check**: Run with `headless: false` to see what's happening

## File Structure

```
shopnicekicks-automation/
├── index.js              # Main automation script
├── package.json          # Dependencies and scripts
├── config.example        # Configuration template
├── README.md            # Documentation
├── SETUP.md             # This setup guide
├── test-setup.js        # Setup verification script
└── .gitignore           # Git ignore rules
```

## Quick Start Checklist

- [ ] Install Node.js from nodejs.org
- [ ] Open PowerShell/Command Prompt in project directory
- [ ] Run `npm install`
- [ ] Copy `config.example` to `.env`
- [ ] Edit `.env` with your product URL and size
- [ ] Run `npm start`

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run `node test-setup.js` to verify your setup
3. Check the console output for error messages
4. Ensure you're using the latest version of Node.js 