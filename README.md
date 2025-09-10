# 🚀 APK Download Link Generator

একটি সম্পূর্ণ ওয়েব অ্যাপ্লিকেশন যা GitHub API ব্যবহার করে APK ফাইলের জন্য পার্মানেন্ট ডাউনলোড লিঙ্ক তৈরি করে।

## ✨ Features

- 📱 APK ফাইল আপলোড (Drag & Drop সাপোর্ট)
- 🔗 স্বয়ংক্রিয় ডাউনলোড লিঙ্ক জেনারেশন
- 📋 HTML কোড জেনারেশন
- 📊 ফাইল ডিটেইলস এবং স্ট্যাটিস্টিক্স
- 🎨 রেসপন্সিভ ডিজাইন
- 🔒 সিকিউরিটি প্রোটেকশন (কপি/রাইট ক্লিক প্রিভেনশন)
- 💰 অ্যাড সাপোর্ট

## 📁 প্রজেক্ট স্ট্রাকচার

```
apk-generator/
├── index.html          # মূল HTML ফাইল
├── config.js           # কনফিগারেশন সেটিংস
├── app.js              # মূল অ্যাপ্লিকেশন লজিক
├── .env.example        # এনভায়রনমেন্ট ভেরিয়েবল টেমপ্লেট
├── .gitignore          # Git ignore রুলস
└── README.md           # ডকুমেন্টেশন
```

## 🛠️ Setup Instructions

### ১. প্রজেক্ট ক্লোন করুন
```bash
git clone https://github.com/Webgamerstudio/Download-link-generator-AR.git
cd Download-link-generator-AR
```

### ২. Environment Configuration
```bash
# .env.example কে .env তে কপি করুন
cp .env.example .env

# .env ফাইল এডিট করুন
nano .env
```

### ৩. GitHub Token সেটআপ
1. GitHub এ যান এবং Settings > Developer Settings > Personal Access Tokens > Tokens (classic) এ যান
2. "Generate new token" এ ক্লিক করুন
3. নিচের permissions দিন:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
4. Token কপি করে `.env` ফাইলে `GITHUB_TOKEN` এর মান হিসেবে সেট করুন

### ৪. Repository Configuration
`.env` ফাইলে আপনার GitHub username এবং repository name সেট করুন:
```env
GITHUB_USERNAME=YourUsername
GITHUB_REPO=YourRepositoryName
GITHUB_TOKEN=your_generated_token_here
```

## 🚀 Usage

### Local Development
সরাসরি `index.html` ফাইলটি ব্রাউজারে খুলুন অথবা local server ব্যবহার করুন:

```bash
# Python সার্ভার
python -m http.server 8000

# Node.js সার্ভার (যদি http-server ইনস্টল থাকে)
npx http-server

# অথবা Live Server extension ব্যবহার করুন VS Code এ
```

### Production Deployment

#### GitHub Pages
1. Repository settings এ যান
2. Pages section এ source হিসেবে `main` branch সিলেক্ট করুন
3. আপনার সাইট `https://yourusername.github.io/repositoryname` এ available হবে

#### Netlify
1. Netlify তে নতুন site তৈরি করুন
2. GitHub repository connect করুন
3. Build settings:
   - Build command: (empty)
   - Publish directory: `/`
4. Environment variables সেট করুন

#### Vercel
1. Vercel এ নতুন project তৈরি করুন
2. GitHub repository import করুন
3. Environment variables সেট করুন

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_USERNAME` | GitHub username | `Webgamerstudio` |
| `GITHUB_REPO` | Repository name | `Download-link-generator-AR` |
| `GITHUB_TOKEN` | GitHub personal access token | (required) |
| `MAX_FILE_SIZE` | Maximum file size in bytes | `104857600` (100MB) |
| `UPLOAD_PATH` | Upload directory in repo | `apks` |

### Ad Configuration
`config.js` ফাইলে ad configuration customize করতে পারেন:

```javascript
ADS: [
    {
        key: 'your-ad-key',
        format: 'iframe',
        height: 90,
        width: 728,
        src: '//your-ad-network.com/invoke.js'
    }
]
```

## 📝 File Structure Details

### `index.html`
- মূল user interface
- CSS styling এবং responsive design
- HTML structure এবং DOM elements

### `config.js`
- GitHub API configuration
- Environment variables handling  
- URL builders এবং API helpers

### `app.js`
- Main application logic
- File upload functionality
- GitHub API integration
- Progress tracking এবং error handling

## 🔒 Security Features

- Context menu disable (except for copyable elements)
- Text selection prevention
- Copy protection (শুধুমাত্র download links কপি করা যায়)
- Environment variable protection
- XSS protection

## 📱 Supported File Types

- ✅ APK files (.apk)
- ✅ Maximum size: 100MB
- ❌ Other file types are blocked

## 🐛 Troubleshooting

### Common Issues

**1. "Invalid or expired GitHub token" Error:**
- GitHub token check করুন
- Token এর permissions verify করুন
- Token expire হয়েছে কিনা দেখুন

**2. "Repository not found" Error:**
- Repository name check করুন
- Repository public/private settings দেখুন
- Token এর repo access permissions check করুন

**3. "File too large" Error:**
- File size 100MB এর নিচে রাখুন
- অথবা `MAX_FILE_SIZE` config বাড়ান

**4. Network Errors:**
- Internet connection check করুন
- GitHub API status check করুন
- CORS issues এর জন্য proper server use করুন

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Webgamerstudio**
- GitHub: [@Webgamerstudio](https://github.com/Webgamerstudio)
- Repository: [Download-link-generator-AR](https://github.com/Webgamerstudio/Download-link-generator-AR)

## 🙏 Acknowledgments

- GitHub API for file hosting
- Font Awesome for icons
- CSS Gradients for beautiful styling
- JavaScript File API for file handling

---

**📞 Support:** If you encounter any issues, please create an issue in the GitHub repository.