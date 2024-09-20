import { DahuaRpc } from "../src";

(async () => {
  const password = "loginUser1";
  const dahuaRpc = new DahuaRpc("192.168.1.108", "admin", password);

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
