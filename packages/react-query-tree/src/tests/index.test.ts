import { describe, expect, it } from "bun:test";

describe("index", () => {
	it("should export query, mutation, createCollection and createClient", async () => {
		const module = await import("../index");
		expect(module.query).toBeDefined();
		expect(module.mutation).toBeDefined();
		expect(module.createCollection).toBeDefined();
		expect(module.createClient).toBeDefined();
	});
});
