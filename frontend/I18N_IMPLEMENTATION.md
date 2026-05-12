# Multi-Language Support (i18n) Implementation Guide

## Overview
This document describes the multi-language internationalization (i18n) implementation for the AI Learning Platform using `i18next` and `react-i18next`.

## Supported Languages
- **English (en)** - Default language (LTR - Left to Right)
- **Hebrew (he)** - RTL (Right to Left) support

## Setup Components

### 1. i18n Configuration (`frontend/src/i18n.js`)
- Initializes i18next with react-i18next
- Loads translation files for English and Hebrew
- Handles RTL/LTR direction changes
- Persists language selection in localStorage

### 2. Translation Files
- `frontend/src/locales/en.json` - English translations
- `frontend/src/locales/he.json` - Hebrew translations

**Translation Structure:**
```
{
  "navbar": {...},
  "sidebar": {...},
  "dashboard": {...},
  "lessonGenerator": {...},
  "studyHub": {...},
  "common": {...}
}
```

### 3. Language Switcher Component
- Location: `frontend/src/components/LanguageSwitcher.jsx`
- Displays current language with flag emoji
- Toggle button to switch between English and Hebrew
- Positioned at top-right of the application

## Features Implemented

### ✅ Language Toggle
- Click the language button in the top-right corner
- Switches between English (🇺🇸) and Hebrew (🇮🇱)
- Instant language change across the entire app

### ✅ RTL/LTR Support
When Hebrew is selected:
- Page direction automatically changes to RTL
- CSS updates to flip layout (left ↔ right margins, borders, etc.)
- Typography adjusts for proper text alignment

### ✅ Persistence
- Selected language is saved to localStorage (`app-language` key)
- Language selection persists across browser sessions
- Automatically loads saved language on app restart

### ✅ Translated UI Elements
- **Sidebar Navigation** - All menu items and labels
- **Dashboard Headers** - Platform title and descriptions
- **Button Labels** - Summarize, Generate, Save, Clear, etc.
- **Placeholders** - Input and textarea hints
- **Error/Success Messages** - Feedback notifications
- **Form Labels** - Category, Sub-Category, Topic/Prompt
- **Study Hub** - Section headers and descriptions

## Translation Keys Structure

### Common Keys (`common`)
- error, success, loading, close, save, delete, edit, cancel, ok

### Dashboard Keys (`dashboard`)
- aiLearningPlatform, inputText, summarizeButton, generateQuiz, saveMaterial
- materialSaved, pdfUploaded, invalidPDF, fileTooLarge, etc.

### Lesson Generator Keys (`lessonGenerator`)
- lessonGenerator, category, subCategory, topicPrompt
- selectCategoryError, selectSubCategoryError, enterPromptError, etc.

### Sidebar Keys (`sidebar`)
- logo, uploadNew, myLibrary, summarizer, lessonGenerator

### Study Hub Keys (`studyHub`)
- studyHub, reviewMaterialsDescription, studyFeaturesComingSoon

## CSS/RTL Implementation

### RTL Support in CSS
```css
/* LTR (Default) */
.sidebar {
  left: 0;
}

/* RTL */
[dir="rtl"] .sidebar {
  left: auto;
  right: 0;
}
```

### Affected CSS Files
1. `App.css` - Main app layout margins
2. `Sidebar.css` - Sidebar positioning and transforms
3. `Dashboard.css` - Dashboard layout and text alignment
4. `LanguageSwitcher.css` - Language button styling

## Usage in Components

### Using Translations in React Components
```javascript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('sidebar.logo')}</h1>
      <button onClick={() => i18n.changeLanguage('he')}>עברית</button>
    </div>
  );
}
```

### Dynamic Language Change
```javascript
const { i18n } = useTranslation();

// Change language programmatically
i18n.changeLanguage('he'); // Switch to Hebrew
i18n.changeLanguage('en'); // Switch to English
```

## Testing the Implementation

