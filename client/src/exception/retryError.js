export class RetryError extends Error {
	constructor(message) {
		super(message);
		this.name = "RetryError";
	}
}