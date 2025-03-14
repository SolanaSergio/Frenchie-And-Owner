const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Set port for local development, Vercel will handle ports in production
const PORT = process.env.PORT || 3000;

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.obj': 'model/obj',
    '.mtl': 'model/mtl',
    '.fbx': 'application/octet-stream',
    '.blend': 'application/octet-stream',
    '.mp3': 'audio/mpeg'
};

// Logging configuration
const LOG_CONFIG = {
    // Log levels
    LEVELS: {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    },
    // Current log level (change to filter logs)
    CURRENT_LEVEL: 1, // Set to INFO by default to reduce noise
    // Categories to filter (empty array means log everything)
    FILTERED_CATEGORIES: [],
    // Limit repeated logs
    MAX_REPEATED_LOGS: 3,
    // Group similar logs within this time window (ms)
    LOG_GROUP_WINDOW: 1000,
    // Batch client logs
    BATCH_CLIENT_LOGS: true,
    // Batch size (number of logs)
    BATCH_SIZE: 10,
    // Batch timeout (ms)
    BATCH_TIMEOUT: 500
};

// Track repeated logs
const logHistory = {
    lastLog: null,
    repeatCount: 0,
    lastTimestamp: 0,
    suppressedCount: 0
};

// Client log batching
const clientLogBatch = {
    logs: [],
    timer: null,
    lastFlush: 0
};

// Enhanced logging function
function log(message, level = LOG_CONFIG.LEVELS.INFO, category = 'SERVER') {
    // Skip if below current log level
    if (level < LOG_CONFIG.CURRENT_LEVEL) return;
    
    // Skip if category is filtered
    if (LOG_CONFIG.FILTERED_CATEGORIES.length > 0 && 
        LOG_CONFIG.FILTERED_CATEGORIES.includes(category)) return;
    
    const timestamp = new Date().toISOString();
    const now = Date.now();
    
    // Check for repeated logs
    if (logHistory.lastLog === message && 
        (now - logHistory.lastTimestamp) < LOG_CONFIG.LOG_GROUP_WINDOW) {
        logHistory.repeatCount++;
        logHistory.lastTimestamp = now;
        
        // Only log every few repeats
        if (logHistory.repeatCount > LOG_CONFIG.MAX_REPEATED_LOGS) {
            logHistory.suppressedCount++;
            return;
        }
    } else {
        // If we had suppressed logs, show a summary
        if (logHistory.suppressedCount > 0) {
            const suppressedMsg = `[${timestamp}] [${category}] Last message repeated ${logHistory.suppressedCount} more times`;
            console.log('\x1b[90m%s\x1b[0m', suppressedMsg); // Gray text for suppressed
        }
        
        // Reset tracking
        logHistory.lastLog = message;
        logHistory.repeatCount = 1;
        logHistory.lastTimestamp = now;
        logHistory.suppressedCount = 0;
    }
    
    // Format the log message
    let levelStr = '';
    let colorCode = '';
    
    switch (level) {
        case LOG_CONFIG.LEVELS.DEBUG:
            levelStr = 'DEBUG';
            colorCode = '\x1b[90m'; // Gray
            break;
        case LOG_CONFIG.LEVELS.INFO:
            levelStr = 'INFO';
            colorCode = '\x1b[36m'; // Cyan
            break;
        case LOG_CONFIG.LEVELS.WARN:
            levelStr = 'WARN';
            colorCode = '\x1b[33m'; // Yellow
            break;
        case LOG_CONFIG.LEVELS.ERROR:
            levelStr = 'ERROR';
            colorCode = '\x1b[31m'; // Red
            break;
    }
    
    const logMessage = `[${timestamp}] [${category}] [${levelStr}] ${message}`;
    console.log(`${colorCode}%s\x1b[0m`, logMessage);
}

