const mysql = require("../database/mysql");

module.exports = class RegistrationRepository {
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
