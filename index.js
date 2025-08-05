const puppeteer = require('puppeteer');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

class ShopNiceKicksAutomation {
    constructor() {
        this.browser = null;
        this.page = null;
        this.userData = null;
    }

    async initialize() {
        console.log('🚀 Initializing browser...');
        this.browser = await puppeteer.launch({
            headless: false, // Set to true for production
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Set user agent to avoid detection
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Generate fake user data
        this.generateUserData();
        
        console.log('✅ Browser initialized successfully');
    }

    generateUserData() {
        this.userData = {
            address: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                phone: faker.phone.number('###-###-####'),
                address1: faker.location.streetAddress(),
                address2: faker.location.secondaryAddress(),
                city: faker.location.city(),
                state: faker.location.state({ abbreviated: true }),
                zipCode: faker.location.zipCode('#####'),
                country: 'US'
            },
            card: {
                number: '4111111111111111', // Test card number
                expiryMonth: '12',
                expiryYear: '2025',
                cvv: '123',
                cardholderName: `${faker.person.firstName()} ${faker.person.lastName()}`
            }
        };
        
        console.log('📝 Generated user data:', {
            name: `${this.userData.address.firstName} ${this.userData.address.lastName}`,
            email: this.userData.address.email,
            city: this.userData.address.city
        });
    }

    async navigateToProduct(productUrl) {
        console.log(`🛍️ Navigating to product: ${productUrl}`);
        
        try {
            await this.page.goto(productUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            // Wait for product page to load
            await this.page.waitForSelector('[data-testid="product-title"], .product-title, h1', { timeout: 10000 });
            
            console.log('✅ Product page loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to navigate to product:', error.message);
            return false;
        }
    }

    async selectSize(shoeSize) {
        console.log(`👟 Selecting shoe size: ${shoeSize}`);
        
        try {
            // Wait for size selector to be available
            await this.page.waitForSelector('[data-testid="size-selector"], .size-selector, select[name="size"]', { timeout: 10000 });
            
            // Try different selectors for size selection
            const sizeSelectors = [
                `[data-testid="size-${shoeSize}"]`,
                `.size-option[data-size="${shoeSize}"]`,
                `option[value="${shoeSize}"]`,
                `[data-size="${shoeSize}"]`
            ];
            
            let sizeSelected = false;
            for (const selector of sizeSelectors) {
                try {
                    const sizeElement = await this.page.$(selector);
                    if (sizeElement) {
                        await sizeElement.click();
                        sizeSelected = true;
                        console.log(`✅ Size ${shoeSize} selected using selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!sizeSelected) {
                // Fallback: try to find size in dropdown
                await this.page.select('select[name="size"]', shoeSize);
                console.log(`✅ Size ${shoeSize} selected from dropdown`);
            }
            
            // Wait a moment for size selection to register
            await this.page.waitForTimeout(2000);
            return true;
        } catch (error) {
            console.error('❌ Failed to select size:', error.message);
            return false;
        }
    }

    async addToCart() {
        console.log('🛒 Adding product to cart...');
        
        try {
            // Wait for add to cart button
            await this.page.waitForSelector('[data-testid="add-to-cart"], .add-to-cart, button[type="submit"]', { timeout: 10000 });
            
            // Click add to cart button
            await this.page.click('[data-testid="add-to-cart"], .add-to-cart, button[type="submit"]');
            
            // Wait for cart update
            await this.page.waitForTimeout(3000);
            
            console.log('✅ Product added to cart');
            return true;
        } catch (error) {
            console.error('❌ Failed to add to cart:', error.message);
            return false;
        }
    }

    async goToCheckout() {
        console.log('💳 Proceeding to checkout...');
        
        try {
            // Try to find checkout button
            const checkoutSelectors = [
                '[data-testid="checkout-button"]',
                '.checkout-button',
                'a[href*="checkout"]',
                'button:contains("Checkout")'
            ];
            
            let checkoutClicked = false;
            for (const selector of checkoutSelectors) {
                try {
                    const checkoutButton = await this.page.$(selector);
                    if (checkoutButton) {
                        await checkoutButton.click();
                        checkoutClicked = true;
                        console.log(`✅ Checkout button clicked using selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!checkoutClicked) {
                // Try to navigate to checkout URL
                const currentUrl = this.page.url();
                const checkoutUrl = currentUrl.includes('cart') ? currentUrl.replace('cart', 'checkout') : currentUrl + '/checkout';
                await this.page.goto(checkoutUrl, { waitUntil: 'networkidle2' });
                console.log('✅ Navigated to checkout page');
            }
            
            // Wait for checkout page to load
            await this.page.waitForTimeout(3000);
            return true;
        } catch (error) {
            console.error('❌ Failed to go to checkout:', error.message);
            return false;
        }
    }

    async fillAddressDetails() {
        console.log('🏠 Filling address details...');
        
        try {
            // Fill shipping address form
            const addressFields = {
                'input[name="firstName"], input[name="first_name"], #firstName': this.userData.address.firstName,
                'input[name="lastName"], input[name="last_name"], #lastName': this.userData.address.lastName,
                'input[name="email"], input[type="email"], #email': this.userData.address.email,
                'input[name="phone"], input[type="tel"], #phone': this.userData.address.phone,
                'input[name="address1"], input[name="address"], #address1': this.userData.address.address1,
                'input[name="address2"], #address2': this.userData.address.address2,
                'input[name="city"], #city': this.userData.address.city,
                'input[name="state"], select[name="state"], #state': this.userData.address.state,
                'input[name="zipCode"], input[name="zip"], input[name="postalCode"], #zipCode': this.userData.address.zipCode
            };
            
            for (const [selector, value] of Object.entries(addressFields)) {
                try {
                    await this.page.waitForSelector(selector, { timeout: 5000 });
                    await this.page.type(selector, value, { delay: 100 });
                    console.log(`✅ Filled ${selector}: ${value}`);
                } catch (e) {
                    console.log(`⚠️ Could not find selector: ${selector}`);
                }
            }
            
            console.log('✅ Address details filled successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to fill address details:', error.message);
            return false;
        }
    }

    async selectShippingRate() {
        console.log('🚚 Selecting shipping rate...');
        
        try {
            // Wait for shipping options to load
            await this.page.waitForTimeout(2000);
            
            // Try to select the first available shipping option
            const shippingSelectors = [
                'input[name="shipping_method"]',
                '[data-testid="shipping-option"]',
                '.shipping-option input[type="radio"]'
            ];
            
            for (const selector of shippingSelectors) {
                try {
                    const shippingOptions = await this.page.$$(selector);
                    if (shippingOptions.length > 0) {
                        await shippingOptions[0].click();
                        console.log('✅ Shipping rate selected');
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            await this.page.waitForTimeout(2000);
            return true;
        } catch (error) {
            console.error('❌ Failed to select shipping rate:', error.message);
            return false;
        }
    }

    async fillCardDetails() {
        console.log('💳 Filling card details...');
        
        try {
            // Fill payment form
            const cardFields = {
                'input[name="cardNumber"], input[name="number"], #cardNumber': this.userData.card.number,
                'input[name="expiryMonth"], select[name="expiryMonth"], #expiryMonth': this.userData.card.expiryMonth,
                'input[name="expiryYear"], select[name="expiryYear"], #expiryYear': this.userData.card.expiryYear,
                'input[name="cvv"], input[name="cvc"], #cvv': this.userData.card.cvv,
                'input[name="cardholderName"], input[name="name"], #cardholderName': this.userData.card.cardholderName
            };
            
            for (const [selector, value] of Object.entries(cardFields)) {
                try {
                    await this.page.waitForSelector(selector, { timeout: 5000 });
                    await this.page.type(selector, value, { delay: 100 });
                    console.log(`✅ Filled ${selector}: ${value}`);
                } catch (e) {
                    console.log(`⚠️ Could not find selector: ${selector}`);
                }
            }
            
            console.log('✅ Card details filled successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to fill card details:', error.message);
            return false;
        }
    }

    async submitOrder() {
        console.log('📦 Submitting order...');
        
        try {
            // Find and click submit order button
            const submitSelectors = [
                '[data-testid="submit-order"]',
                '.submit-order',
                'button[type="submit"]',
                'input[type="submit"]',
                'button:contains("Place Order")',
                'button:contains("Submit Order")'
            ];
            
            let orderSubmitted = false;
            for (const selector of submitSelectors) {
                try {
                    const submitButton = await this.page.$(selector);
                    if (submitButton) {
                        await submitButton.click();
                        orderSubmitted = true;
                        console.log(`✅ Order submitted using selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!orderSubmitted) {
                console.log('⚠️ Could not find submit button, trying alternative approach');
                // Try pressing Enter on the form
                await this.page.keyboard.press('Enter');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Failed to submit order:', error.message);
            return false;
        }
    }

    async detectProcessingPage() {
        console.log('⏳ Detecting processing page...');
        
        try {
            // Wait for potential redirect or processing indicators
            await this.page.waitForTimeout(5000);
            
            // Check for processing indicators
            const processingIndicators = [
                'text="Processing"',
                'text="Order Confirmation"',
                'text="Thank you"',
                '[data-testid="processing"]',
                '.processing',
                '.order-confirmation'
            ];
            
            for (const indicator of processingIndicators) {
                try {
                    const element = await this.page.$(indicator);
                    if (element) {
                        console.log('✅ Processing page detected');
                        return true;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            // Take a screenshot for verification
            await this.page.screenshot({ path: 'processing-page.png' });
            console.log('📸 Screenshot saved as processing-page.png');
            
            console.log('✅ Reached processing/confirmation page');
            return true;
        } catch (error) {
            console.error('❌ Error detecting processing page:', error.message);
            return false;
        }
    }

    async runAutomation(productUrl, shoeSize) {
        console.log('🎯 Starting ShopNiceKicks automation...');
        console.log(`Product URL: ${productUrl}`);
        console.log(`Shoe Size: ${shoeSize}`);
        
        try {
            await this.initialize();
            
            // Step 1: Navigate to product page
            if (!(await this.navigateToProduct(productUrl))) {
                throw new Error('Failed to navigate to product page');
            }
            
            // Step 2: Select size
            if (!(await this.selectSize(shoeSize))) {
                throw new Error('Failed to select shoe size');
            }
            
            // Step 3: Add to cart
            if (!(await this.addToCart())) {
                throw new Error('Failed to add product to cart');
            }
            
            // Step 4: Go to checkout
            if (!(await this.goToCheckout())) {
                throw new Error('Failed to go to checkout');
            }
            
            // Step 5: Fill address details
            if (!(await this.fillAddressDetails())) {
                throw new Error('Failed to fill address details');
            }
            
            // Step 6: Select shipping rate
            if (!(await this.selectShippingRate())) {
                throw new Error('Failed to select shipping rate');
            }
            
            // Step 7: Fill card details
            if (!(await this.fillCardDetails())) {
                throw new Error('Failed to fill card details');
            }
            
            // Step 8: Submit order
            if (!(await this.submitOrder())) {
                throw new Error('Failed to submit order');
            }
            
            // Step 9: Detect processing page
            if (!(await this.detectProcessingPage())) {
                throw new Error('Failed to detect processing page');
            }
            
            console.log('🎉 Automation completed successfully!');
            
        } catch (error) {
            console.error('💥 Automation failed:', error.message);
            // Take error screenshot
            await this.page.screenshot({ path: 'error-screenshot.png' });
            console.log('📸 Error screenshot saved as error-screenshot.png');
        } finally {
            // Keep browser open for 10 seconds to see the result
            console.log('⏰ Keeping browser open for 10 seconds...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            if (this.browser) {
                await this.browser.close();
                console.log('🔒 Browser closed');
            }
        }
    }
}

// Main execution
async function main() {
    // Example usage
    const productUrl = process.env.PRODUCT_URL || 'https://shopnicekicks.com/products/jordan-ct8532-111-air-jordan-3-retro-white-and-silver-mens-lifestyle-shoe-white-metallic-silver';
    const shoeSize = process.env.SHOE_SIZE || '10';
    
    const automation = new ShopNiceKicksAutomation();
    await automation.runAutomation(productUrl, shoeSize);
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = ShopNiceKicksAutomation; 