// Process a batch of client logs
function processClientLogBatch() {
    if (clientLogBatch.logs.length === 0) return;
    
    // Group logs by category
    const groupedLogs = {};
    
    clientLogBatch.logs.forEach(logData => {
        // Extract category if present
        let category = 'CLIENT';
        let message = logData.message;
        
        if (message.includes(':')) {
            const parts = message.split(':');
            if (parts.length >= 2) {
                category = parts[0].trim();
                message = parts.slice(1).join(':').trim();
            }
        }
        
        if (!groupedLogs[category]) {
            groupedLogs[category] = [];
        }
        
        groupedLogs[category].push(message);
    });
    
    // Log each category as a group
    Object.entries(groupedLogs).forEach(([category, messages]) => {
        if (messages.length === 1) {
            // Single message, log normally
            let level = LOG_CONFIG.LEVELS.INFO;
            const message = messages[0];
            
            // Determine log level based on message content
            if (message.includes('ERROR') || message.includes('error')) {
                level = LOG_CONFIG.LEVELS.ERROR;
            } else if (message.includes('WARN') || message.includes('warn')) {
                level = LOG_CONFIG.LEVELS.WARN;
            } else if (message.includes('DEBUG') || message.includes('debug')) {
                level = LOG_CONFIG.LEVELS.DEBUG;
            }
            
            log(message, level, category);
        } else {
            // Multiple messages, log as a group
            log(`Received ${messages.length} logs:`, LOG_CONFIG.LEVELS.INFO, category);
            
            // Log up to 5 messages as examples
            const examples = messages.slice(0, 5);
            examples.forEach((message, index) => {
                let level = LOG_CONFIG.LEVELS.INFO;
                
                // Determine log level based on message content
                if (message.includes('ERROR') || message.includes('error')) {
                    level = LOG_CONFIG.LEVELS.ERROR;
                } else if (message.includes('WARN') || message.includes('warn')) {
                    level = LOG_CONFIG.LEVELS.WARN;
                } else if (message.includes('DEBUG') || message.includes('debug')) {
                    level = LOG_CONFIG.LEVELS.DEBUG;
                }
                
                // Indent example logs
                log(`  ${index + 1}. ${message}`, level, category);
            });
            
            // If there are more messages, show a summary
            if (messages.length > 5) {
                log(`  ... and ${messages.length - 5} more`, LOG_CONFIG.LEVELS.INFO, category);
            }
        }
    });
    
    // Clear the batch
    clientLogBatch.logs = [];
    clientLogBatch.lastFlush = Date.now();
    clientLogBatch.timer = null;
}

// Add a log to the batch
function batchClientLog(logData) {
    clientLogBatch.logs.push(logData);
    
    // Process batch if it's full
    if (clientLogBatch.logs.length >= LOG_CONFIG.BATCH_SIZE) {
        if (clientLogBatch.timer) {
            clearTimeout(clientLogBatch.timer);
        }
        processClientLogBatch();
    } else if (!clientLogBatch.timer) {
        // Start a timer to process the batch if it's not full
        clientLogBatch.timer = setTimeout(processClientLogBatch, LOG_CONFIG.BATCH_TIMEOUT);
    }
}

// Shorthand logging functions
const logDebug = (message, category = 'SERVER') => log(message, LOG_CONFIG.LEVELS.DEBUG, category);
const logInfo = (message, category = 'SERVER') => log(message, LOG_CONFIG.LEVELS.INFO, category);
const logWarn = (message, category = 'SERVER') => log(message, LOG_CONFIG.LEVELS.WARN, category);
const logError = (message, category = 'SERVER') => log(message, LOG_CONFIG.LEVELS.ERROR, category);

