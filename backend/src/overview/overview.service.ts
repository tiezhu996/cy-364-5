import { Injectable } from "@nestjs/common";
import { overviewData } from "./overview.data";
import type { OperationRecord, KpiItem } from "./overview.data";

@Injectable()
export class OverviewService {
  getOverview(owner?: string, priority?: string) {
    let records = [...overviewData.records] as OperationRecord[];

    if (owner) {
      records = records.filter(r => r.owner === owner);
    }
    if (priority) {
      records = records.filter(r => r.priority === priority);
    }

    const pendingRecords = records.filter(r => 
      r.status !== "已上线" && r.status !== "可导出"
    );

    const updatedKpis = overviewData.kpis.map((kpi: KpiItem) => {
      if (kpi.label === "待处理") {
        return {
          ...kpi,
          value: pendingRecords.length.toString(),
        };
      }
      return kpi;
    });

    return {
      ...overviewData,
      records,
      kpis: updatedKpis,
    };
  }

  getHealth() {
    return { status: "ok" };
  }
}
