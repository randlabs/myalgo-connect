# MyAlgo Connect Change log

## [1.1.1] - 01-09-2021

### Added

- Added new field `extraPages`
- Allow zero fee (Fee polling)

### Known issue

- MyAlgo Connect package still has the `Buffer is not defined` error (#27).

## [1.1.0] - 13-07-2021

### Added

- Added support for algosdk `EncodedTransaction`.
- Added support for signing transactions array with Ledger Nano wallet.
- Now `connect` method will return the account's name.
- Added new warnings for risk transactions.
- Added new error views.
- Added account name in the header on signing popups.
- Added support for rekeyed accounts.

### Updated

- Updated `connect` method arguments.
- New UI interface that includes account list, transaction list, transaction views and warnings views.
- Errors like `Not Allowed` and `Not supported` will be handled by the popup and not by the dApp.
- Improved the signTransaction popup security, now every transaction field will be validated (by its type) and will not allow additional fields.
- Improved popup security, now after receiving the method it will stop receiving data from the dApp.

### Deleted

- Removed support for `signer` field.
- Removed `strictEmptyAddressChecking` field, going forward will always be false.

### Fixed

- Fixed bug on transactions array when the asset does not display the correct amount.
- Fixed bug on invalid transaction the popup went blank (#28).
- Fixed decimals bug.
- Fixed note bug. Now the `note` field must be an Uint8Array (or a base64 string that must be decoded to an Uint8Array type).

### Known issue

- MyAlgo Connect package still has the `Buffer is not defined` error (#27).

## [1.0.1] - 08-03-2021

### Fixes

- Exported SignedTxn (#14).
- Minor fixes

## [1.0.0] - 04-03-2021

- Initial release.