### Manual Testing Checklist
1. **Language Toggle**
   - [ ] Click the language button in top-right
   - [ ] Verify language changes instantly
   - [ ] Check that all text updates

2. **Hebrew (RTL) Testing**
   - [ ] Switch to Hebrew
   - [ ] Verify page direction is RTL
   - [ ] Check sidebar position (should move to right)
   - [ ] Verify text alignment is correct
   - [ ] Check form inputs and buttons

3. **English (LTR) Testing**
   - [ ] Switch to English
   - [ ] Verify page direction is LTR
   - [ ] Check sidebar position (should be on left)
   - [ ] Verify text alignment is correct

4. **Persistence Testing**
   - [ ] Set language to Hebrew
   - [ ] Refresh the browser
   - [ ] Verify language is still Hebrew
   - [ ] Set language to English
   - [ ] Refresh the browser
   - [ ] Verify language is still English

5. **localStorage Verification**
   - [ ] Open browser DevTools (F12)
   - [ ] Go to Application → localStorage
   - [ ] Look for `app-language` key
   - [ ] Value should be either "en" or "he"

## Adding New Translations

### Steps to Add Translations
1. Add key-value pair to `frontend/src/locales/en.json`
2. Add corresponding translation to `frontend/src/locales/he.json`
3. Use in component: `t('namespace.key')`

### Example
**en.json:**
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "button": "Click Me"
  }
}
```

**he.json:**
```json
{
  "myFeature": {
    "title": "כותרת התכונה שלי",
    "button": "לחץ עליי"
  }
}
```

**Component:**
```javascript
const { t } = useTranslation();
return (
  <>
    <h1>{t('myFeature.title')}</h1>
    <button>{t('myFeature.button')}</button>
  </>
);
```

## Files Modified/Created

### Created Files
- ✅ `frontend/src/i18n.js` - i18n configuration
- ✅ `frontend/src/locales/en.json` - English translations
- ✅ `frontend/src/locales/he.json` - Hebrew translations
- ✅ `frontend/src/components/LanguageSwitcher.jsx` - Language toggle component
- ✅ `frontend/src/styles/LanguageSwitcher.css` - Language switcher styles

### Modified Files
- ✅ `frontend/src/main.jsx` - Added i18n import
- ✅ `frontend/src/App.jsx` - Wrapped with I18nextProvider, added LanguageSwitcher
- ✅ `frontend/src/components/Sidebar.jsx` - Integrated translations
- ✅ `frontend/src/components/Dashboard.jsx` - Integrated translations
- ✅ `frontend/src/App.css` - Added RTL support
- ✅ `frontend/src/styles/Sidebar.css` - Added RTL support
- ✅ `frontend/src/styles/Dashboard.css` - Added RTL support
- ✅ `frontend/src/styles/LanguageSwitcher.css` - Added RTL support

## Installed Dependencies
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next

## Browser Support
- Modern browsers with localStorage support
- Chrome/Firefox/Safari/Edge (latest versions)

## Performance Notes
- Translation files are loaded synchronously at app startup
- No additional HTTP requests during language switching
- localStorage is used for instant language persistence
- RTL/LTR switching is immediate with no layout shift

## Future Enhancements
1. Add more languages (Arabic, Spanish, French, etc.)
2. Implement lazy loading for translation files
3. Add language detection based on browser preferences
4. Support for number and date formatting per locale
5. Pluralization support for multiple languages

## Troubleshooting

### Issue: Translation keys showing instead of text
**Solution:** Ensure translation key exists in both en.json and he.json files

### Issue: RTL not applying
**Solution:** Check browser DevTools - verify `dir="rtl"` is set on `<html>` element

### Issue: Language not persisting
**Solution:** Check localStorage is enabled in browser, verify `app-language` key exists

### Issue: Font rendering issues in Hebrew
**Solution:** Font already supports Hebrew (Segoe UI, Tahoma, Geneva, Verdana)

---

**Last Updated:** May 12, 2026
**Version:** 1.0
