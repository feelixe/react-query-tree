import { describe, expect, it } from "bun:test";
import { mutation } from "../mutation";

describe("mutation", () => {
	it("should return a mutationOptions object with the ~type property", () => {
		const options = {
			mutationFn: () => {
				return Promise.resolve({
					id: "123",
				});
			},
		};

		const mutationOptions = mutation(options);
		expect(mutationOptions).toEqual({ ...options, "~type": "mutation" });
	});
});
