import { describe, expect, it } from "bun:test";
import { query } from "../query";

describe("query", () => {
	it("should return a queryOptions object with the ~type property", () => {
		const options = {
			queryFn: () => {
				return {
					id: "123",
				};
			},
		};

		const queryOptions = query(options);
		expect(queryOptions).toEqual({ ...options, "~type": "query" });
	});
});
