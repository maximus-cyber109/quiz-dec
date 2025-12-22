// =================================
// NETLIFY SERVERLESS FUNCTION
// PinkBlue Quizmas 2025
// Magento Customer Validation
// =================================

const https = require('https');

const MAGENTO_TOKEN = process.env.MAGENTO_API_TOKEN || '';
const MAGENTO_BASE_URL = process.env.MAGENTO_BASE_URL || 'https://pinkblue.in/rest/V1';

// FIREWALL BYPASS HEADERS (WHITELISTED)
const FIREWALL_HEADERS = {
    'Authorization': `Bearer ${MAGENTO_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'PB_Netlify',
    'X-Source-App': 'GameOfCrowns',
    'X-Netlify-Secret': 'X-PB-NetlifY2025-901AD7EE35110CCB445F3CA0EBEB1494'
};

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

function makeRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const url = `${MAGENTO_BASE_URL}${endpoint}`;
        
        console.log('📤 Magento API Request:', { url, method });
        console.log('🔐 Using firewall bypass headers');
        
        const options = {
            method,
            headers: FIREWALL_HEADERS,
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
                    console.log('📥 Magento API Response:', { 
                        statusCode: res.statusCode, 
                        dataLength: data.length 
                    });
                    resolve({
                        statusCode: res.statusCode,
                        data: parsed
                    });
                } catch (e) {
                    console.error('❌ Invalid JSON response:', data.substring(0, 200));
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error);
            reject(error);
        });

        req.on('timeout', () => {
            req.abort();
            console.error('❌ Request timeout');
            reject(new Error('Request timeout'));
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

async function getCustomerByEmail(email) {
    try {
        console.log('🔍 Looking up customer:', email);
        
        // Magento 2 customer search endpoint
        const endpoint = `/customers/search?searchCriteria[filterGroups][0][filters][0][field]=email&searchCriteria[filterGroups][0][filters][0][value]=${encodeURIComponent(email)}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`;
        
        const response = await makeRequest(endpoint);
        
        if (response.statusCode === 200 && response.data.items && response.data.items.length > 0) {
            const customer = response.data.items[0];
            console.log('✅ Customer found:', {
                id: customer.id,
                email: customer.email,
                name: `${customer.firstname} ${customer.lastname}`
            });
            
            return {
                success: true,
                customer: {
                    id: customer.id,
                    email: customer.email,
                    firstname: customer.firstname,
                    lastname: customer.lastname,
                    group_id: customer.group_id,
                    created_at: customer.created_at
                }
            };
        } else {
            console.log('⚠️ Customer not found in Magento');
            return {
                success: false,
                error: 'Customer not found'
            };
        }
    } catch (error) {
        console.error('❌ Error getting customer:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

exports.handler = async (event, context) => {
    console.log('🚀 Quiz API Function invoked');
    console.log('📋 Method:', event.httpMethod);
    console.log('🌍 Origin:', event.headers.origin || 'Unknown');
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        console.log('✅ Handling OPTIONS preflight');
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: ''
        };
    }

    // Check if Magento token is configured
    if (!MAGENTO_TOKEN) {
        console.error('❌ MAGENTO_API_TOKEN not configured in environment variables');
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'API token not configured. Please set MAGENTO_API_TOKEN in Netlify environment variables.'
            })
        };
    }

    // Check if base URL is configured
    if (!MAGENTO_BASE_URL) {
        console.error('❌ MAGENTO_BASE_URL not configured');
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'Magento base URL not configured'
            })
        };
    }

    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const { action, email } = body;

        console.log('📦 Request payload:', { action, email: email ? email.substring(0, 3) + '***' : 'N/A' });

        let result;

        switch (action) {
            case 'getCustomer':
                if (!email) {
                    console.error('❌ Email parameter missing');
                    return {
                        statusCode: 400,
                        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Email is required'
                        })
                    };
                }
                
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    console.error('❌ Invalid email format:', email);
                    return {
                        statusCode: 400,
                        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            success: false,
                            error: 'Invalid email format'
                        })
                    };
                }
                
                result = await getCustomerByEmail(email);
                break;

            case 'ping':
                // Health check endpoint
                console.log('✅ Ping received');
                return {
                    statusCode: 200,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: true,
                        message: 'Quiz API is running',
                        timestamp: new Date().toISOString()
                    })
                };

            default:
                console.error('❌ Invalid action:', action);
                return {
                    statusCode: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: false,
                        error: 'Invalid action. Supported actions: getCustomer, ping'
                    })
                };
        }

        console.log('✅ Request completed:', result.success ? 'SUCCESS' : 'FAILED');

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('❌ Handler error:', error.message);
        console.error('Stack:', error.stack);
        
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error: ' + error.message
            })
        };
    }
};
