<template>
  <Chart
    :size="{ width: 500, height: 420 }"
    :data="chartData"
    direction="horizontal"
    :margin="margin"
    :axis="axis">

    <template #layers>
      <Grid strokeDasharray="2,2" />
      <Bar
        v-for="wName in getBars"
        :key="wName"
        :dataKeys="['date', wName]"
      />
    </template>

    <template #widgets>
      <Tooltip />
    </template>

  </Chart>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import type { Ref } from 'vue';
import { Chart, Grid, Bar, Tooltip } from 'vue3-charts';

interface AxisConfig {
  domain: [string | number, string | number],
  type: 'band' | 'linear',
  format?: (val: string) => string,
  ticks?: number,
  tickValues?: any[],
}

interface IAxis {
  primary: AxisConfig,
  secondary: AxisConfig
}

const { data } = defineProps(['data']);
const chartData = ref(data);

const getBars = computed(() => {
  return Object.keys((chartData.value || []).reduce((acc, item) => {
    const {date, ...other} = item;
    Object.keys(other).forEach((name) => acc[name] = true);
    return acc;
  }, {}));
})

const margin = ref({
  left: 0,
  top: 20,
  right: 20,
  bottom: 0
})

const axis: Ref<IAxis> = ref({
  primary: {
    domain: ['dataMin', 'dataMax'],
    type: 'band'
  },
  secondary: {
    domain: ['dataMin', 'dataMax + 100'],
    type: 'linear',
    ticks: 8
  }
});

</script>