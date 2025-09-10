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