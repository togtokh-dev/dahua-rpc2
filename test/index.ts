import { DahuaRpc } from "../src";

(async () => {
  const password = "loginUser1";
  const dahua = new DahuaRpc("192.168.1.108", "admin", password);
  dahua.idName = "12321";
  const list: DahuaRpc[] = []; // Correct type for DahuaRpc instances
  list.push(dahua);
  try {
    const dahuaRpc = list.find((e) => e.idName == "12321");
    console.log(dahuaRpc);
    // Login to the Dahua device
    await dahuaRpc?.login();
    // Get current traffic info
    const keepAlive = await dahuaRpc?.keepAlive();
    console.log("keepAlive:", keepAlive);
    const instance = await dahuaRpc?.RecordUpdater().instance("TrafficRedList");
    console.log(instance);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
