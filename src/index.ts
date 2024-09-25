import axios, { AxiosInstance } from "axios";
import { createHash } from "crypto";
import { RecordUpdater } from "./record-updater";

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
    this.client = axios.create({
      baseURL: `http://${host}`,
    });
  }

  private async request(
    method: string,
    params: any = null,
    objectId: any = null,
    extra: any = null,
    url: string | null = null
  ): Promise<any> {
    this.id += 1;
    const data: any = { method, id: this.id };
    if (params) data["params"] = params;
    if (objectId) data["object"] = objectId;
    if (extra) Object.assign(data, extra);
    if (this.sessionId) data["session"] = this.sessionId;
    if (!url) url = `http://${this.host}/RPC2`;

    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Request to ${url} failed: ${error.message}`);
    }
  }

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
      this.id = 0;
      if (!loginResponse.result) {
        throw new Error(`Login failed: ${JSON.stringify(loginResponse)}`);
      }
    } catch (error) {
      throw new Error(`Login request failed: ${error.message}`);
    }
  }

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

  public RecordUpdater() {
    return RecordUpdater(this.request.bind(this));
  }
}
