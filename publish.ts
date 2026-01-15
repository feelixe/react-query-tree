import { $ } from "bun";
import semver from "semver";
import packageJson from "./packages/react-query-tree/package.json";

const TAG_MAP = [[/^rc[0-9]+$/, "rc"] as const];
const DEFAULT_TAG = "latest";

async function doesTagAlreadyExist(version: string) {
	try {
		await $`gh api -X GET /repos/{owner}/{repo}/git/ref/tags/v${version}`.quiet();
		return true;
	} catch {
		return false;
	}
}

async function lint() {
	console.info("Linting...");
	await $`bun run lint`;
	await $`bun run format`;
}

async function runTests() {
	console.info("Running tests...");
	await $`bun test`;
}

async function build() {
	console.info("Building...");
	await $`bun run build`;
}

async function publishToNpm(npmTag: string) {
	await $`cd packages/react-query-tree && bun publish --tag ${npmTag}`;
}

async function tagAndPush(version: string) {
	await $`git tag -a v${version} -m "Release version ${version}"`;
	await $`git push origin v${version}`;
}

async function createRelease(version: string, preRelease: boolean) {
	await $`gh release create v${version} --generate-notes ${preRelease ? "--prerelease" : ""}`;
}

function getVersionAndTag(version: string) {
	const parsedVersion = semver.valid(version);
	if (!parsedVersion) {
		throw new Error(`Invalid version: ${version}`);
	}
	const tagString = version.split("-").at(1);
	if (tagString === undefined) {
		return { version: parsedVersion, tag: DEFAULT_TAG };
	}
	const matching = TAG_MAP.find(([regex]) => regex.test(tagString));
	if (matching === undefined) {
		throw new Error(`Invalid tag: ${tagString}`);
	}
	return { version: parsedVersion, tag: matching[1] };
}

const { version: versionString, tag } = await getVersionAndTag(packageJson.version);

const versionIsBusy = await doesTagAlreadyExist(versionString);
if (versionIsBusy) {
	console.error(`Version "${versionString}" already exists`);
	process.exit(1);
}

const isPreRelease = tag !== DEFAULT_TAG;

await lint();
await runTests();
await build();
await tagAndPush(versionString);
await publishToNpm(tag);
await createRelease(versionString, isPreRelease);
