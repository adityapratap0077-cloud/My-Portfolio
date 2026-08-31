# Aditya Pratap — Portfolio

Client-ready portfolio — AI × Web × Design × Science

## Live Preview
This is built as a single `index.html` file with all assets inlined (best for GitHub Pages).

## How to upload to GitHub (GitHub Pages)

### Option 1: GitHub Pages from main branch (easiest)
1. Create a new repository on GitHub named `portfolio` or `aditya-portfolio`
2. Upload these files:
   - `index.html` (at root)
   - `assets/` folder (contains hero.jpg, about.jpg, contact.jpg, sculpture.jpg, Aditya_Pratap_Resume_5th_Sem.pdf)
3. Go to Settings → Pages → Source: Deploy from a branch → Branch: main / root → Save
4. Your site will be live at `https://yourusername.github.io/portfolio/`

### Option 2: GitHub Pages for adityapratap0077-cloud.github.io
If you want it as your main portfolio site:
1. Create repo named `adityapratap0077-cloud.github.io`
2. Upload `index.html` to root
3. Enable Pages — it will be live at `https://adityapratap0077-cloud.github.io`

### Resume Download
- File: `assets/Aditya_Pratap_Resume_5th_Sem.pdf` (5th Semester, updated)
- The DOWNLOAD RESUME button in the site already points to this file and forces download via JS blob fallback
- On GitHub Pages, it will download correctly because the path is relative: `./assets/Aditya_Pratap_Resume_5th_Sem.pdf`

### Structure
```
/
├── index.html (self-contained, 884KB, images inlined as base64 — works standalone)
└── assets/
    ├── hero.jpg (full-body)
    ├── about.jpg (close-up polo)
    ├── contact.jpg (seated selfie)
    ├── sculpture.jpg (abstract sculpture)
    └── Aditya_Pratap_Resume_5th_Sem.pdf (5th Sem resume)
```

### Edit
- Education is set to 5th Semester (Bundelkhand University, Jhansi)
- Projects: Only 5 verified GitHub projects (CulinaryCore, Aditya-crates, Monumenta-heritage, aiims-biotechnology, RamNayan-Dairy)
- No template sections, no internal notes — clean client-ready

Built with: React + Tailwind + GSAP + Dark red editorial luxury #08080A / #7A1212

Contact: adityapratap0077@gmail.com | Gorakhpur, India | github.com/adityapratap0077-cloud
