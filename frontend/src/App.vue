<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { fetchOverview } from "./api/client";
import { APP_CODE, APP_NAME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview, filterFallbackOverview } from "./state/dashboard";
import type { OverviewResponse } from "./types";
import FeatureStrip from "./components/FeatureStrip.vue";
import MetricGrid from "./components/MetricGrid.vue";
import OperationsTable from "./components/OperationsTable.vue";

const overview = ref<OverviewResponse>(createFallbackOverview());
const notice = ref(REQUEST_MESSAGES.overviewFallback);
const isBackendConnected = ref(false);

const selectedOwner = ref<string>("");
const selectedPriority = ref<string>("");

const ownerOptions = computed(() => {
  const owners = new Set(overview.value.records.map(r => r.owner));
  return Array.from(owners).sort();
});

const priorityOptions = ["高", "中", "低"];

function goHealth() {
  window.location.href = REQUEST_MESSAGES.healthPath;
}

async function loadData() {
  const owner = selectedOwner.value || undefined;
  const priority = selectedPriority.value || undefined;
  
  if (isBackendConnected.value) {
    try {
      overview.value = await fetchOverview(owner, priority);
    } catch {
      overview.value = filterFallbackOverview(owner, priority);
      notice.value = REQUEST_MESSAGES.overviewFallback;
      isBackendConnected.value = false;
    }
  } else {
    overview.value = filterFallbackOverview(owner, priority);
  }
}

function resetFilters() {
  selectedOwner.value = "";
  selectedPriority.value = "";
}

watch([selectedOwner, selectedPriority], () => {
  loadData();
});

onMounted(async () => {
  try {
    overview.value = await fetchOverview();
    notice.value = "后端服务已联通，当前展示实时接口数据。";
    isBackendConnected.value = true;
  } catch {
    notice.value = REQUEST_MESSAGES.overviewFallback;
    isBackendConnected.value = false;
  }
});
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div>
        <span class="brand-code">{{ APP_CODE }}</span>
        <h1 class="brand-title">{{ APP_NAME }}</h1>
      </div>
      <el-button type="primary" @click="goHealth">API Health</el-button>
    </header>
    <section class="workspace">
      <div class="lead-grid">
        <article class="hero-panel">
          <span class="pill">{{ notice }}</span>
          <h2>{{ overview.appName }}</h2>
          <p>{{ overview.description }}</p>
        </article>
        <MetricGrid :items="overview.kpis" />
      </div>
      <FeatureStrip :items="overview.features" />
      <section class="work-panel">
        <div class="panel-header">
          <h2>运营任务流</h2>
          <div class="filter-bar">
            <el-select 
              v-model="selectedOwner" 
              placeholder="按负责人筛选" 
              clearable
              class="filter-select"
            >
              <el-option 
                v-for="owner in ownerOptions" 
                :key="owner" 
                :label="owner" 
                :value="owner" 
              />
            </el-select>
            <el-select 
              v-model="selectedPriority" 
              placeholder="按优先级筛选" 
              clearable
              class="filter-select"
            >
              <el-option 
                v-for="p in priorityOptions" 
                :key="p" 
                :label="p" 
                :value="p" 
              />
            </el-select>
            <el-button @click="resetFilters" plain>重置</el-button>
          </div>
        </div>
        <OperationsTable :records="overview.records" />
      </section>
    </section>
  </main>
</template>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-header h2 {
  margin: 0;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select {
  width: 160px;
}
</style>
