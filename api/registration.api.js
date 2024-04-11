const { AccessTokenVerifier } = require("../middlewares/TokenMiddleware"); // Remove this if unused
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
		async (req, res) => {
			try {
				logger.info({
					REGISTER_USER_DRIVER_REQUEST: {
						...req.body,
					},
				});

				validate(req, res);

				const result = await service.Register({ ...req.body });

				return res
					.status(200)
					.json({ status: 200, data: result, message: "Success" });
			} catch (err) {
				logger.error({
					REGISTER_USER_DRIVER_ERROR: {
						err,
						message: err.message,
					},
				});

				return res.status(err.status || 500).json({
					status: err.status || 500,
					data: err.data || [],
					message: err.message || "Internal Server Error",
				});
			}
		}
	);
};
