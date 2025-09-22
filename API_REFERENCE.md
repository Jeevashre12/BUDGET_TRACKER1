# API Reference Documentation

## User Authentication:
- **POST** `/auth/register` – Register new user
- **POST** `/auth/login` – Login with email & password
- **POST** `/auth/logout` – Logout user
- **POST** `/auth/send-verify-otp` – Send verification OTP (Authenticated)
- **POST** `/auth/verify-account` – Verify user account (Authenticated)
- **GET** `/auth/is-auth` – Check if user is authenticated (Authenticated)
- **POST** `/auth/send-reset-otp` – Send password reset OTP
- **POST** `/auth/reset-password` – Reset password
- **POST** `/auth/google` – Login with Google OAuth

## Recipe APIs:
- **GET** `/recipes/list` – Get all recipes (Public)
- **GET** `/recipes/:id` – Get single recipe details (Public)
- **POST** `/recipes/create` – Create a new recipe (Authenticated, supports image upload)
- **GET** `/recipes/user/my-recipes` – Get recipes created by logged-in user (Authenticated)
- **POST** `/recipes/:id/like` – Like or unlike a recipe (Authenticated)
- **POST** `/recipes/:id/review` – Add a review to a recipe (Authenticated)

## User APIs:
- **GET** `/user/data` – Get logged-in user data (Authenticated)

## Admin APIs:
- **POST** `/admin/login` – Admin login
- **GET** `/admin/user-activity` – Get user login/logout activity (Authenticated, Admin only)

---

This document summarizes the main API endpoints of your project, grouped by feature area. If you want, I can help generate detailed request/response schemas or add example payloads for each endpoint.
