<script setup lang="ts">
import { computed } from "vue";
import type { OperationRecord } from "../types";

const props = defineProps<{ records: OperationRecord[] }>();

const priorityOrder: Record<string, number> = {
  "高": 1,
  "中": 2,
  "低": 3,
};

const sortedRecords = computed(() => {
  return [...props.records].sort((a, b) => {
    return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
  });
});

function getPriorityClass(priority: string) {
  if (priority === "高") {
    return "priority-high";
  } else if (priority === "中") {
    return "priority-medium";
  } else if (priority === "低") {
    return "priority-low";
  }
  return "";
}

function getRowClassName({ row }: { row: OperationRecord }) {
  if (row.priority === "高") {
    return "row-high-priority";
  }
  return "";
}
</script>

<template>
  <el-table 
    :data="sortedRecords" 
    style="width: 100%" 
    size="large"
    :row-class-name="getRowClassName"
  >
    <el-table-column prop="priority" label="优先级" width="100">
      <template #default="{ row }">
        <el-tag :class="getPriorityClass(row.priority)" size="large">
          {{ row.priority }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="模块" />
    <el-table-column prop="owner" label="负责人" />
    <el-table-column prop="status" label="状态" />
    <el-table-column prop="metric" label="指标" />
  </el-table>
</template>

<style scoped>
.priority-high {
  background-color: #fef0f0 !important;
  color: #f56c6c !important;
  border-color: #fbc4c4 !important;
  font-weight: 700;
}

.priority-medium {
  background-color: #fdf6ec !important;
  color: #e6a23c !important;
  border-color: #f5dab1 !important;
}

.priority-low {
  background-color: #f0f9eb !important;
  color: #67c23a !important;
  border-color: #c2e7b0 !important;
}

:deep(.row-high-priority) {
  background-color: #fef0f0 !important;
}

:deep(.row-high-priority:hover) {
  background-color: #fde2e2 !important;
}
</style>
