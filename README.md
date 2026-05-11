# ai-learning-platform-mvp

> "A full-stack AI-driven learning platform (Mini MVP) that generates personalized lessons based on user-selected categories, built with React, Node.js, and PostgreSQL."

---

# פרויקט הערכה: Al-Driven Learning Platform (Mini MVP) 🎓

## 🎯 אודות הפרויקט
[cite_start]יצירת פלטפורמת למידה חכמה המאפשרת למשתמשים לבחור נושאי לימוד (לפי קטגוריה ותת-קטגוריה), לשלוח בקשות (Prompts) לבינה מלאכותית ולקבל שיעורים מותאמים אישית[cite: 9]. [cite_start]המערכת כוללת ניהול היסטוריית למידה וממשק ניהול (Admin)[cite: 10, 37].

[cite_start]פרויקט זה נועד להעריך יכולות בבניית ארכיטקטורה מודולרית, אינטגרציה של API, וסטנדרטים של פיתוח ברמת Production[cite: 11, 75].

---

## 🛠 טכנולוגיות (Stack)
* [cite_start]**Frontend:** React[cite: 30].
* [cite_start]**Backend:** Node.js (REST API)[cite: 14, 17].
* [cite_start]**Database:** PostgreSQL[cite: 16].
* [cite_start]**AI Integration:** OpenAI GPT API[cite: 19].
* [cite_start]**DevOps:** Docker / Docker Compose להרמת מסד הנתונים[cite: 51].

---

## 🏗 דרישות פונקציונליות

### [cite_start]**צד לקוח (Frontend)** [cite: 31]
* [cite_start]**רישום:** רישום משתמשים חדשים[cite: 32].
* [cite_start]**למידה:** בחירת קטגוריה ותת-קטגוריה והזנת בקשה לשיעור[cite: 33, 34].
* [cite_start]**תצוגה:** צפייה בתשובת ה-AI בזמן אמת ובהיסטוריית הלמידה האישית[cite: 35, 36].
* [cite_start]**ניהול (Admin Panel):** דף המציג את כל המשתמשים וכלל הבקשות שנשלחו במערכת[cite: 37].

### [cite_start]**צד שרת (Backend)** [cite: 13]
* [cite_start]בניית שרת RESTful עם נתיבים מובנים (Structured Routes)[cite: 17].
* [cite_start]אימות קלט (Validation) וטיפול בשגיאות API[cite: 53].
* [cite_start]אינטגרציה מלאה עם OpenAI לקבלת תוכן לימודי[cite: 20].

---

## [cite_start]🗄 מבנה נתונים (Schema) [cite: 22]
* [cite_start]**Users:** `id, name, phone`[cite: 23].
* [cite_start]**Categories:** `id, name`[cite: 24].
* [cite_start]**Sub_Categories:** `id, name, category_id`[cite: 25].
* [cite_start]**Prompts:** `id, user_id, category_id, sub_category_id, prompt, response, created_at`[cite: 26, 27].

---

## [cite_start]📂 מבנה הפרויקט (Project Structure) [cite: 43]
הקוד מאורגן בשכבות נפרדות לשמירה על סדר ותחזוקתיות:
* `Routes` - נתיבי ה-API.
* `Controllers` - לוגיקת הטיפול בבקשות.
* `Models` - הגדרת טבלאות וקשרים (PostgreSQL).
* `Services` - לוגיקה עסקית ואינטגרציות חיצוניות (AI).

---

## 🚀 הוראות הרצה (Setup)

### **דרישות מוקדמות**
* Node.js מותקן.
* Docker מותקן (עבור ה-Database).
* מפתח API של OpenAI.


