import { DahuaRpc } from "../src";

(async () => {
  const password = "pass";
  const dahua = new DahuaRpc("0.0.0.0", "user", password);
  dahua.idName = "12321";
  const list: DahuaRpc[] = []; // Correct type for DahuaRpc instances
  list.push(dahua);
  try {
    const dahuaRpc = list.find((e) => e.idName == "12321");
    // console.log(dahuaRpc);
    // Login to the Dahua device
    await dahuaRpc?.login();
    // Get current traffic info
    const keepAlive = await dahuaRpc?.keepAlive();
    console.log("keepAlive:", keepAlive);
    const instance = await dahuaRpc?.RecordUpdater().instance("TrafficRedList");
    //find
    console.log(instance);
    const instanceFind = await dahuaRpc
      ?.RecordFinder()
      .create("TrafficRedList");
    console.log(instanceFind);
    const startFind = await dahuaRpc
      ?.RecordFinder()
      .startFind({}, instanceFind);
    console.log(startFind);
    const cars = await dahuaRpc?.RecordFinder().doFind(100, instanceFind);
    console.log("cars", cars);
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
