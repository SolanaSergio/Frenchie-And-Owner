/**
 * Logger class
 * Provides enhanced logging capabilities with consistent formatting
 * and options for different output methods
 */
class Logger {
    /**
     * Constructor
     * @param {Object} options - Configuration options for the logger
     */
    constructor(options = {}) {
        this.options = {
            logToConsole: options.logToConsole !== undefined ? options.logToConsole : true,
            logToElement: options.logToElement !== undefined ? options.logToElement : false,
            logElementId: options.logElementId || 'log-output',
            logLevel: options.logLevel || 'info', // 'debug', 'info', 'warn', 'error'
            timestampFormat: options.timestampFormat || 'HH:MM:SS',
            maxLogEntries: options.maxLogEntries || 100,
            ...options
        };
        
        this.logLevels = {
            'debug': 0,
            'info': 1,
            'warn': 2,
            'error': 3,
            'fatal': 4
        };
        
        this.logs = [];
        this.createLogElement();
        
        // Replace console methods to capture all logs
        if (this.options.interceptConsole) {
            this.interceptConsoleMethods();
        }
        
        this.info('Logger initialized');
    }
    
    /**
     * Format a timestamp according to the configured format
     * @returns {string} Formatted timestamp
     */
    getTimestamp() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}`;
    }
    
    /**
     * Create a log element if it doesn't exist and logToElement is enabled
     */
    createLogElement() {
        if (!this.options.logToElement) return;
        
        let logElement = document.getElementById(this.options.logElementId);
        if (!logElement) {
            logElement = document.createElement('div');
            logElement.id = this.options.logElementId;
            logElement.className = 'log-container';
            logElement.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 400px;
                max-height: 300px;
                background-color: rgba(0, 0, 0, 0.7);
                color: #fff;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                border-radius: 5px;
                overflow-y: auto;
                z-index: 1000;
            `;
            document.body.appendChild(logElement);
            
            // Add header with buttons
            const header = document.createElement('div');
            header.className = 'log-header';
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                padding-bottom: 5px;
                border-bottom: 1px solid #555;
            `;
            
            const title = document.createElement('span');
            title.textContent = 'Debug Log';
            title.style.fontWeight = 'bold';
            
            const buttonsContainer = document.createElement('div');
            
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear';
            clearButton.style.cssText = `
                background-color: #444;
                color: #fff;
                border: none;
                padding: 2px 5px;
                border-radius: 3px;
                cursor: pointer;
                margin-left: 5px;
                font-size: 10px;
            `;
            clearButton.onclick = () => this.clear();
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.cssText = `
                background-color: #444;
                color: #fff;
                border: none;
                padding: 2px 5px;
                border-radius: 3px;
                cursor: pointer;
                margin-left: 5px;
                font-size: 10px;
            `;
            closeButton.onclick = () => {
                logElement.style.display = 'none';
            };
            
            buttonsContainer.appendChild(clearButton);
            buttonsContainer.appendChild(closeButton);
            
            header.appendChild(title);
            header.appendChild(buttonsContainer);
            
            // Add content container
            const content = document.createElement('div');
            content.className = 'log-content';
            
            logElement.appendChild(header);
            logElement.appendChild(content);
        }
    }
    
    /**
     * Intercept console methods to capture all logs
     */
    interceptConsoleMethods() {
        const originalConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error,
            debug: console.debug
        };
        
        console.log = (...args) => {
            originalConsole.log(...args);
            this.log('info', ...args);
        };
        
        console.info = (...args) => {
            originalConsole.info(...args);
            this.info(...args);
        };
        
        console.warn = (...args) => {
            originalConsole.warn(...args);
            this.warn(...args);
        };
        
        console.error = (...args) => {
            originalConsole.error(...args);
            this.error(...args);
        };
        
        console.debug = (...args) => {
            originalConsole.debug(...args);
            this.debug(...args);
        };
        
        // Capture unhandled exceptions
        window.addEventListener('error', (event) => {
            this.fatal('Unhandled error:', event.error || event.message);
            return false;
        });
        
        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled promise rejection:', event.reason);
        });
    }
    
    /**
     * Log a message with a specified level
     * @param {string} level - Log level
     * @param {...any} args - Messages to log
     */
    log(level, ...args) {
        if (this.logLevels[level] < this.logLevels[this.options.logLevel]) {
            return;
        }
        
        const timestamp = this.getTimestamp();
        const logEntry = {
            timestamp,
            level,
            message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ')
        };
        
        this.logs.push(logEntry);
        
        // Trim logs if we have too many
        if (this.logs.length > this.options.maxLogEntries) {
            this.logs.shift();
        }
        
        // Format the log message
        const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${logEntry.message}`;
        
        // Log to console if enabled
        if (this.options.logToConsole) {
            const consoleMethod = this.getConsoleMethod(level);
            consoleMethod(formattedMessage);
        }
        
        // Log to element if enabled
        if (this.options.logToElement) {
            this.appendToLogElement(logEntry);
        }
        
        // Add to server logs if a sendToServer function is provided
        if (this.options.sendToServer && typeof this.options.sendToServer === 'function') {
            this.options.sendToServer(logEntry);
        }
    }
    
    /**
     * Get the appropriate console method for a log level
     * @param {string} level - Log level
     * @returns {Function} Console method
     */
    getConsoleMethod(level) {
        switch (level) {
            case 'debug': return console.debug;
            case 'info': return console.info;
            case 'warn': return console.warn;
            case 'error': 
            case 'fatal': 
                return console.error;
            default: return console.log;
        }
    }
    
    /**
     * Append a log entry to the log element
     * @param {Object} logEntry - Log entry to append
     */
    appendToLogElement(logEntry) {
        const logElement = document.getElementById(this.options.logElementId);
        if (!logElement) return;
        
        const logContent = logElement.querySelector('.log-content');
        const entry = document.createElement('div');
        
        // Set style based on log level
        let levelColor = '#fff'; // default
        switch (logEntry.level) {
            case 'debug': levelColor = '#aaa'; break;
            case 'info': levelColor = '#4caf50'; break;
            case 'warn': levelColor = '#ff9800'; break;
            case 'error': levelColor = '#f44336'; break;
            case 'fatal': levelColor = '#9c27b0'; break;
        }
        
        entry.innerHTML = `<span style="color: #888;">[${logEntry.timestamp}]</span> <span style="color: ${levelColor};">[${logEntry.level.toUpperCase()}]</span> ${logEntry.message}`;
        
        logContent.appendChild(entry);
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    /**
     * Clear all logs
     */
    clear() {
        this.logs = [];
        
        if (this.options.logToElement) {
            const logElement = document.getElementById(this.options.logElementId);
            if (logElement) {
                const logContent = logElement.querySelector('.log-content');
                logContent.innerHTML = '';
            }
        }
        
        if (this.options.logToConsole) {
            console.clear();
        }
        
        this.info('Logs cleared');
    }
    
    /**
     * Log a debug message
     * @param {...any} args - Messages to log
     */
    debug(...args) {
        this.log('debug', ...args);
    }
    
    /**
     * Log an info message
     * @param {...any} args - Messages to log
     */
    info(...args) {
        this.log('info', ...args);
    }
    
    /**
     * Log a warning message
     * @param {...any} args - Messages to log
     */
    warn(...args) {
        this.log('warn', ...args);
    }
    
    /**
     * Log an error message
     * @param {...any} args - Messages to log
     */
    error(...args) {
        this.log('error', ...args);
    }
    
    /**
     * Log a fatal error message
     * @param {...any} args - Messages to log
     */
    fatal(...args) {
        this.log('fatal', ...args);
    }
    
    /**
     * Download logs as a JSON file
     */
    downloadLogs() {
        const data = JSON.stringify(this.logs, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `app-logs-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Make the Logger available globally
window.Logger = Logger; 