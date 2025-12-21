// =================================
// NETLIFY SERVERLESS FUNCTION
// Handles Magento API Integration
// =================================

const https = require('https');

// Environment Variables
const MAGENTO_TOKEN = process.env.MAGENTO_API_TOKEN;
const MAGENTO_BASE_URL = process.env.MAGENTO_BASE_URL || 'https://pinkblue.in/rest/V1';

// Whitelisted Firewall Headers (DO NOT CHANGE)
const FIREWALL_HEADERS = {
    'Authorization': `Bearer ${MAGENTO_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'PB_Netlify',
    'X-Source-App': 'PBChristmasQuiz2025',
    'X-Netlify-Secret': 'X-PB-NetlifY2025-901AD7EE35110CCB445F3CA0EBEB1494'
};

// CORS Headers
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

/**
 * Make HTTPS Request to Magento API
 */
function makeRequest(endpoint, method = 'GET', body = null, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const url = `${MAGENTO_BASE_URL}${endpoint}`;
        
        console.log(`[${new Date().toISOString()}] ${method} ${endpoint}`);
        
        const options = {
            method,
            headers: FIREWALL_HEADERS,
            timeout
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`✅ ${res.statusCode} | ${(data.length / 1024).toFixed(2)}KB`);
                    resolve({
                        statusCode: res.statusCode,
                        data: parsed
                    });
                } catch (e) {
                    console.error('❌ Parse Error:', e.message);
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Network Error:', error.message);
            reject(error);
        });

        req.on('timeout', () => {
            console.error('❌ Request Timeout');
            req.abort();
            reject(new Error('Request timeout'));
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

/**
 * Get Customer Details by Email
 */
async function getCustomerByEmail(email) {
    try {
        const endpoint = `/customers/search?searchCriteria[filterGroups][0][filters][0][field]=email&searchCriteria[filterGroups][0][filters][0][value]=${encodeURIComponent(email)}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`;
        
        const response = await makeRequest(endpoint);
        
        if (response.statusCode === 200 && response.data.items && response.data.items.length > 0) {
            const customer = response.data.items[0];
            return {
                success: true,
                customer: {
                    id: customer.id,
                    email: customer.email,
                    firstname: customer.firstname,
                    lastname: customer.lastname,
                    name: `${customer.firstname} ${customer.lastname}`,
                    created_at: customer.created_at
                }
            };
        } else {
            return {
                success: false,
                error: 'Customer not found'
            };
        }
    } catch (error) {
        console.error('Error fetching customer:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get Customer Orders
 */
async function getCustomerOrders(customerId, limit = 10) {
    try {
        const endpoint = `/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${customerId}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[pageSize]=${limit}`;
        
        const response = await makeRequest(endpoint);
        
        if (response.statusCode === 200) {
            return {
                success: true,
                orders: response.data.items || [],
                total: response.data.total_count || 0
            };
        } else {
            return {
                success: false,
                error: 'Failed to fetch orders'
            };
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Validate Coupon Code
 */
async function validateCoupon(couponCode) {
    try {
        const endpoint = `/coupons/${encodeURIComponent(couponCode)}`;
        
        const response = await makeRequest(endpoint);
        
        if (response.statusCode === 200) {
            return {
                success: true,
                coupon: response.data
            };
        } else {
            return {
                success: false,
                error: 'Invalid coupon code'
            };
        }
    } catch (error) {
        console.error('Error validating coupon:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Create Custom Reward in Magento (Optional)
 */
async function createCustomReward(customerId, rewardData) {
    try {
        // This is a custom endpoint - adjust based on your Magento setup
        const endpoint = `/customers/${customerId}/rewards`;
        
        const response = await makeRequest(endpoint, 'POST', rewardData);
        
        if (response.statusCode === 200 || response.statusCode === 201) {
            return {
                success: true,
                reward: response.data
            };
        } else {
            return {
                success: false,
                error: 'Failed to create reward'
            };
        }
    } catch (error) {
        console.error('Error creating reward:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Main Handler Function
 */
exports.handler = async (event, context) => {
    const startTime = Date.now();
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: ''
        };
    }

    // Check if Magento token is set
    if (!MAGENTO_TOKEN) {
        console.error('❌ MAGENTO_API_TOKEN not set');
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'Server configuration error: Missing API token'
            })
        };
    }

    try {
        // Parse request body
        const body = event.body ? JSON.parse(event.body) : {};
        const { action, email, customerId, couponCode, rewardData } = body;

        let result;

        // Route to appropriate function based on action
        switch (action) {
            case 'getCustomer':
                if (!email) {
                    return {
                        statusCode: 400,
                        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Email is required'
                        })
                    };
                }
                result = await getCustomerByEmail(email);
                break;

            case 'getOrders':
                if (!customerId) {
                    return {
                        statusCode: 400,
                        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Customer ID is required'
                        })
                    };
                }
                result = await getCustomerOrders(customerId);
                break;

            case 'validateCoupon':
                if (!couponCode) {
                    return {
                        statusCode: 400,
                        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Coupon code is required'
                        })
                    };
                }
                result = await validateCoupon(couponCode);
                break;

            case 'createReward':
                if (!customerId || !rewardData) {
                    return {
                        statusCode: 400,
                        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Customer ID and reward data are required'
                        })
                    };
                }
                result = await createCustomReward(customerId, rewardData);
                break;

            default:
                return {
                    statusCode: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Invalid action. Supported: getCustomer, getOrders, validateCoupon, createReward'
                    })
                };
        }

        const duration = Date.now() - startTime;
        console.log(`✅ Request completed in ${duration}ms`);

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...result,
                duration: `${duration}ms`
            })
        };

    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Error after ${duration}ms:`, error);

        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message,
                duration: `${duration}ms`
            })
        };
    }
};
