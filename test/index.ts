import { DahuaRpc } from "../src";

(async () => {
  const password = "loginUser1";
  const dahua = new DahuaRpc("192.168.1.108", "admin", password);
  const list: DahuaRpc[] = []; // Correct type for DahuaRpc instances
  list.push(dahua);
  try {
    const dahuaRpc = list[0];
    // Login to the Dahua device
    await dahuaRpc.login();
    // Get current traffic info
    const keepAlive = await dahuaRpc.keepAlive();
    console.log("keepAlive:", keepAlive);
    const instance = await dahuaRpc.RecordUpdater().instance("TrafficRedList");
    console.log(instance);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
