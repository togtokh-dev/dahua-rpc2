export interface Record {
  BeginTime: string;
  CancelTime: string;
  CardID: string;
  CreateTime: number;
  CustomParkNo: string;
  DepartMent: string;
  Location: number;
  MasterOfCar: string;
  PlateColor: string;
  PlateNumber: string;
  PlateType: string;
  RecNo: number;
  TelephoneNumber: string;
  VehicleColor: string;
  VehicleType: string;
}

export interface RecordFinderResponse {
  id: number;
  params: {
    found: number;
    records: Record[];
  };
  result: boolean;
  session: string;
}
export const RecordFinder = (request: Function) => {
  return {
    create: async (name: unknown): Promise<string> => {
      const method = "RecordFinder.factory.create";
      const params = { name };
      try {
        const response = await request(method, params);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.create: ${JSON.stringify(response)}`
          );
        }
        return response.result;
      } catch (error) {
        throw new Error(`Error in RecordFinder.create: ${error.message}`);
      }
    },

    startFind: async (condition: unknown, object: unknown): Promise<any> => {
      const method = "RecordFinder.startFind";
      const params = { condition };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.startFind: ${JSON.stringify(response)}`
          );
        }
        return response;
      } catch (error) {
        throw new Error(`Error in RecordFinder.startFind: ${error.message}`);
      }
    },

    doFind: async (
      count: unknown,
      object: unknown
    ): Promise<RecordFinderResponse> => {
      const method = "RecordFinder.doFind";
      const params = { count };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.doFind: ${JSON.stringify(response)}`
          );
        }
        return response;
      } catch (error) {
        throw new Error(`Error in RecordFinder.doFind: ${error.message}`);
      }
    },

    stopFind: async (object: unknown): Promise<any> => {
      const method = "RecordFinder.stopFind";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.stopFind: ${JSON.stringify(response)}`
          );
        }
        return response;
      } catch (error) {
        throw new Error(`Error in RecordFinder.stopFind: ${error.message}`);
      }
    },

    doSeekFind: async (
      offset: unknown,
      count: unknown,
      object: unknown
    ): Promise<any> => {
      const method = "RecordFinder.doSeekFind";
      const params = { offset, count };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.doSeekFind: ${JSON.stringify(response)}`
          );
        }
        return response.params;
      } catch (error) {
        throw new Error(`Error in RecordFinder.doSeekFind: ${error.message}`);
      }
    },

    destroy: async (object: unknown): Promise<void> => {
      const method = "RecordFinder.destroy";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.destroy: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordFinder.destroy: ${error.message}`);
      }
    },

    getQuerySize: async (object: unknown): Promise<any> => {
      const method = "RecordFinder.getQuerySize";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordFinder.getQuerySize: ${JSON.stringify(response)}`
          );
        }
        return response.params;
      } catch (error) {
        throw new Error(`Error in RecordFinder.getQuerySize: ${error.message}`);
      }
    },
  };
};
