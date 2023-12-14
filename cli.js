#!/usr/bin/env node
import process from 'node:process';
import {createServer} from 'node:http';
import * as p from '@clack/prompts';
import {open} from 'openurl';
import getPort from 'get-port';
import pDefer from 'p-defer';

const approvalCode = pDefer();
const port = await getPort();
const localhost = '127.0.0.1';

// TODO: Remove after https://github.com/natemoo-re/clack/issues/181
const tasks = async tasks => {
	for (const task of tasks) {
		if (task.enabled === false) {
			continue;
		}

		const s = p.spinner();
		s.start(task.title);
		// eslint-disable-next-line no-await-in-loop -- Sequential
		const result = await task.task(s.message);
		s.stop(result || task.title);
	}
};

const server = createServer((request, response) => {
	const {searchParams} = new URL(request.url, serverUrl);
	if (searchParams.has('code')) {
		approvalCode.resolve(searchParams.get('code'));
		// Html header
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end('You can close this tab now. <script>window.close()</script>');
		server.close();
		return;
	}

	response.writeHead(400, {'Content-Type': 'text/plain'});
	response.end('No `code` found in the URL. WHO R U?');
});

// Start the server on port 3000
server.listen(port, localhost);

const serverUrl = `http://${localhost}:${port}`;

function required(input) {
	if (input.trim() === '') {
		return 'Required';
	}
}

async function getRefreshToken() {
	const request = await fetch('https://accounts.google.com/o/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams([
			['client_id', group.clientId],
			['client_secret', group.clientSecret],
			['code', code],
			['grant_type', 'authorization_code'],
			['redirect_uri', serverUrl], // Unused but required
		]),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	if (!request.ok) {
		throw new Error('Error while getting the refresh token: ' + request.statusText);
	}

	const response = await request.json();

	if (response.error) {
		throw new Error('Error while getting the refresh token: ' + response.error);
	}

	return response.refresh_token;
}

function getLoginUrl(clientId) {
	const url = new URL('https://accounts.google.com/o/oauth2/auth');
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('access_type', 'offline');
	url.searchParams.set('client_id', clientId);
	url.searchParams.set('scope', 'https://www.googleapis.com/auth/chromewebstore');
	url.searchParams.set('redirect_uri', serverUrl);
	return url.href;
}

p.intro('Follow the steps at this URL to generate the API keys, then enter them below to generate the refresh token.\n   https://github.com/fregante/chrome-webstore-upload-keys');
const group = await p.group(
	{
		// ExtensionId: () => p.text({
		// 	message: 'Extension ID:',
		// 	placeholder: 'e.g. bdeobgpddfaegbjfinhldnkfeieakdaf, it’s in the Chrome Web Store URL',
		// }),
		clientId: () => p.text({
			message: 'Client ID:',
			placeholder: 'e.g. 960453266371-2qcq5fppm3d5e.apps.googleusercontent.com',
			validate: required,
		}),
		clientSecret: () => p.text({
			message: 'Client secret:',
			placeholder: 'e.g. GOCSPX-O9uS1FLnCqXDvru7Y_',
			validate: required,
		}),
		open: () => p.confirm({
			message: 'Open the authentication page in the default browser?',
		}),
	},
	{
		onCancel() {
			p.cancel('Operation cancelled.');
			process.exit(0); // `onCancel` continues to the next question
		},
	},
);

let code;
let refreshToken;
await tasks([
	{
		title: 'Opening the login page in the browser',
		async task() {
			if (group.open) {
				await open(getLoginUrl(group.clientId));
				return 'Page opened';
			}

			return 'Continue in: ' + getLoginUrl(group.clientId);
		},
	},
	{
		title: 'Waiting for you to complete the process in the browser. Follow its steps and warnings (this is your own personal app)',
		async task() {
			code = await approvalCode.promise;
			return 'Approval code received from Google';
		},
	},
	{
		title: 'Asking Google for the refresh token',
		async task() {
			refreshToken = await getRefreshToken();
			return `Done:

CLIENT_ID=${group.clientId}
CLIENT_SECRET=${group.clientSecret}
REFRESH_TOKEN=${refreshToken}
`;
		},
	},
]);
