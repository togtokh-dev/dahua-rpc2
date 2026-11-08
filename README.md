# dahua-rpc2

Node.js / TypeScript client for [Dahua](https://www.dahuasecurity.com/) devices (IP cameras, ANPR / parking and traffic units) over the device **RPC2** protocol. It handles the `global.login` digest-authentication handshake, session keep-alive, common device actions (reboot, screen/voice, parking strobe), and the `RecordFinder` / `RecordUpdater` APIs used to query and manage on-device record sets such as traffic allow-lists.

## Installation

```bash
npm install dahua-rpc2
```

## Quick start

```typescript
import { DahuaRpc } from "dahua-rpc2";

(async () => {
  const dahua = new DahuaRpc("192.168.1.108", "admin", "YOUR_PASSWORD");

  try {
    await dahua.login();                 // digest handshake, stores a session id
    await dahua.keepAlive();             // keep the session alive

    await dahua.setScreenDisplay("Welcome");
    await dahua.setVoiceBroadcast("Gate opening");
    await dahua.openStrobe("Normal");    // raise the barrier / strobe
    await dahua.closeStrobe();
  } catch (error) {
    console.error("Error:", (error as Error).message);
  }
})();
```

JavaScript (CommonJS):

```js
const { DahuaRpc } = require("dahua-rpc2");

const dahua = new DahuaRpc("192.168.1.108", "admin", "YOUR_PASSWORD");
dahua.login().then(() => dahua.keepAlive());
```

## Constructor

```typescript
new DahuaRpc(host: string, username: string, password: string)
```

- `host` — device IP or hostname (requests are sent to `http://<host>/RPC2`).
- `username` / `password` — device credentials.

The instance also exposes a public `idName` field you can set to tag/identify an instance in your own collections:

```typescript
dahua.idName = "gate-01";
```

## DahuaRpc methods

All methods are async and throw an `Error` (with a descriptive message) when the device returns `result: false` or the request fails.

| Method | Description |
| --- | --- |
| `login()` | Performs the `global.login` challenge/response handshake and stores the session id. |
| `keepAlive()` | Sends `global.keepAlive`; resolves to `true` while the session is valid. |
| `setConfig(params)` | Calls `configManager.setConfig` with the given config object. |
| `reboot()` | Reboots the device (`magicBox.reboot`). |
| `setScreenDisplay(text)` | Sets custom text on the device screen (`trafficParking.setScreenDisplay`). |
| `setVoiceBroadcast(text)` | Sets a custom voice-broadcast message (`trafficParking.setVoiceBroadcast`). |
| `testSpaceLight()` | Tests the parking space light (`trafficParking.testSpaceLight`). |
| `openStrobe(openType, plateNumber?)` | Opens the barrier/strobe (`trafficSnap.openStrobe`). |
| `closeStrobe()` | Closes the barrier/strobe (`trafficSnap.closeStrobe`). |
| `RecordUpdater()` | Returns the record-updater helper (see below). |
| `RecordFinder()` | Returns the record-finder helper (see below). |

## RecordFinder

`dahua.RecordFinder()` returns a helper for querying on-device record tables (e.g. `TrafficRedList`). Typical flow: `create` → `startFind` → `doFind` → `destroy`.

```typescript
const finder = dahua.RecordFinder();
const object = await finder.create("TrafficRedList"); // object/factory handle
await finder.startFind({}, object);
const result = await finder.doFind(100, object);
console.log(result.params.found, result.params.records);
await finder.destroy(object);
```

| Method | Signature |
| --- | --- |
| `create` | `(name) => Promise<string>` |
| `startFind` | `(condition, object) => Promise<any>` |
| `doFind` | `(count, object) => Promise<RecordFinderResponse>` |
| `doSeekFind` | `(offset, count, object) => Promise<any>` |
| `stopFind` | `(object) => Promise<any>` |
| `getQuerySize` | `(object) => Promise<any>` |
| `destroy` | `(object) => Promise<void>` |

`RecordFinderResponse` and the `Record` shape (plate number/color, card id, park no, times, etc.) are exported from the package types.

## RecordUpdater

`dahua.RecordUpdater()` returns a helper for creating, inserting, updating, removing and importing/exporting records.

```typescript
const updater = dahua.RecordUpdater();
const instance = await updater.instance("TrafficRedList");
await updater.insert({ PlateNumber: "1234ABC" }, instance);
```

| Method | Signature |
| --- | --- |
| `instance` | `(name) => Promise<{ id: number; result: number; session: string }>` |
| `insert` | `(record, object) => Promise<void>` |
| `update` | `(recno, record, object) => Promise<void>` |
| `remove` | `(recno, object) => Promise<void>` |
| `clear` | `(object) => Promise<void>` |
| `imports` | `(records, object) => Promise<void>` |
| `importFile` / `exportFile` / `exportAsyncFile` | `(filename, format, code, object) => Promise<void>` |
| `getFileImportState` / `getFileImportData` / `getFileExportState` | `(object) => Promise<void>` |
| `getSchema` | `(object) => Promise<void>` |

## Error handling

Every method throws on failure, so wrap calls in `try/catch`:

```typescript
try {
  await dahua.login();
} catch (error) {
  console.error("Login failed:", (error as Error).message);
}
```

## License

ISC
