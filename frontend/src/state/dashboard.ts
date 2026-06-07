import { localFeatures, localKpis, operationRecords } from "../data/workbench";
import type { OverviewResponse, OperationRecord, KpiItem } from "../types";
import { APP_CODE, APP_NAME } from "../constants/app";

function computePendingKpi(records: OperationRecord[], kpis: KpiItem[]): KpiItem[] {
  const pendingRecords = records.filter(r =>
    r.status !== "已上线" && r.status !== "可导出"
  );

  return kpis.map(kpi => {
    if (kpi.label === "待处理") {
      return {
        ...kpi,
        value: pendingRecords.length.toString(),
      };
    }
    return kpi;
  });
}

export function createFallbackOverview(): OverviewResponse {
  return {
    appName: APP_NAME,
    appCode: APP_CODE,
    description: "面向连锁零售企业，提供多门店库存统一管理、智能调拨和出入库追踪，解决门店间库存不均与缺货问题。",
    features: localFeatures,
    kpis: computePendingKpi(operationRecords, localKpis),
    records: operationRecords,
  };
}

export function filterFallbackOverview(owner?: string, priority?: string): OverviewResponse {
  let records = [...operationRecords];

  if (owner) {
    records = records.filter(r => r.owner === owner);
  }
  if (priority) {
    records = records.filter(r => r.priority === priority);
  }

  return {
    appName: APP_NAME,
    appCode: APP_CODE,
    description: "面向连锁零售企业，提供多门店库存统一管理、智能调拨和出入库追踪，解决门店间库存不均与缺货问题。",
    features: localFeatures,
    kpis: computePendingKpi(records, localKpis),
    records,
  };
}
