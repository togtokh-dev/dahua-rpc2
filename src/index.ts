import axios, { AxiosInstance } from "axios";
import { createHash } from "crypto";

export class DahuaRpc {
  private host: string;
  private username: string;
  private password: string;
  private sessionId: string | null;
  private id: number;
  private client: AxiosInstance;

  constructor(host: string, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.sessionId = null;
    this.id = 0;
    // Create Axios instance with the base URL
    this.client = axios.create({
      baseURL: `http://${host}`,
    });
  }

  // Utility function to send RPC requests to the device
  private async request(
    method: string,
    params: any = null,
    objectId: any = null,
    extra: any = null,
    url: string | null = null
  ): Promise<any> {
    this.id += 1; // Increment the request ID
    const data: any = { method, id: this.id };

    if (params) data["params"] = params; // Add parameters if present
    if (objectId) data["object"] = objectId; // Include object ID if provided
    if (extra) Object.assign(data, extra); // Merge any extra data into the request
    if (this.sessionId) data["session"] = this.sessionId; // Add session ID if available

    // Default URL for RPC requests if not provided
    if (!url) url = `http://${this.host}/RPC2`;

    console.log(data); // Debug log the request
    try {
      const response = await this.client.post(url, data); // Send POST request
      return response.data;
    } catch (error) {
      throw new Error(`Request to ${url} failed: ${error.message}`); // Throw error with detailed message
    }
  }

  // Login function to authenticate with the device
  public async login(): Promise<void> {
    const url = `http://${this.host}/RPC2_Login`;
    const method = "global.login";
    const params = {
      userName: this.username,
      password: "",
      clientType: "Web3.0",
    };

    try {
      const response = await this.request(method, params, null, null, url);
      this.sessionId = response.session;
      const realm = response.params.realm;
      const random = response.params.random;

      // MD5 hash for password
      const pwdPhrase = `${this.username}:${realm}:${this.password}`;
      const pwdHash = createHash("md5")
        .update(pwdPhrase)
        .digest("hex")
        .toUpperCase();

      const passPhrase = `${this.username}:${random}:${pwdHash}`;
      const passHash = createHash("md5")
        .update(passPhrase)
        .digest("hex")
        .toUpperCase();

      // Login with hashed password
      const loginParams = {
        userName: this.username,
        password: passHash,
        clientType: "Web3.0",
        authorityType: "Default",
        passwordType: "Default",
      };

      const loginResponse = await this.request(
        method,
        loginParams,
        null,
        null,
        url
      );
      this.sessionId = loginResponse.session;
      if (!loginResponse.result) {
        throw new Error(`Login failed: ${JSON.stringify(loginResponse)}`);
      } else {
        console.log("loginResponse", loginResponse);
      }
    } catch (error) {
      throw new Error(`Login request failed: ${error.message}`);
    }
  }

  // Method to retrieve product definition
  public async getProductDefinition(): Promise<void> {
    const method = "magicBox.getProductDefinition";
    const params = { name: "Traffic" };

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(
          `Failed to get product definition: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      throw new Error(`Error in getProductDefinition: ${error.message}`);
    }
  }

  // Keep alive method to maintain the session
  public async keepAlive(): Promise<boolean> {
    const params = { timeout: 300, active: false };
    const method = "global.keepAlive";

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(`Failed to keep alive: ${JSON.stringify(response)}`);
      }
      return true;
    } catch (error) {
      throw new Error(`Error in keepAlive: ${error.message}`);
    }
  }

  // Method to retrieve traffic information
  public async getTrafficInfo(): Promise<any> {
    const method = "RecordFinder.factory.create";
    const params = { name: "TrafficSnapEventInfo" };

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(
          `Failed to get traffic info: ${JSON.stringify(response)}`
        );
      }
      return response.result;
    } catch (error) {
      throw new Error(`Error in getTrafficInfo: ${error.message}`);
    }
  }

  // Start searching for traffic events
  public async startFind(objectId: any): Promise<void> {
    const method = "RecordFinder.startFind";
    const params = {
      condition: {
        Time: ["<>", 1558925818, 1559012218],
      },
    };

    try {
      const response = await this.request(method, params, objectId);

      if (!response.result) {
        throw new Error(`Failed to start find: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw new Error(`Error in startFind: ${error.message}`);
    }
  }

