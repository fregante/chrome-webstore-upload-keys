# How to generate Google API keys

> Guide and OAuth helper to generate keys for Chrome Extensions upload

Companion to [Chrome Web Store Upload](https://github.com/fregante/chrome-webstore-upload) to publish extensions.

You can follow this complete guide or the official-but-partial one at: https://developer.chrome.com/docs/webstore/using-api

> [!TIP]
> The names you enter here don't really matter. It's an app that only you will have access to. This will take approximately 10 minutes and Google likes to change these screens often. Sorry.

1. Visit https://console.developers.google.com/apis/credentials
0. Create a project:

	> <img width="772" alt="Google APIs: Create project" src="https://user-images.githubusercontent.com/1402241/77865620-9a8a3680-722f-11ea-99cb-b09e5c0c11ec.png">

0. Enter `chrome-webstore-upload` and **Create**
0. Visit https://console.cloud.google.com/auth/overview
0. Click **Get started**

    > <img width="621" height="514" alt="OAuth Overview" src="https://github.com/user-attachments/assets/0456e23e-a64a-43cf-a9cc-a941cb9d2402">

0. Enter the Application name (e.g. `chrome-webstore-upload`) and required email field

	> <img width="821" height="390" alt="App Information" src="https://github.com/user-attachments/assets/bfe65939-0375-4497-bbf5-c2e9b5bceba7" />

0. Select **Internal**

	> <img width="821" height="393" alt="Audience selection" src="https://github.com/user-attachments/assets/e3fe4fa2-854b-4b07-b35a-41ab32a81d4f" />

0. Fill in any required fields until **Create** becomes available
0. Visit https://console.developers.google.com/apis/library/chromewebstore.googleapis.com
0. Click **Enable**
0. Visit https://console.developers.google.com/apis/credentials
0. Click **Create credentials** > **OAuth client ID**:

	> <img width="771" alt="Create credentials" src="https://user-images.githubusercontent.com/1402241/77865679-e89f3a00-722f-11ea-942d-5245091f22b8.png">

0. Select **Desktop app**, enter `Chrome Webstore Upload` and click **Create**

	> <img width="568" alt="Create OAuth client ID" src="https://user-images.githubusercontent.com/1402241/163124196-c4bb4f26-9766-4766-bb81-3982875d3a84.png">

0. Save your ✅ `clientId` and ✅ `clientSecret`:

	> <img width="554" alt="OAuth client created" src="https://user-images.githubusercontent.com/1402241/228934028-1ef55a41-cc92-4ecf-967a-1984a363c21d.png">

0. Visit https://console.cloud.google.com/apis/credentials/consent
0. Click **PUBLISH APP** and confirm

	> <img width="771" alt="Publish app" src="https://user-images.githubusercontent.com/27696701/114265946-2da2a280-9a26-11eb-9567-c4e00f572500.png">

0. Run this CLI tool to generate the required `refreshToken`

	```sh
	npx chrome-webstore-upload-keys
	```
	or
	```sh
	bunx chrome-webstore-upload-keys
	```
	
	> <img width="771" alt="chrome-webstore-upload-keys demo" src="./demo.gif">

9001. Done. Now you should have ✅ `clientId`, ✅ `clientSecret` and ✅ `refreshToken`. You can use these for all your extensions, but don't share them!

## What the CLI tool does

1. Requests the two keys you have
2. Opens a local server to handle the OAuth redirect from Google's servers with an `approvalCode`
3. Uses Google's `oauth2` API to request a `refreshToken`
