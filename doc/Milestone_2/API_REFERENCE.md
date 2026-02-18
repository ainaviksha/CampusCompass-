# API Reference - Milestone 2

Base URL: `http://localhost:8000`

## Authentication

### Login (Get Token)
- **Endpoint**: `POST /auth/token`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body**: `username` (string), `password` (string)
- **Response**: `{ "access_token": "...", "token_type": "bearer" }`

### Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile object.

## Colleges

### List Colleges
- **Endpoint**: `GET /colleges`
- **Query Params**: `skip` (int), `limit` (int)
- **Response**: Array of college objects.

### Get College
- **Endpoint**: `GET /colleges/{id}`
- **Response**: College object.

### Create College (Admin)
- **Endpoint**: `POST /colleges`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: College object JSON.

### Update College (Admin)
- **Endpoint**: `PUT /colleges/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: College object JSON.

### Delete College (Admin)
- **Endpoint**: `DELETE /colleges/{id}`
- **Headers**: `Authorization: Bearer <token>`

### Import Colleges (Bulk)
- **Endpoint**: `POST /colleges/import`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body**: `file` (CSV/Excel)

### Export Colleges
- **Endpoint**: `GET /colleges/export`
- **Response**: CSV file download.
