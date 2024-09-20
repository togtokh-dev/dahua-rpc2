# Dahua RPC Client Library

This is a Node.js library to interact with Dahua devices using the RPC protocol. The library enables communication with Dahua devices such as cameras and parking systems by handling authentication and providing utility methods for device management.

## Installation

To install the package, run:

```bash
npm install dahua-rpc2
```

## Usage

Here is a basic example demonstrating how to use the library to log in and retrieve traffic information.

### Example

```typescript
import { DahuaRpc } from "dahua-rpc2";

(async () => {
  const dahuaRpc = new DahuaRpc("192.168.1.100", "admin", "your_password");

  try {
    // Login to the Dahua device
    await dahuaRpc.login();

    // Get current traffic info
    const trafficInfo = await dahuaRpc.getTrafficInfo();
    console.log("Traffic Information:", trafficInfo);

    // Get current device time
    const currentTime = await dahuaRpc.getCurrentTime();
    console.log("Device Current Time:", currentTime);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
```

### Available Methods

- `login()`: Logs into the device and retrieves a session ID.
- `getProductDefinition()`: Fetches product definitions from the device.
- `keepAlive()`: Sends a keep-alive request to the device to maintain the session.
- `getTrafficInfo()`: Retrieves traffic event information.
- `startFind(objectId)`: Starts a search for traffic events.
- `doFind(objectId)`: Performs a search for traffic events.
- `setConfig(params)`: Sets configuration on the device.
- `reboot()`: Reboots the device.
- `getCurrentTime()`: Gets the current time from the device.
- `ntpSync(address, port, timeZone)`: Synchronizes time with the NTP server.
- `setScreenDisplay(text)`: Sets display text on a connected screen.
- `setVoiceBroadcast(text)`: Sets a voice broadcast message.
- `testSpaceLight()`: Tests the parking space light system.
- `openStrobe(openType, plateNumber)`: Opens the strobe for traffic management.
- `closeStrobe()`: Closes the strobe.

### Error Handling

Each method throws errors if the request fails, providing detailed information about the failure. Use `try/catch` blocks to handle these errors.

```typescript
try {
  await dahuaRpc.login();
} catch (error) {
  console.error("Login failed:", error.message);
}
```

### Contributions

Feel free to contribute by opening issues or submitting pull requests to improve the library.

### License

MIT License.
