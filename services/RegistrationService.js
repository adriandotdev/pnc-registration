const RegistrationRepository = require("../repository/RegistrationRepository");
const SMS = require("../utils/SMS");
const otpGenerator = require("otp-generator");
const { v4: uuidv4 } = require("uuid");
const Crypto = require("../utils/Crypto");

module.exports = class RegistrationService {
	#repository;

	constructor() {
		this.#repository = new RegistrationRepository();
	}

	async Register(data) {
		const otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			specialChars: false,
			lowerCaseAlphabets: false,
			digits: true,
		});

		const rfid = uuidv4().replace(/-/g, "").substring(0, 12).toUpperCase();

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

		if (STATUS !== "SUCCESS") throw new HttpBadRequest(STATUS, []);

		console.log(data.contact_number, data.message);

		const sms = new SMS({
			contact_number: data.contact_number,
			message: `Your OTP is ${otp}`,
		});

		await sms.SendOTP();

		return STATUS;
	}
};
