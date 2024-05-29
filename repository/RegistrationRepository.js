const mysql = require("../database/mysql");

module.exports = class RegistrationRepository {
	/**
	 * Registers a user with the provided data by calling a stored procedure in the database.
	 *
	 * @param {Object} data - User registration data.
	 * @param {string} data.full_name - User's full name.
	 * @param {string} data.address - User's address.
	 * @param {string} data.contact_number - User's contact number.
	 * @param {string} data.email_address - User's email address.
	 * @param {string} data.vehicle_plate_number - Vehicle's plate number.
	 * @param {string} data.vehicle_brand - Vehicle's brand.
	 * @param {string} data.vehicle_model - Vehicle's model.
	 * @param {string} data.username - User's desired username.
	 * @param {string} data.otp - OTP generated for the user.
	 * @param {string} data.rfid - RFID generated for the user.
	 * @returns {Promise<any>} Result of the user registration process.
	 */
	Register(data) {
		const QUERY = `CALL WEB_USER_REGISTER_DRIVER(?,?,?,?,?,?,?,?,?,?)`;

		return new Promise((resolve, reject) => {
			mysql.query(
				QUERY,
				[
					data.full_name,
					data.address,
					data.contact_number,
					data.email_address,
					data.vehicle_plate_number,
					data.vehicle_brand,
					data.vehicle_model,
					data.username,
					data.otp,
					data.rfid,
				],
				(err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				}
			);
		});
	}

	/**
	 * Checks the OTP for user registration by calling a stored procedure in the database.
	 *
	 * @param {Object} data - Data for OTP verification.
	 * @param {string} data.user_id - User's ID.
	 * @param {string} data.otp - OTP to be checked.
	 * @param {string} data.password - User's password.
	 * @returns {Promise<any>} Result of the OTP verification process.
	 */
	CheckOTP(data) {
		const QUERY = `CALL WEB_USER_CHECK_OTP_REGISTRATION(?,?,?)`;

		return new Promise((resolve, reject) => {
			mysql.query(
				QUERY,
				[data.user_id, data.otp, data.password],
				(err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				}
			);
		});
	}

	/**
	 * Resends the OTP for user registration by calling a stored procedure in the database.
	 *
	 * @param {Object} data - Data for OTP resend.
	 * @param {string} data.user_id - User's ID.
	 * @param {string} data.otp - OTP to be resent.
	 * @returns {Promise<any>} Result of the OTP resend process.
	 */
	ResendOTP(data) {
		const QUERY = `CALL WEB_USER_RESEND_REGISTRATION_OTP(?,?)`;

		return new Promise((resolve, reject) => {
			mysql.query(QUERY, [data.user_id, data.otp], (err, result) => {
				if (err) {
					reject(err);
				}

				resolve(result);
			});
		});
	}
};
