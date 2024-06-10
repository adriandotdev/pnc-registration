const { validationResult, body } = require("express-validator");

const logger = require("../config/winston");

// Import your SERVICE HERE
const RegistrationService = require("../services/RegistrationService");

// Import MISC HERE
const TokenMiddleware = require("../middlewares/TokenMiddleware");
const {
	ROLES,
	RoleManagementMiddleware,
} = require("../middlewares/RoleManagementMiddleware");

const { HttpUnprocessableEntity } = require("../utils/HttpError");
/**
 * @param {import('express').Express} app
 */
module.exports = (app) => {
	const service = new RegistrationService();
	const tokenMiddleware = new TokenMiddleware();
	const roleMiddleware = new RoleManagementMiddleware();
	/**
	 * This function will be used by the express-validator for input validation,
	 * and to be attached to APIs middleware.
	 * @param {*} req
	 * @param {*} res
	 */
	function validate(req, res) {
		const ERRORS = validationResult(req);

		if (!ERRORS.isEmpty()) {
			throw new HttpUnprocessableEntity(
				"Unprocessable Entity",
				ERRORS.mapped()
			);
		}
	}

	app.post(
		"/registration/api/v1/register",
		[
			tokenMiddleware.BasicTokenVerifier(),
			body("first_name")
				.notEmpty()
				.withMessage("Missing required property: first_name")
				.escape()
				.trim(),
			body("last_name")
				.notEmpty()
				.withMessage("Missing required property: last_name")
				.escape()
				.trim(),
			body("address")
				.notEmpty()
				.withMessage("Missing required property: address")
				.escape()
				.trim(),
			body("contact_number")
				.notEmpty()
				.withMessage("Missing required property: contact_number")
				.escape()
				.trim(),
			body("email_address")
				.notEmpty()
				.withMessage("Missing required property: email_address")
				.escape()
				.trim(),
			body("vehicle_plate_number")
				.notEmpty()
				.withMessage("Missing required property: vehicle_plate_number")
				.escape()
				.trim(),
			body("vehicle_brand")
				.notEmpty()
				.withMessage("Missing required property: vehicle_brand")
				.escape()
				.trim(),
			body("vehicle_model")
				.notEmpty()
				.withMessage("Missing required property: vehicle_model")
				.escape()
				.trim(),
			body("username")
				.notEmpty()
				.withMessage("Missing required property: username")
				.escape()
				.trim(),
		],

		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res, next) => {
			try {
				logger.info({
					REGISTER_USER_DRIVER_REQUEST: {
						data: {
							...req.body,
						},
						message: "SUCCESS",
					},
				});

				validate(req, res);

				const result = await service.Register({ ...req.body });

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				req.error_name = "REGISTER_USER_DRIVER_ERROR";
				next(err);
			}
		}
	);

	app.post(
		"/registration/api/v1/otp/check",
		[
			tokenMiddleware.BasicTokenVerifier(),
			body("user_id")
				.notEmpty()
				.withMessage("Missing required property: user_id")
				.escape()
				.trim(),
			body("otp")
				.notEmpty()
				.withMessage("Missing required property: otp")
				.escape()
				.trim(),
		],

		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res, next) => {
			try {
				const { user_id, otp } = req.body;

				logger.info({
					CHECK_OTP_REQUEST: {
						data: {
							user_id,
							otp,
						},
						message: "SUCCESS",
					},
				});

				validate(req, res);

				const result = await service.CheckOTP({ otp, user_id });

				logger.info({
					CHECK_OTP_RESPONSE: {
						result,
					},
				});

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				req.error_name = "CHECK_OTP_ERROR";
				next(err);
			}
		}
	);

	app.post(
		"/registration/api/v1/otp/resend/:user_id",
		[tokenMiddleware.BasicTokenVerifier()],

		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 */
		async (req, res, next) => {
			try {
				const { user_id } = req.params;

				logger.info({
					RESEND_OTP_REQUEST: {
						data: {
							user_id,
						},
						message: "SUCCESS",
					},
				});

				const result = await service.ResendOTP({ user_id: req.params.user_id });

				logger.info({
					RESEND_OTP_RESPONSE: {
						result,
					},
				});

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				req.error_name = "RESEND_OTP_ERROR";
				next(err);
			}
		}
	);

	app.use((err, req, res, next) => {
		logger.error({
			API_REQUEST_ERROR: {
				error_name: req.error_name || "UNKNOWN_ERROR",
				message: err.message,
				stack: err.stack.replace(/\\/g, "/"), // Include stack trace for debugging
				request: {
					method: req.method,
					url: req.url,
					code: err.status || 500,
				},
				data: err.data || [],
			},
		});

		const status = err.status || 500;
		const message = err.message || "Internal Server Error";

		res.status(status).json({
			status,
			data: err.data || [],
			message,
		});
	});
};
