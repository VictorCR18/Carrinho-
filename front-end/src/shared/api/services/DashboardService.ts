import type { DashboardData } from "../../../types/types";
import { CrudService } from "../adapters/CrudService";
import httpClient from "../adapters/HttpClient";

export class DashboardService extends CrudService<DashboardData> {
  constructor() {
    super("/admin/dashboard");
  }

  async getDados(): Promise<DashboardData> {
    const response = await httpClient.get<DashboardData>("/admin/dashboard");
    return response.data;
  }
}
