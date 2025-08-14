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
            :dataKeys="['date', 'total_price']"
            :pie-style="{ innerRadius: 100, padAngle: 0.05 }" />
        </template>
        <template #widgets>
          <Tooltip
            :config="{
              total_price: { },
              date: { label: 'value' },
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
console.log('data', data)
const chartData = ref(data);
</script>
