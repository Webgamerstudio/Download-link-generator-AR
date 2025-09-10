// Configuration for GitHub API
// This file loads configuration from environment variables or defaults

// Environment configuration with fallback to defaults
const ENV_CONFIG = {
    // GitHub Configuration
    GITHUB_USERNAME: 'Webgamerstudio',
    GITHUB_REPO: 'Download-link-generator-AR',
    GITHUB_TOKEN: '', // Will be loaded from .env
    
    // API Configuration
    API_BASE_URL: 'https://api.github.com',
    RAW_BASE_URL: 'https://raw.githubusercontent.com',
    
    // Upload Configuration
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    UPLOAD_PATH: 'apks',
    
    // Ad Configuration (Your existing ads)
    ADS: [
        {
            key: '63718988f07bc6d276f3c6a441757cae',
            format: 'iframe',
            height: 90,
            width: 728,
            src: '//www.highperformanceformat.com/63718988f07bc6d276f3c6a441757cae/invoke.js'
        },
        {
            key: 'c620af328467e6de19dc04af696ee0fb',
            format: 'iframe',
            height: 250,
            width: 300,
            src: '//www.highperformanceformat.com/c620af328467e6de19dc04af696ee0fb/invoke.js'
        },
        {
            key: '78ade24182729fceea8e45203dad915b',
            format: 'iframe',
            height: 50,
            width: 320,
            src: '//www.highperformanceformat.com/78ade24182729fceea8e45203dad915b/invoke.js'
        }
    ]
};

// Function to load environment variables (for use with build tools)
function loadEnvironmentConfig() {
    // This would be replaced by your build tool or server-side script
    return {
        GITHUB_TOKEN: process?.env?.GITHUB_TOKEN || ENV_CONFIG.GITHUB_TOKEN || '',
        GITHUB_USERNAME: process?.env?.GITHUB_USERNAME || ENV_CONFIG.GITHUB_USERNAME,
        GITHUB_REPO: process?.env?.GITHUB_REPO || ENV_CONFIG.GITHUB_REPO
    };
}

// Main configuration object
const CONFIG = {
    ...ENV_CONFIG,
    ...loadEnvironmentConfig()
};

// Function to validate configuration
function validateConfig() {
    const requiredFields = ['GITHUB_USERNAME', 'GITHUB_REPO', 'GITHUB_TOKEN'];
    const missing = requiredFields.filter(field => !CONFIG[field]);
    
    if (missing.length > 0) {
        console.warn('Missing configuration:', missing);
        return false;
    }
    
    return true;
}

// Function to get GitHub API headers
function getGitHubHeaders() {
    return {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'APK-Generator-v2.0'
    };
}

// Function to build GitHub API URL
function buildGitHubURL(path) {
    return `${CONFIG.API_BASE_URL}/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/contents/${path}`;
}

// Function to build raw GitHub URL
function buildRawURL(path) {
    return `${CONFIG.RAW_BASE_URL}/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/main/${path}`;
}

// Function to build GitHub view URL
function buildGitHubViewURL(path) {
    return `https://github.com/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/blob/main/${path}`;
}

// Export configuration (for module systems)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        validateConfig,
        getGitHubHeaders,
        buildGitHubURL,
        buildRawURL,
        buildGitHubViewURL
    };
}

// Make available globally for browser use
window.AppConfig = {
    CONFIG,
    validateConfig,
    getGitHubHeaders,
    buildGitHubURL,
    buildRawURL,
    buildGitHubViewURL
};