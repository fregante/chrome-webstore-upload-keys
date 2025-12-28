# chrome-webstore-upload-keys

1. It requests your Google API client ID and client secret
2. It opens a local server to handle the OAuth redirect from Google's servers with an `approvalCode`
3. It uses Google's `oauth2` API to request a `refreshToken`

## Usage

```
npx chrome-webstore-upload-keys
```

Follow the complete instructions at https://github.com/fregante/chrome-webstore-upload-keys

## Demo

![CLI tool demo](https://raw.githubusercontent.com/fregante/chrome-webstore-upload-keys/main/cli/demo.gif)
