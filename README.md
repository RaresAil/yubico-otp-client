# @raresail/yubico-otp-client

### An offline Client for Yubico OTP

[![Node.js CI](https://github.com/RaresAil/yubico-otp-client/actions/workflows/node.js.yml/badge.svg)](https://github.com/RaresAil/yubico-otp-client/actions/workflows/node.js.yml)
[![Yarn Audit CI](https://github.com/RaresAil/yubico-otp-client/actions/workflows/audit.yml/badge.svg)](https://github.com/RaresAil/yubico-otp-client/actions/workflows/audit.yml)
[![CodeQL](https://github.com/RaresAil/yubico-otp-client/actions/workflows/codeql.yml/badge.svg)](https://github.com/RaresAil/yubico-otp-client/actions/workflows/codeql.yml)

## Installation

### Yarn

```bash
yarn add @raresail/yubico-otp-client
```

### NPM

```bash
npm install @raresail/yubico-otp-client
```

## Usage

When making the setup for OTP you create a Public ID, a Private ID and a Secret Token.

```ts
import { Token } from '@raresail/yubico-otp-client';

const token = new Token('secret', 'private-id', 'public-id');

token.validateCode('code-0'); // return true or false
token.validateCode('code-0'); // will return false if the same code or an older one is used
```
