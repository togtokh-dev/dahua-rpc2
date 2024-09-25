export const RecordUpdater = (request: Function) => {
  return {
    imports: async (records: unknown, object: unknown): Promise<void> => {
      const method = "RecordUpdater.import";
      const params = { records };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.import: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.import: ${error.message}`);
      }
    },

    instance: async (
      name: unknown
    ): Promise<{
      id: number;
      result: number;
      session: string;
    }> => {
      const method = "RecordUpdater.factory.instance";
      const params = { name };
      try {
        const response = await request(method, params);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.factory.instance: ${JSON.stringify(
              response
            )}`
          );
        } else {
          return response;
        }
      } catch (error) {
        throw new Error(
          `Error in RecordUpdater.factory.instance: ${error.message}`
        );
      }
    },

    insert: async (record: unknown, object: unknown): Promise<void> => {
      const method = "RecordUpdater.insert";
      const params = { record };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.insert: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.insert: ${error.message}`);
      }
    },

    remove: async (recno: unknown, object: unknown): Promise<void> => {
      const method = "RecordUpdater.remove";
      const params = { recno };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.remove: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.remove: ${error.message}`);
      }
    },

    update: async (
      recno: unknown,
      record: unknown,
      object: unknown
    ): Promise<void> => {
      const method = "RecordUpdater.update";
      const params = { recno, record };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.update: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.update: ${error.message}`);
      }
    },

    clear: async (object: unknown): Promise<void> => {
      const method = "RecordUpdater.clear";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.clear: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.clear: ${error.message}`);
      }
    },

    importFile: async (
      filename: unknown,
      format: unknown,
      code: unknown,
      object: unknown
    ): Promise<void> => {
      const method = "RecordUpdater.importFile";
      const params = { filename, format, code };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.importFile: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.importFile: ${error.message}`);
      }
    },

    exportFile: async (
      filename: unknown,
      format: unknown,
      code: unknown,
      object: unknown
    ): Promise<void> => {
      const method = "RecordUpdater.exportFile";
      const params = { filename, format, code };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.exportFile: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.exportFile: ${error.message}`);
      }
    },

    exportAsyncFile: async (
      filename: unknown,
      format: unknown,
      code: unknown,
      object: unknown
    ): Promise<void> => {
      const method = "RecordUpdater.exportAsyncFile";
      const params = { filename, format, code };
      try {
        const response = await request(method, params, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.exportAsyncFile: ${JSON.stringify(
              response
            )}`
          );
        }
      } catch (error) {
        throw new Error(
          `Error in RecordUpdater.exportAsyncFile: ${error.message}`
        );
      }
    },

    getFileImportState: async (object: unknown): Promise<void> => {
      const method = "RecordUpdater.getFileImportState";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.getFileImportState: ${JSON.stringify(
              response
            )}`
          );
        }
      } catch (error) {
        throw new Error(
          `Error in RecordUpdater.getFileImportState: ${error.message}`
        );
      }
    },

    getFileImportData: async (object: unknown): Promise<void> => {
      const method = "RecordUpdater.getFileImportData";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.getFileImportData: ${JSON.stringify(
              response
            )}`
          );
        }
      } catch (error) {
        throw new Error(
          `Error in RecordUpdater.getFileImportData: ${error.message}`
        );
      }
    },

    getFileExportState: async (object: unknown): Promise<void> => {
      const method = "RecordUpdater.getFileExportState";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.getFileExportState: ${JSON.stringify(
              response
            )}`
          );
        }
      } catch (error) {
        throw new Error(
          `Error in RecordUpdater.getFileExportState: ${error.message}`
        );
      }
    },

    getSchema: async (object: unknown): Promise<void> => {
      const method = "RecordUpdater.getSchema";
      try {
        const response = await request(method, null, object);
        if (!response.result) {
          throw new Error(
            `Failed to RecordUpdater.getSchema: ${JSON.stringify(response)}`
          );
        }
      } catch (error) {
        throw new Error(`Error in RecordUpdater.getSchema: ${error.message}`);
      }
    },
  };
};
