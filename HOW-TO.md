# HOW TO: Update Content on This Hugo Site

Welcome! This guide will help you update the content of your Hugo website using **VS Code**. You don’t need to be a programmer—just follow these steps.

---

## 1. Changing Page Content (`content/` folder)

- All your main website content (pages, posts, etc.) lives in the `content/` folder.
- Inside, you’ll find folders like `commercials`, `music-videos`, etc.
- Each folder contains `.md` (Markdown) files. These are the actual pages.

**To edit a page:**
1. In VS Code, open the `content/` folder in the left sidebar.
2. Click on the folder and then the file you want to edit (for example, `content/about/_index.md`).
3. Make your changes in the editor.  
   - Text between `---` lines at the top is page settings (title, date, etc.).
   - Below that is the main content. You can write text, add images, or use simple formatting (like `**bold**` or `*italic*`).

**To add a new page:**
1. Right-click the folder where you want the new page.
2. Choose **New File** and name it (for example, `my-new-page.md`).
3. Copy the format from another file, or ask for a template.

---

## 2. Changing Site Settings (`hugo.toml`)

- The `hugo.toml` file (in the `src/` folder) controls site-wide settings:  
  - Site title, author, colors, fonts, menu, footer, and contact info.

**To update settings:**
1. Open `src/hugo.toml` in VS Code.
2. Find the section you want to change (use the search feature: `Cmd + F`).
   - For example, to change the site title, look for `title = "..."` under `[params.meta]`.
   - To update menu items, look for `[menu]` and `[[menu.main]]`.
   - To change contact info, look for `[[params.contacts]]`.
3. Edit the value after the `=` sign.  
   - Example: `title = "Dri Sommer"` → `title = "Your New Title"`

**Tip:**  
- Save your changes (`Cmd + S`).
- If you’re unsure, ask for help before changing anything you don’t recognize.

---

## 3. Adding or Changing Images (`static/images`)

- All images used on the site are stored in the `static/images` folder.

**To add a new image:**
1. In VS Code, right-click the `static/images` folder.
2. Choose **Reveal in Finder** (or **Open in Explorer** on Windows).
3. Drag and drop your image file into this folder.

**To use the image in your content:**
- In your Markdown file, add:
  ```
  ![Alt text](/images/your-image.jpg)
  ```
  Replace `your-image.jpg` with your file’s name.

**To replace an image:**
- Add a new image with the same name as the old one. It will overwrite the old image.

---

## 4. Previewing Your Changes

To see your changes live:

1. **Open the Terminal in VS Code:**  
   - Go to the top menu: **Terminal > New Terminal**.

2. **Start the Hugo server:**  
   - In the terminal, type:
    change into the src directory
    ```
    cd /Users/drisommer/dev/drisommer.github.io/src
    ```
    and then run this 
     ```
     hugo server -D
     ```
   - Press **Enter**.

3. **Open your browser:**  
   - Visit [http://localhost:1313](http://localhost:1313) to see your site.

4. **Stop the server:**  
   - In the terminal, press `Ctrl + C`.

---

## 5. Useful Terminal Commands

- `ls` — List files and folders in the current directory.
- `cd foldername` — Change to a folder.
- `cd ..` — Go up one folder.
- `pwd` — Show your current location.

---

## Need Help?

If you’re unsure about anything, ask for help or leave a comment in the file. Happy editing!