// =================================
// NETLIFY SERVERLESS FUNCTION
// PinkBlue Quizmas 2025
// =================================

const https = require('https');

// Environment Variables
const MAGENTO_TOKEN = process.env.MAGENTO_API_TOKEN || '';
const MAGENTO_BASE_URL = process.env.MAGENTO_BASE_URL || 'https://pinkblue.in/rest/V1';

// CORS Headers
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

/**
 * Make HTTPS Request to Magento API
 */
function makeRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const url = `${MAGENTO_BASE_URL}${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${MAGENTO_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'PB_Netlify_Quizmas'
            },
            timeout: 10000
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: parsed
                    });
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
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
 * Get Customer by Email
 */
async function getCustomerByEmail(email) {
    try {
        const endpoint = `/customers/search?searchCriteria[filterGroups][0][filters][0][field]=email&searchCriteria[filterGroups][0][filters][0][value]=${encodeURIComponent(email)}`;
        
        const response = await makeRequest(endpoint);
        
        if (response.statusCode === 200 && response.data.items && response.data.items.length > 0) {
            const customer = response.data.items[0];
            return {
                success: true,
                customer: {
                    id: customer.id,
                    email: customer.email,
                    firstname: customer.firstname,
                    lastname: customer.lastname
                }
            };
        } else {
            return {
                success: false,
                error: 'Customer not found'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Main Handler
 */
exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: ''
        };
    }

    // Check if token is set
    if (!MAGENTO_TOKEN) {
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'API token not configured'
            })
        };
    }

    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const { action, email } = body;

        let result;

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

            default:
                return {
                    statusCode: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Invalid action'
                    })
                };
        }

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
