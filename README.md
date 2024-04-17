# Registration Service

## URL

`https://services-parkncharge.sysnetph.com/registration`

## APIs

### POST - `/api/v1/register`

**Description**

Register a new user driver

**Request**

```json
{
	"first_name": "Mikaela",
	"last_name": "Fudolig",
	"address": "TEST address 1",
	"contact_number": "0935*******",
	"email_address": "email@gmail.com",
	"vehicle_plate_number": "8012332",
	"vehicle_brand": "Honda",
	"vehicle_model": "Civic",
	"username": "httpdotjs23"
}
```

**Response**

```json
{
	"status": 200,
	"data": {
		"STATUS": "SUCCESS",
		"user_id": 149
	},
	"message": "Success"
}
```

> NOTE: You can use the `user_id` for verifying the OTP

**Errors**

- **USERNAME_DOES_EXISTS**

---

### POST - `/api/v1/otp/check`

**Description**

Checks if the OTP provided is match to the OTP stored in database.

**Request**

```json
{
	"otp": "392370",
	"user_id": 150
}
```

**Response**

```json
{
	"status": 200,
	"data": "SUCCESS",
	"message": "Success"
}
```

**Errors**

- **INCORRECT_OTP**
- **USER_ID_DOES_NOT_EXISTS**
- **MAXIMUM_ATTEMPTS_HAS_BEEN_REACHED**
- **OTP_DOES_NOT_EXISTS**

---

### POST - `/api/v1/otp/resend/:user_id`

**Description**

Sends new OTP to the user based on ID.

**Parameters**

- **user_id**
  - ID of User
  - Type: Number

**Response**

```json
{
	"status": 200,
	"data": "SUCCESS",
	"message": "Success"
}
```

**Errors**

- **USER_ID_DOES_NOT_EXISTS**
