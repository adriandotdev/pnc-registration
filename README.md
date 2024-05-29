# Registration API Documentation

This document outlines the endpoints and usage of the Registration API.

## Authentication

All endpoints require authentication using Basic Token.

---

## Endpoints

### 1. Register API

- **URL:** `/registration/api/v1/register`
- **Method:** POST
- **Authentication:** Basic Token
- **Request Body:**
  - `first_name` - First name of the user
  - `last_name` - Last name of the user
  - `address` - Address of the user
  - `contact_number` - Contact number of the user
  - `email_address` - Email address of the user
  - `vehicle_plate_number` - Vehicle plate number
  - `vehicle_brand` - Vehicle brand
  - `vehicle_model` - Vehicle model
  - `username` - Username for registration
- **Description:** Registers a new user.
- **Response:**
  - `status` - HTTP status code
  - `data` - Result data
  - `message` - Success message

---

### 2. OTP Check API

- **URL:** `/registration/api/v1/otp/check`
- **Method:** POST
- **Authentication:** Basic Token
- **Request Body:**
  - `user_id` - User ID
  - `otp` - One-time password (OTP)
- **Description:** Verifies the provided OTP.
- **Response:**
  - `status` - HTTP status code
  - `data` - Result data
  - `message` - Success message

---

### 3. OTP Resend API

- **URL:** `/registration/api/v1/otp/resend/:user_id`
- **Method:** POST
- **Authentication:** Basic Token
- **Parameters:**
  - `:user_id` - User ID
- **Description:** Resends the OTP to the user.
- **Response:**
  - `status` - HTTP status code
  - `data` - Result data
  - `message` - Success message

---

## Error Handling

All endpoints are equipped with error handling middleware. If an error occurs, it will be logged, and an appropriate error response will be sent.
