import { $ } from "bun";
import semver from "semver";
import packageJson from "./packages/react-query-tree/package.json";

async function doesTagAlreadyExist(version: string) {
	try {
		await $`gh api -X GET /repos/{owner}/{repo}/git/ref/tags/v${version}`.quiet();
		return true;
	} catch {
		return false;
	}
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
	return { version: parsedVersion };
}

const { version: versionString } = await getVersionAndTag(packageJson.version);

const versionIsBusy = await doesTagAlreadyExist(versionString);
if (versionIsBusy) {
	console.error(`Version "${versionString}" already exists`);
	process.exit(1);
}

const isPreRelease = packageJson.publishConfig.tag !== "latest";

await tagAndPush(versionString);
await createRelease(versionString, isPreRelease);
