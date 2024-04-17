const RegistrationRepository = require("../repository/RegistrationRepository");
const SMS = require("../utils/SMS");
const otpGenerator = require("otp-generator");
const { v4: uuidv4 } = require("uuid");
const Crypto = require("../utils/Crypto");
const { HttpBadRequest } = require("../utils/HttpError");

module.exports = class RegistrationService {
	#repository;

	constructor() {
		this.#repository = new RegistrationRepository();
	}

	async Register(data) {
		// Generate 6-digit OTP
		const otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			specialChars: false,
			lowerCaseAlphabets: false,
			digits: true,
		});

		// Generate RFID
		const rfid = uuidv4().replace(/-/g, "").substring(0, 12).toUpperCase();

		// Encrypt necessary data
		const payload = {
			full_name: Crypto.Encrypt(data.first_name + " " + data.last_name),
			address: Crypto.Encrypt(data.address),
			contact_number: Crypto.Encrypt(data.contact_number),
			email_address: Crypto.Encrypt(data.email_address),
			vehicle_plate_number: Crypto.Encrypt(data.vehicle_plate_number),
			vehicle_brand: Crypto.Encrypt(data.vehicle_brand),
			vehicle_model: Crypto.Encrypt(data.vehicle_model),
			username: data.username,
			otp,
			rfid,
		};

		const result = await this.#repository.Register(payload);

		const STATUS = result[0][0].STATUS;
		const user_id = result[0][0].user_id;

		if (STATUS !== "SUCCESS") throw new HttpBadRequest(STATUS, []);

		const message = `Hello, ${
			data.first_name + " " + data.last_name
		}\n\nYour OTP for ParkNcharge is ${otp}.\n\nUse it to authenticate. If you didn't request this, ignore it.\n\nThanks,\nParkNcharge`;

		// Send SMS
		const sms = new SMS({
			contact_number: data.contact_number,
			message,
		});

		await sms.SendOTP();

		return { STATUS, user_id };
	}

	async CheckOTP(data) {
		// Generate 8-digit OTP
		const password = otpGenerator.generate(8, {
			upperCaseAlphabets: false,
			specialChars: false,
			lowerCaseAlphabets: true,
			digits: true,
		});

		const result = await this.#repository.CheckOTP({ ...data, password });

		const status = result[0][0].STATUS;

		if (status !== "SUCCESS") throw new HttpBadRequest(status, []);

		const mobile_number = Crypto.Decrypt(result[0][0].mobile_number);
		const name = Crypto.Decrypt(result[0][0].name);

		const message = `Hi, ${name}\nYour temporary password is: ${password}.\n\nUse it to log in securely. If you didn't request this, please ignore.\n\nThanks,\nParkNcharge`;

		const sms = new SMS({
			contact_number: mobile_number,
			message,
		});

		await sms.SendOTP();

		return status;
	}

	async ResendOTP(data) {
		const otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			specialChars: false,
			lowerCaseAlphabets: false,
			digits: true,
		});

		const result = await this.#repository.ResendOTP({ ...data, otp });

		const status = result[0][0].STATUS;

		if (status !== "SUCCESS") throw new HttpBadRequest(status, []);

		const mobile_number = Crypto.Decrypt(result[0][0].mobile_number);
		const name = Crypto.Decrypt(result[0][0].name);

		const message = `Hello, ${name}\n\nYour OTP for ParkNcharge is ${otp}.\n\nUse it to authenticate. If you didn't request this, ignore it.\n\nThanks,\nParkNcharge`;

		const sms = new SMS({
			contact_number: mobile_number,
			message,
		});

		await sms.SendOTP();

		return status;
	}
};
