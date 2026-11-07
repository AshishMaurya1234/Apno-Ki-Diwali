# Apno Ki Diwali

A responsive, bilingual (Hindi + English) festival-greeting website built with plain HTML, CSS and JavaScript.

## Features

- Personalise a greeting with recipient/family name, sender name and a short personal note.
- Festival choices: Diwali, Holi, Raksha Bandhan, Eid, Christmas, New Year and a general special occasion.
- Three greeting styles: Warm & heartfelt, Traditional blessings, and Short & sweet.
- Choose Hindi, English or bilingual messages.
- Live preview while typing.
- WhatsApp sharing and copyable personalised greeting links.
- Shared links reopen the same festival, names, language and message template.
- Responsive layout for phones, tablets and desktops.
- No login, backend, database, API key or paid service required.

## Project files

```text
apno-ki-diwali/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run on your computer

1. Extract the project folder.
2. Open the folder in Visual Studio Code.
3. Install the **Live Server** extension if you do not already have it.
4. Right-click `index.html` and select **Open with Live Server**.
5. Test the form, preview, greeting modal and WhatsApp button.

You can also open `index.html` directly in a browser. Clipboard and sharing features work best on HTTPS or localhost.

## Publish free with GitHub Pages

### Option A — Upload using GitHub website (no Git command required)

1. Sign in at https://github.com/.
2. Create a new repository named `apno-ki-diwali`.
3. Choose **Public** if you are using GitHub Free and want to publish with GitHub Pages.
4. Open the new repository and choose **Add file → Upload files**.
5. Upload `index.html`, `style.css`, `script.js` and `README.md` (upload the files, not an extra nested folder).
6. Click **Commit changes**.
7. Open **Settings → Pages**.
8. Under **Build and deployment**, choose **Deploy from a branch**.
9. Select branch `main` and folder `/(root)`, then click **Save**.
10. Wait for the Pages deployment to finish. Your site address will look like:
    `https://YOUR-GITHUB-USERNAME.github.io/apno-ki-diwali/`

### Option B — Publish using Git in VS Code

Install Git for Windows from https://git-scm.com/downloads if `git` is not recognised.

Open the project folder in VS Code, then open **Terminal → New Terminal** and run:

```bash
git init
git add .
git commit -m "Create Apno Ki Diwali website"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/apno-ki-diwali.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username. Then follow steps 7–10 from Option A.

If you already added a remote named `origin`, update it instead:

```bash
git remote set-url origin https://github.com/YOUR-GITHUB-USERNAME/apno-ki-diwali.git
git push -u origin main
```

## Updating the live website

After editing files, run:

```bash
git add .
git commit -m "Update Apno Ki Diwali website"
git push
```

GitHub Pages will publish the latest committed version after its deployment completes.

## How personalised links work

The greeting details are encoded into a URL query parameter. There is no database and the website does not collect or send names to a server. Anyone with the personalised link can see the names and note included in it, so avoid adding private or sensitive information.

## Notes

- WhatsApp sharing opens WhatsApp with a prepared message and greeting URL; the visitor still presses Send.
- The share link uses the published website address when opened from the live site. Test sharing after deployment.
- Google Fonts are optional and require an internet connection. Fallback system fonts are included.
- This is a static website. It does not require Node.js, PHP, MySQL or Firebase.