  // Perform search for traffic events
  public async doFind(objectId: any): Promise<any> {
    const method = "RecordFinder.doFind";
    const params = { count: 50000 };

    try {
      const response = await this.request(method, params, objectId);

      if (!response.result) {
        throw new Error(`Failed to perform find: ${JSON.stringify(response)}`);
      }
      return response;
    } catch (error) {
      throw new Error(`Error in doFind: ${error.message}`);
    }
  }

  // Set configuration on the device
  public async setConfig(params: any): Promise<void> {
    const method = "configManager.setConfig";

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(`Failed to set config: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw new Error(`Error in setConfig: ${error.message}`);
    }
  }

  // Reboot the device
  public async reboot(): Promise<void> {
    const method = "magicBox.factory.instance";

    try {
      const response = await this.request(method);
      const objectId = response.result;

      const rebootMethod = "magicBox.reboot";
      const rebootResponse = await this.request(rebootMethod, null, objectId);

      if (!rebootResponse.result) {
        throw new Error(`Failed to reboot: ${JSON.stringify(rebootResponse)}`);
      }
    } catch (error) {
      throw new Error(`Error in reboot: ${error.message}`);
    }
  }

  // Method to get the current time from the device
  public async getCurrentTime(): Promise<string> {
    const method = "global.getCurrentTime";

    try {
      const response = await this.request(method);

      if (!response.result) {
        throw new Error(
          `Failed to get current time: ${JSON.stringify(response)}`
        );
      }
      return response.params.time;
    } catch (error) {
      throw new Error(`Error in getCurrentTime: ${error.message}`);
    }
  }

  // Synchronize time with NTP server
  public async ntpSync(
    address: string,
    port: number,
    timeZone: string
  ): Promise<void> {
    const method = "netApp.factory.instance";

    try {
      const response = await this.request(method);
      const objectId = response.result;

      const syncMethod = "netApp.adjustTimeWithNTP";
      const params = { Address: address, Port: port, TimeZone: timeZone };
      const syncResponse = await this.request(syncMethod, params, objectId);

      if (!syncResponse.result) {
        throw new Error(
          `Failed to synchronize with NTP: ${JSON.stringify(syncResponse)}`
        );
      }
    } catch (error) {
      throw new Error(`Error in ntpSync: ${error.message}`);
    }
  }

  // Set display mode on the screen
  public async setScreenDisplay(text: string): Promise<void> {
    const method = "trafficParking.setScreenDisplay";
    const params = { Custom: text };

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(
          `Failed to set screen display: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      throw new Error(`Error in setScreenDisplay: ${error.message}`);
    }
  }

  // Set voice broadcast message
  public async setVoiceBroadcast(text: string): Promise<void> {
    const method = "trafficParking.setVoiceBroadcast";
    const params = { Custom: text };

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(
          `Failed to set voice broadcast: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      throw new Error(`Error in setVoiceBroadcast: ${error.message}`);
    }
  }

  // Test the parking space light
  public async testSpaceLight(): Promise<void> {
    const method = "trafficParking.testSpaceLight";
    const params = { LightNo: 1, Color: "Red", State: 2 };

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(
          `Failed to test space light: ${JSON.stringify(response)}`
        );
      }
    } catch (error) {
      throw new Error(`Error in testSpaceLight: ${error.message}`);
    }
  }

  // Open the strobe for traffic management
  public async openStrobe(
    openType: string,
    plateNumber?: string
  ): Promise<void> {
    const method = "trafficSnap.openStrobe";
    const params = {
      info: {
        openType: openType,
        plateNumber: plateNumber || "",
      },
    };

    try {
      const response = await this.request(method, params);

      if (!response.result) {
        throw new Error(`Failed to open strobe: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw new Error(`Error in openStrobe: ${error.message}`);
    }
  }

  // Close the strobe
  public async closeStrobe(): Promise<void> {
    const method = "trafficSnap.closeStrobe";

    try {
      const response = await this.request(method);

      if (!response.result) {
        throw new Error(`Failed to close strobe: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw new Error(`Error in closeStrobe: ${error.message}`);
    }
  }
}
