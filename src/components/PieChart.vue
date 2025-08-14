<template>
  <Responsive class="w-full">
    <template #main="{ width }">
      <Chart
        direction="circular"
        :size="{ width, height: 400 }"
        :data="chartData"
        :margin="{
          left: Math.round((width - 360)/2),
          top: 20,
          right: 0,
          bottom: 20
        }"
        :config="{ controlHover: false }"
        >
        <template #layers>
          <Pie
            :dataKeys="['key', 'value']"
            :pie-style="{ innerRadius: 100, padAngle: 0.05 }" />
        </template>
        <template #widgets>
          <Tooltip
            :config="{
              value: { },
              key: { label: 'key' },
            }"
            hideLine
          />
        </template>
      </Chart>
    </template>
  </Responsive>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts';

const { data } = defineProps(['data']);
const chartData = ref(data);
</script>