// Create textures directory if it doesn't exist
function ensureDirectoriesExist() {
    const directories = [
        path.join(__dirname, 'textures')
    ];
    
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            logInfo(`Creating directory: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Generate a placeholder texture for missing texture files
function generatePlaceholderTexture(type, filename) {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    
    // Default to color texture if type not specified
    const textureType = type || 'color';
    
    switch (textureType) {
        case 'color':
            // Create a checkerboard pattern
            const colors = ['#FF00FF', '#000000']; // Magenta and black for missing textures
            const size = 32;
            
            for (let y = 0; y < canvas.height; y += size) {
                for (let x = 0; x < canvas.width; x += size) {
                    const colorIndex = ((x / size) + (y / size)) % 2;
                    ctx.fillStyle = colors[colorIndex];
                    ctx.fillRect(x, y, size, size);
                }
            }
            
            // Add text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MISSING TEXTURE', canvas.width / 2, canvas.height / 2);
            break;
            
        case 'normal':
            // Fill with neutral normal (128, 128, 255)
            ctx.fillStyle = '#8080FF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
            
        case 'roughness':
            // Fill with medium roughness (128, 128, 128)
            ctx.fillStyle = '#808080';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
            
        case 'displacement':
            // Fill with flat displacement (0, 0, 0)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
            
        default:
            // Default pattern
            ctx.fillStyle = '#FF00FF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Save the texture
    const buffer = canvas.toBuffer('image/jpeg');
    const outputPath = path.join(__dirname, filename);
    
    try {
        // Ensure the directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, buffer);
        logInfo(`Generated placeholder texture: ${filename}`, 'TEXTURE');
        return buffer;
    } catch (error) {
        logError(`Error generating placeholder texture: ${error.message}`, 'TEXTURE');
        return null;
    }
}

// Track request statistics
const stats = {
    startTime: Date.now(),
    requestCount: 0,
    byMethod: {},
    byPath: {},
    byStatus: {},
    errors: 0
};

// Create HTTP server only if not on Vercel
if (!isVercel) {
    // Create server
    const server = http.createServer((req, res) => {
        const requestTime = new Date();
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // Update stats
        stats.requestCount++;
        stats.byMethod[req.method] = (stats.byMethod[req.method] || 0) + 1;
        
        // Group similar paths (for textures and other repeating patterns)
        let statPath = pathname;
        if (pathname.startsWith('/textures/')) {
            const ext = path.extname(pathname);
            const type = pathname.includes('_normal') ? 'normal' :
                        pathname.includes('_roughness') ? 'roughness' :
                        pathname.includes('_displacement') ? 'displacement' : 'color';
            statPath = `/textures/*${ext} (${type})`;
        } else if (pathname.startsWith('/js/')) {
            statPath = '/js/*' + path.extname(pathname);
        }
        
        stats.byPath[statPath] = (stats.byPath[statPath] || 0) + 1;
        
        // Only log non-texture requests at INFO level
        if (!pathname.startsWith('/textures/')) {
            logInfo(`${req.method} ${pathname}`);
        } else {
            logDebug(`${req.method} ${pathname}`, 'REQUEST');
        }
        
        // Define API endpoints first - before attempting to serve files
        if (pathname === '/log' && req.method === 'POST') {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
                
                // Prevent potential DoS attack
                if (body.length > 1e6) {
                    logError('Request body too large, potential DoS attack');
                    req.connection.destroy();
                }
            });
            
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    
                    // Update status stats
                    stats.byStatus['200'] = (stats.byStatus['200'] || 0) + 1;
                    
                    // Send success response immediately
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                    
                    // Handle batched logs
                    if (data.batch && Array.isArray(data.messages)) {
                        // Process batch of logs
                        logDebug(`Received batch of ${data.messages.length} logs`, 'BATCH');
                        
                        // Group logs by category
                        const groupedLogs = {};
                        
                        data.messages.forEach(logData => {
                            // Extract category if present
                            let category = 'CLIENT';
                            let message = logData.message;
                            
                            if (message.includes(':')) {
                                const parts = message.split(':');
                                if (parts.length >= 2) {
                                    category = parts[0].trim();
                                    message = parts.slice(1).join(':').trim();
                                }
                            }
                            
                            if (!groupedLogs[category]) {
                                groupedLogs[category] = [];
                            }
                            
                            groupedLogs[category].push(message);
                        });
                        
                        // Log each category as a group
                        Object.entries(groupedLogs).forEach(([category, messages]) => {
                            if (messages.length === 1) {
                                // Single message, log normally
                                let level = LOG_CONFIG.LEVELS.INFO;
                                const message = messages[0];
                                
                                // Determine log level based on message content
                                if (message.includes('ERROR') || message.includes('error')) {
                                    level = LOG_CONFIG.LEVELS.ERROR;
                                } else if (message.includes('WARN') || message.includes('warn')) {
                                    level = LOG_CONFIG.LEVELS.WARN;
                                } else if (message.includes('DEBUG') || message.includes('debug')) {
                                    level = LOG_CONFIG.LEVELS.DEBUG;
                                }
                                
                                log(message, level, category);
                            } else {
                                // Multiple messages, log as a group
                                log(`Received ${messages.length} logs:`, LOG_CONFIG.LEVELS.INFO, category);
                                
                                // Log up to 5 messages as examples
                                const examples = messages.slice(0, 5);
                                examples.forEach((message, index) => {
                                    let level = LOG_CONFIG.LEVELS.INFO;
                                    
                                    // Determine log level based on message content
                                    if (message.includes('ERROR') || message.includes('error')) {
                                        level = LOG_CONFIG.LEVELS.ERROR;
                                    } else if (message.includes('WARN') || message.includes('warn')) {
                                        level = LOG_CONFIG.LEVELS.WARN;
                                    } else if (message.includes('DEBUG') || message.includes('debug')) {
                                        level = LOG_CONFIG.LEVELS.DEBUG;
                                    }
                                    
                                    // Indent example logs
                                    log(`  ${index + 1}. ${message}`, level, category);
                                });
                                
                                // If there are more messages, show a summary
                                if (messages.length > 5) {
                                    log(`  ... and ${messages.length - 5} more`, LOG_CONFIG.LEVELS.INFO, category);
                                }
                            }
                        });
                    } else {
                        // Process single log
                        const logData = data;
                        
                        // Process the log data
                        if (LOG_CONFIG.BATCH_CLIENT_LOGS) {
                            batchClientLog(logData);
                        } else {
                            // Determine log level based on message content
                            let level = LOG_CONFIG.LEVELS.INFO;
                            let category = 'CLIENT';
                            
                            if (logData.message.includes('ERROR') || logData.message.includes('error')) {
                                level = LOG_CONFIG.LEVELS.ERROR;
                            } else if (logData.message.includes('WARN') || logData.message.includes('warn')) {
                                level = LOG_CONFIG.LEVELS.WARN;
                            } else if (logData.message.includes('DEBUG') || logData.message.includes('debug')) {
                                level = LOG_CONFIG.LEVELS.DEBUG;
                            }
                            
                            // Extract category if present
                            if (logData.message.includes(':')) {
                                const parts = logData.message.split(':');
                                if (parts.length >= 2) {
                                    category = parts[0].trim();
                                    logData.message = parts.slice(1).join(':').trim();
                                }
                            }
                            
                            log(logData.message, level, category);
                        }
                    }
                } catch (e) {
                    logError(`Error parsing log data: ${e.message}`);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid log data' }));
                    
                    // Update error stats
                    stats.errors++;
                    stats.byStatus['400'] = (stats.byStatus['400'] || 0) + 1;
                }
            });
            
            return; // Important to return here so we don't proceed to file handling
        }
        
        // Stats endpoint
        if (pathname === '/server-stats' && req.method === 'GET') {
            const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
            const statsData = {
                uptime: `${uptime} seconds`,
                requests: stats.requestCount,
                byMethod: stats.byMethod,
                topPaths: Object.entries(stats.byPath)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }, {}),
                byStatus: stats.byStatus,
                errors: stats.errors
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(statsData, null, 2));
            
            // Update status stats
            stats.byStatus['200'] = (stats.byStatus['200'] || 0) + 1;
            return;
        }
        
        // If not an API endpoint, then attempt to serve static files
        
        // Handle URL path
        let filePath = pathname === '/' ? 'index.html' : pathname;
        
        // Resolve the file path relative to current directory
        filePath = path.join(__dirname, filePath);
        
        // Get file extension
        const extname = path.extname(filePath).toLowerCase();
        
        // Get content type based on file extension
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';
        
        // Read the file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                // File not found
                if (err.code === 'ENOENT') {
                    // Check if it's a texture file
                    if (pathname.startsWith('/textures/') && extname === '.jpg') {
                        logWarn(`Texture file not found: ${pathname}, generating placeholder`, 'TEXTURE');
                        
                        // Determine texture type from filename
                        let textureType = 'color';
                        if (pathname.includes('_normal')) textureType = 'normal';
                        else if (pathname.includes('_roughness')) textureType = 'roughness';
                        else if (pathname.includes('_displacement')) textureType = 'displacement';
                        
                        // Generate placeholder texture
                        const placeholderContent = generatePlaceholderTexture(textureType, filePath);
                        
                        if (placeholderContent) {
                            res.writeHead(200, { 'Content-Type': contentType });
                            res.end(placeholderContent);
                            
                            // Update status stats
                            stats.byStatus['200'] = (stats.byStatus['200'] || 0) + 1;
                            return;
                        }
                    }
                    
                    logError(`File not found: ${pathname}`);
                    res.writeHead(404);
                    res.end('404 File Not Found');
                    
                    // Update error stats
                    stats.errors++;
                    stats.byStatus['404'] = (stats.byStatus['404'] || 0) + 1;
                } else {
                    // Server error
                    logError(`Server error: ${err.code}`);
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                    
                    // Update error stats
                    stats.errors++;
                    stats.byStatus['500'] = (stats.byStatus['500'] || 0) + 1;
                }
            } else {
                // Success - send file content
                const responseTime = new Date() - requestTime;
                
                // Only log non-texture files at INFO level
                if (!pathname.startsWith('/textures/')) {
                    logInfo(`Served ${pathname} (${content.length} bytes) in ${responseTime}ms`);
                } else {
                    logDebug(`Served ${pathname} (${content.length} bytes) in ${responseTime}ms`, 'FILE');
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
                
                // Update status stats
                stats.byStatus['200'] = (stats.byStatus['200'] || 0) + 1;
            }
        });
    });
    
    // Ensure necessary directories exist
    ensureDirectoriesExist();

    // Print server stats periodically
    setInterval(() => {
        const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
        logInfo(`Server stats - Uptime: ${uptime}s, Requests: ${stats.requestCount}, Errors: ${stats.errors}`);
    }, 60000); // Every minute

    // Start the server
    server.listen(PORT, () => {
        logInfo(`Server running at http://localhost:${PORT}/`);
        logInfo(`Press Ctrl+C to stop the server`);
        logInfo(`Server stats available at http://localhost:${PORT}/server-stats`);
    });
}

// For Vercel, export the request handler function
module.exports = (req, res) => {
    // Handle request (same function used by the HTTP server)
    handleRequest(req, res);
};

// Main request handler function
function handleRequest(req, res) {
    // ... existing request handling code ...
} 