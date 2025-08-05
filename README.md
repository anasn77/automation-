# ShopNiceKicks Automation

A Puppeteer-based automation script for automating the purchase process on ShopNiceKicks.com.

## Features

- 🛍️ **Product Navigation**: Automatically navigates to any product URL
- 👟 **Size Selection**: Dynamically selects specified shoe sizes
- 🛒 **Cart Management**: Adds products to cart and proceeds to checkout
- 🏠 **Address Filling**: Uses fake US address generator for shipping details
- 💳 **Payment Processing**: Uses fake card generator with valid format
- 🚚 **Shipping Selection**: Automatically selects shipping options
- 📦 **Order Submission**: Completes the entire purchase process
- ⏳ **Processing Detection**: Stops when redirected to processing page

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone or download this project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

1. **Copy the configuration example**:
   ```bash
   cp config.example .env
   ```

2. **Edit the `.env` file** with your desired settings:
   ```env
   PRODUCT_URL=https://shopnicekicks.com/products/your-product-url
   SHOE_SIZE=10
   ```

## Usage

### Basic Usage

```bash
npm start
```

### With Custom Parameters

```bash
PRODUCT_URL=https://shopnicekicks.com/products/your-product SHOE_SIZE=11 npm start
```

### Programmatic Usage

```javascript
const ShopNiceKicksAutomation = require('./index.js');

const automation = new ShopNiceKicksAutomation();
automation.runAutomation(
    'https://shopnicekicks.com/products/your-product',
    '10'
);
```

## How It Works

The automation script performs the following steps:

1. **Initialize Browser**: Launches Puppeteer with anti-detection settings
2. **Generate Fake Data**: Creates realistic US address and card information
3. **Navigate to Product**: Opens the specified product page
4. **Select Size**: Chooses the specified shoe size
5. **Add to Cart**: Adds the product to shopping cart
6. **Go to Checkout**: Proceeds to checkout page
7. **Fill Address**: Inputs generated shipping address
8. **Select Shipping**: Chooses shipping rate
9. **Fill Card Details**: Enters generated card information
10. **Submit Order**: Completes order submission
11. **Detect Processing**: Stops when processing page is reached

## Features

### Dynamic Selector Handling
The script uses multiple selector strategies to handle different website layouts:
- Data attributes (`data-testid`)
- CSS classes
- Form field names
- ID selectors

### Fake Data Generation
- **Addresses**: Realistic US addresses using Faker.js
- **Cards**: Valid format test card numbers
- **Personal Info**: Fake names, emails, and phone numbers

### Error Handling
- Comprehensive error catching and logging
- Screenshot capture on failures
- Graceful fallback strategies

### Anti-Detection
- Realistic user agent
- Human-like typing delays
- Browser fingerprint masking

## File Structure

```
shopnicekicks-automation/
├── index.js              # Main automation script
├── package.json          # Dependencies and scripts
├── config.example        # Configuration template
├── README.md            # This file
├── processing-page.png   # Screenshot of processing page (generated)
└── error-screenshot.png  # Error screenshot (generated)
```

## Customization

### Adding New Selectors

If the website changes, you can add new selectors in the respective methods:

```javascript
// In selectSize method
const sizeSelectors = [
    '[data-testid="size-${shoeSize}"]',
    `.size-option[data-size="${shoeSize}"]`,
    // Add your new selector here
    'your-new-selector'
];
```

### Modifying User Data

Edit the `generateUserData()` method to customize the generated information:

```javascript
generateUserData() {
    this.userData = {
        address: {
            // Customize address generation
            firstName: 'Your Custom Name',
            // ... other fields
        },
        card: {
            // Customize card details
            number: 'Your Test Card Number',
            // ... other fields
        }
    };
}
```

## Troubleshooting

### Common Issues

1. **Element Not Found**: The website structure may have changed. Check the selectors in the script.

2. **Timeout Errors**: Increase timeout values in the configuration:
   ```javascript
   await this.page.waitForSelector(selector, { timeout: 15000 });
   ```

3. **Browser Detection**: The website may be detecting automation. Try:
   - Setting `headless: false` to see what's happening
   - Adding more realistic delays
   - Using different user agents

### Debug Mode

Run with debug mode to see detailed logs:

```bash
npm run dev
```

## Legal Notice

⚠️ **Important**: This script is for educational and testing purposes only. Please ensure you comply with:
- ShopNiceKicks.com's Terms of Service
- Applicable laws and regulations
- Website's robots.txt file
- Rate limiting and fair use policies

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details. 