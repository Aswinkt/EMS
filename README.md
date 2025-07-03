# Employee Management System (EMS)

A modern Employee Management System with a fully dynamic form engine, built with Django (DRF, JWT) and Angular 19 (Bootstrap UI).

---

## Features

- **Dynamic Forms:** Create and manage custom forms for employee data. Each employee can have different fields based on the form used for their creation.
- **Employee Management:** Add, view, edit, and delete employees with dynamic fields.
- **Authentication:** JWT-based authentication.
- **Modern UI:** Responsive Angular 19 frontend styled with Bootstrap 5.
- **Admin Dashboard:** Sidebar navigation, cards, tables, and icon buttons for a clean, modern experience.


---

## Project Structure

```
EMS/
  ems/                # Django backend
    api/              # API endpoints (v1)
    base/             # Core models, messages, admin
    ems/              # Django project settings
    manage.py         # Django management
  emsUI/              # Angular 19 frontend
    src/app/          # Angular app code
    ...
  requirements.txt    # Python dependencies
  README.md           # This file
  .gitignore          # Comprehensive ignore for macOS, Python, Node, etc.
```

---

## Setup Instructions

### Backend (Django 5.2)

1. **Install dependencies:**
   ```bash
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```
2. **Run migrations:**
   ```bash
   python ems/manage.py makemigrations
   python ems/manage.py migrate
   ```
3. **Create superuser (optional):**
   ```bash
   python ems/manage.py createsuperuser
   ```
4. **Run the backend server:**
   ```bash
   python ems/manage.py runserver
   ```

### Frontend (Angular 19)

1. **Install dependencies:**
   ```bash
   cd emsUI
   npm install

   ```
2. **Run the frontend server:**
   ```bash
   ng serve
   ```
3. **Access the app:**
   - Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## Development Notes

- **API URLs:**
  - Angular uses an `API_URL` injection token for backend calls. 
- **Authentication:**
  - JWT tokens are attached to all requests via an HTTP interceptor.

---
