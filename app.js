// Main application logic for APK Download Link Generator
// Depends on config.js being loaded first

class APKGenerator {
    constructor() {
        this.selectedFile = null;
        this.config = window.AppConfig.CONFIG;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadRandomAd();
        this.validateConfiguration();
        this.preventUnauthorizedActions();
    }

    setupEventListeners() {
        const apkFile = document.getElementById('apkFile');
        const appName = document.getElementById('appName');
        const generateBtn = document.getElementById('generateBtn');

        apkFile.addEventListener('change', (e) => this.handleFileSelect(e));
        appName.addEventListener('input', () => this.updateGenerateButton());
        generateBtn.addEventListener('click', () => this.uploadToGitHub());
    }

    setupDragAndDrop() {
        const uploadSection = document.getElementById('uploadSection');

        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadSection.classList.add('dragover');
        });

        uploadSection.addEventListener('dragleave', () => {
            uploadSection.classList.remove('dragover');
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadSection.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].name.endsWith('.apk')) {
                document.getElementById('apkFile').files = files;
                this.handleFileSelect({ target: { files: files } });
            } else {
                this.showAlert('Please select an .apk file', 'error');
            }
        });
    }

    validateConfiguration() {
        const tokenStatus = document.getElementById('tokenStatus');
        const configItems = document.querySelectorAll('.config-item');
        
        // Update repository info
        configItems[0].innerHTML = `<strong>Repository:</strong> ${this.config.GITHUB_USERNAME}/${this.config.GITHUB_REPO}`;
        
        if (window.AppConfig.validateConfig()) {
            tokenStatus.textContent = 'Valid ✅';
            tokenStatus.style.color = '#28a745';
        } else {
            tokenStatus.textContent = 'Invalid ❌ - Check .env file';
            tokenStatus.style.color = '#dc3545';
            this.showAlert('⚠️ Configuration incomplete! Please check your .env file and ensure all required variables are set.', 'warning');
        }
    }

    preventUnauthorizedActions() {
        // Prevent copy except for specific elements
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection();
            const selectedElement = selection.anchorNode?.parentElement;
            if (!selectedElement?.closest('.download-link, .github-link, .form-group input')) {
                e.preventDefault();
                this.showAlert('Copying is restricted except for download links and file details!', 'warning');
            }
        });

        // Prevent context menu except for specific elements
        document.addEventListener('contextmenu', (e) => {
            const target = e.target;
            if (!target.closest('.download-link, .github-link, .form-group input')) {
                e.preventDefault();
                this.showAlert('Right-click is disabled except for copyable content!', 'warning');
            }
        });
    }

    loadRandomAd() {
        const adSection = document.getElementById('adSection');
        const randomAd = this.config.ADS[Math.floor(Math.random() * this.config.ADS.length)];

        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.innerHTML = `atOptions = {
            'key': '${randomAd.key}',
            'format': '${randomAd.format}',
            'height': ${randomAd.height},
            'width': ${randomAd.width},
            'params': {}
        };`;

        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = randomAd.src;

        adSection.innerHTML = '';
        adSection.appendChild(script1);
        adSection.appendChild(script2);
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.apk')) {
            this.showAlert('Please select an .apk file', 'error');
            return;
        }

        if (file.size > this.config.MAX_FILE_SIZE) {
            this.showAlert('File size must not exceed 100MB', 'error');
            return;
        }

        this.selectedFile = file;

        // Show file info
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('fileType').textContent = 'Android APK Package';
        
        document.getElementById('fileInfo').classList.add('show');

        // Auto-fill app name
        const appNameInput = document.getElementById('appName');
        if (!appNameInput.value) {
            const cleanName = file.name.replace('.apk', '').replace(/[_-]/g, ' ');
            appNameInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        }

        this.updateGenerateButton();
        this.showAlert('✅ File selected successfully!', 'success');
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generateBtn');
        const isValid = this.selectedFile && window.AppConfig.validateConfig();
        generateBtn.disabled = !isValid;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showAlert(message, type) {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }

    updateProgress(percentage, message) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = message;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showAlert('✅ Text copied successfully!', 'success');
        }).catch(() => {
            this.showAlert('❌ Failed to copy text!', 'error');
        });
    }

    async uploadToGitHub() {
        if (!this.selectedFile) {
            this.showAlert('Please select an APK file', 'error');
            return;
        }

        if (!window.AppConfig.validateConfig()) {
            this.showAlert('❌ Configuration error! Please check your .env file.', 'error');
            return;
        }

        const filename = this.selectedFile.name;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const uniqueFilename = `${timestamp}-${filename}`;
        const uploadPath = `${this.config.UPLOAD_PATH}/${uniqueFilename}`;

        const progressSection = document.getElementById('progressSection');
        const resultSection = document.getElementById('resultSection');
        const generateBtn = document.getElementById('generateBtn');

        progressSection.classList.add('show');
        resultSection.classList.remove('show');
        generateBtn.disabled = true;

        try {
            this.updateProgress(10, 'Preparing file...');

            // Convert file to base64
            const fileContent = await this.fileToBase64(this.selectedFile);
            this.updateProgress(30, 'Connecting to GitHub API...');

            // Upload to GitHub
            const uploadUrl = window.AppConfig.buildGitHubURL(uploadPath);
            
            this.updateProgress(50, 'Uploading to GitHub...');

            const appNameValue = document.getElementById('appName').value;
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                headers: window.AppConfig.getGitHubHeaders(),
                body: JSON.stringify({
                    message: `📱 Upload ${appNameValue || filename} - ${timestamp}`,
                    content: fileContent.split(',')[1], // Remove data URL prefix
                    branch: 'main'
                })
            });

            this.updateProgress(80, 'Finalizing upload...');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API Error: ${errorData.message || 'Unknown error'}`);
            }

            const result = await response.json();
            this.updateProgress(100, '🎉 Upload completed!');

            // Generate download links
            const rawUrl = window.AppConfig.buildRawURL(uploadPath);
            const githubUrl = window.AppConfig.buildGitHubViewURL(uploadPath);
            
            // Display results
            this.displayResults(rawUrl, githubUrl, filename, appNameValue, timestamp);

            // Show results with animation
            setTimeout(() => {
                progressSection.classList.remove('show');
                resultSection.classList.add('show');
                this.showAlert('🎉 APK uploaded to GitHub successfully!', 'success');
                resultSection.scrollIntoView({ behavior: 'smooth' });
            }, 1500);

        } catch (error) {
            console.error('Upload error:', error);
            progressSection.classList.remove('show');
            
            let errorMessage = this.getErrorMessage(error);
            this.showAlert(errorMessage, 'error');
            generateBtn.disabled = false;
        }
    }

    displayResults(rawUrl, githubUrl, filename, appNameValue, timestamp) {
        // Set URLs
        document.getElementById('downloadLink').textContent = rawUrl;
        document.getElementById('githubLink').href = githubUrl;
        document.getElementById('githubLink').textContent = 'View on GitHub';
        
        // Generate HTML code
        const htmlCode = this.generateHTMLCode(rawUrl, filename, appNameValue);
        document.getElementById('htmlCode').textContent = htmlCode;
        
        // Generate file details
        const fileDetails = this.generateFileDetails(filename, appNameValue, timestamp, rawUrl, githubUrl);
        document.getElementById('fileDetails').textContent = fileDetails;
    }

    generateHTMLCode(rawUrl, filename, appNameValue) {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download ${appNameValue || filename}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); }
        .download-container { 
            max-width: 500px; margin: 50px auto; text-align: center; 
            background: white; border-radius: 20px; padding: 30px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
        }
        h1 { color: #333; margin-bottom: 20px; }
        .download-btn { 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            color: white; padding: 15px 30px; text-decoration: none; 
            border-radius: 25px; display: inline-block; font-weight: bold; 
            font-size: 18px; box-shadow: 0 8px 20px rgba(102,126,234,0.3);
            transition: all 0.3s ease;
        }
        .download-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(102,126,234,0.4); }
        .file-info { margin-top: 20px; color: #666; font-size: 14px; }
        .footer { margin-top: 30px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="download-container">
        <h1>📱 ${appNameValue || filename}</h1>
        <a href="${rawUrl}" download="${filename}" class="download-btn">
            ⬇️ Download APK (${this.formatFileSize(this.selectedFile.size)})
        </a>
        <div class="file-info">
            <p><strong>File Size:</strong> ${this.formatFileSize(this.selectedFile.size)}</p>
            <p><strong>Upload Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="footer">
            <p>Powered by GitHub API | APK Generator v2.0</p>
        </div>
    </div>
</body>
</html>`;
    }

    generateFileDetails(filename, appNameValue, timestamp, rawUrl, githubUrl) {
        return `📱 App Name: ${appNameValue || filename}
📁 Original Filename: ${filename}
📊 File Size: ${this.formatFileSize(this.selectedFile.size)}
⏰ Upload Time: ${new Date().toLocaleString()}
🔗 GitHub Repository: ${this.config.GITHUB_USERNAME}/${this.config.GITHUB_REPO}
📂 File Path: /${this.config.UPLOAD_PATH}/${timestamp}-${filename}
🌐 Direct Download URL: ${rawUrl}
👁️ GitHub View URL: ${githubUrl}`;
    }

    getErrorMessage(error) {
        if (error.message.includes('401')) {
            return '🔐 Invalid or expired GitHub token.';
        } else if (error.message.includes('404')) {
            return '📂 Repository not found. Please check the repository name.';
        } else if (error.message.includes('413')) {
            return '📦 File too large. Use a file smaller than 100MB.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            return '🌐 Network error. Please check your internet connection.';
        } else {
            return `Upload error: ${error.message || 'An unknown error occurred'}`;
        }
    }
}

// Global function for copying (called from HTML)
window.copyToClipboard = function(elementId) {
    if (window.apkGenerator) {
        window.apkGenerator.copyToClipboard(elementId);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.apkGenerator = new APKGenerator();
});