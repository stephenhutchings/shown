# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.2](https://github.com/stephenhutchings/shown/compare/v1.2.1...v1.2.2) (2023-12-07)


### Bug Fixes

* Ensure `smartLabels`, `sorted` values are inherited ([9975427](https://github.com/stephenhutchings/shown/commit/9975427663712138e5d0eecbb68b4852617cf429))

### [1.2.1](https://github.com/stephenhutchings/shown/compare/v1.2.0...v1.2.1) (2023-12-07)


### Bug Fixes

* Inconsistent tag ([9a12401](https://github.com/stephenhutchings/shown/commit/9a12401e909b80aea8e010b29db263ead1c40816))

### [1.1.2](https://github.com/stephenhutchings/shown/compare/v1.1.1...v1.1.2) (2023-12-07)


### Features

* Allow labels on line charts ([837743e](https://github.com/stephenhutchings/shown/commit/837743e804b8830c9b0b71712ed0a0b4e24ded0b))

### [1.1.1](https://github.com/stephenhutchings/shown/compare/v1.1.0...v1.1.1) (2023-04-28)


### Bug Fixes

* Avoid nullish coalescing for Node 14 ([0df8fbd](https://github.com/stephenhutchings/shown/commit/0df8fbd7ef9a40077c729123f131cdc0e0b89581))
* Handle empty mapped x values ([8920ed0](https://github.com/stephenhutchings/shown/commit/8920ed0feb92841e3e5b32d5f41e27bb76940853))
* Node 14 does not support Array.prototype.at ([2ed13ce](https://github.com/stephenhutchings/shown/commit/2ed13ce29da5f9074f988e08a1e2b7cbe317d497))

## [1.1.0](https://github.com/stephenhutchings/shown/compare/v1.0.7...v1.1.0) (2023-04-28)


### Features

* Add area chart ([23b6439](https://github.com/stephenhutchings/shown/commit/23b64394a604a09a783832fc1377e683c977358d))
* Move utils to modules for better minification ([43e846a](https://github.com/stephenhutchings/shown/commit/43e846a110bb8592b73b3eb7faefb9a185d1a5df))
* Pixel-perfect axis lines ([3524764](https://github.com/stephenhutchings/shown/commit/35247646f76a0b2672ac1f5a472bb6a4abb7f8b4))
* Skip unneeded intermediate step path commands ([a95c472](https://github.com/stephenhutchings/shown/commit/a95c4720361b3e167832e4dd035849310eb8d715))

### [1.0.7](https://github.com/stephenhutchings/shown/compare/v1.0.6...v1.0.7) (2023-03-18)


### Features

* Returning true for label uses default method ([081fd6a](https://github.com/stephenhutchings/shown/commit/081fd6ae189886022f10ab4890186eb1a6cd9907))


### Bug Fixes

* Mapped bar methods receive incorrect indices ([8c30fb2](https://github.com/stephenhutchings/shown/commit/8c30fb2a5430c30901169cc8e86cddef4c7a7684))
* Publish types to NPM ([716a413](https://github.com/stephenhutchings/shown/commit/716a41337e98bc4915acc59b8356279896135741))

### [1.0.6](https://github.com/stephenhutchings/shown/compare/v1.0.5...v1.0.6) (2023-03-16)


### Features

* Add new symbol type "asterisk" ([fa4bf4d](https://github.com/stephenhutchings/shown/commit/fa4bf4de90e95cd71d377bcd20c55a60246077e8))


### Bug Fixes

* [#3](https://github.com/stephenhutchings/shown/issues/3) Convert hit area to circle ([5f50e0c](https://github.com/stephenhutchings/shown/commit/5f50e0c45e3fa0f37bbd7bf5a25af248b4c6e8c1))
* Firefox requires class to apply scoping to shadow root ([2cf5e92](https://github.com/stephenhutchings/shown/commit/2cf5e9265f8361bdee1b97d75fc2702dfa1407e8))

### [1.0.5](https://github.com/stephenhutchings/shown/compare/v1.0.4...v1.0.5) (2023-03-15)


### Features

* Add transparent touch area around symbols ([0a49a8b](https://github.com/stephenhutchings/shown/commit/0a49a8b0691ecfe59ecc2b7f05b14dfbfefbd1f7))

### [1.0.4](https://github.com/stephenhutchings/shown/compare/v1.0.3...v1.0.4) (2023-03-14)


### Bug Fixes

* Publish includes compiled library ([fd2d9d8](https://github.com/stephenhutchings/shown/commit/fd2d9d892461d9c779c0f6e7c7068298e2f8bb6a))
* Use data to determine series length ([1e989e9](https://github.com/stephenhutchings/shown/commit/1e989e9e38770d1a4e6278667bfbe992730d5759))

### [1.0.3](https://github.com/stephenhutchings/shown/compare/v1.0.2...v1.0.3) (2023-03-13)


### Bug Fixes

* Re-add preinstall to create CommonJS entry ([b780c75](https://github.com/stephenhutchings/shown/commit/b780c75b82cc1541b71749855b269b2888b0fa8d))
* Single bar chart item renders with no width ([2e1be82](https://github.com/stephenhutchings/shown/commit/2e1be821441e6b207d84aeab2cae18b435854540))

### [1.0.2](https://github.com/stephenhutchings/shown/compare/v1.0.1...v1.0.2) (2023-03-13)


### Bug Fixes

* Safari doesn't honour fill colour inheritance ([1141692](https://github.com/stephenhutchings/shown/commit/11416922e18f3438a3049b74ce8dd5df15d188f7))
* Single values should still include grid line ([b7843e7](https://github.com/stephenhutchings/shown/commit/b7843e7739e07e5f020c52774c929c6a5a050e2c))
