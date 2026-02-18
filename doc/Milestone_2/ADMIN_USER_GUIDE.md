# Admin Panel User Guide

Access the Admin Panel at: `http://localhost:5173/admin`

## 1. Logging In
1. Navigate to `/admin/login`.
2. Enter your superuser credentials (default: `admin@example.com` / `password`).
3. Click "Sign In". You will be redirected to the Dashboard.

## 2. Dashboard
The Dashboard provides a quick overview. Currently, it links to "Manage Colleges" and "Bulk Import".

## 3. Managing Colleges
Navigate to "Colleges" via the sidebar or dashboard link.

### 3.1 Viewing Colleges
- The list shows all colleges sorted by insertion order (default).
- You can see the name, location, and type.

### 3.2 Bulk Import
1. Prepare a CSV file with columns matching the data structure (e.g., `id`, `name`, `city`, `state`, `fees`, `topRecruiters`, `lat`, `lng`).
2. Click "Choose File" in the "Bulk Import" section.
3. Select your CSV file.
4. Click "Upload".
5. The system will process the file and show a success message with the count of inserted/updated records.

### 3.3 Deleting a College
1. Locate the college in the list.
2. Click the "Delete" button.
3. Confirm the action in the browser popup.
4. The college will be permanently removed.

### 3.4 Exporting Data
1. Click the "Export CSV" button at the top right.
2. The current database content will be downloaded as `colleges.csv`.
