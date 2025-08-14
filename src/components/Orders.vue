<template>
  <el-form inline>
    <el-form-item label="">
      <el-date-picker
        v-model="filters.date"
        type="daterange"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :default-value="filters.date"
        @change="getOrders"
      />
    </el-form-item>
    <el-form-item label="" prop="name">
      <el-input
        prop="name"
        v-model="filters.name"
        @input="runFilter"
      />
    </el-form-item>
    <el-button @click="clearFilter">Сбросить фильтр</el-button>
  </el-form>

  
  <el-table
  v-if="orders"
  ref="tableRef"
  :data="(filteredOrders||[]).slice((page-1)*limit, page*limit)"
  style="width: 100%"
  >
    <el-table-column
      prop="date"
      label="Дата"
      column-key="date"
    />
    <el-table-column prop="warehouse_name" label="Наименование склада" />
    <el-table-column prop="total_price" label="Стоимость" />
    <el-table-column prop="discount_percent" label="Скидка, %" />
    <el-table-column prop="oblast" label="Область" />

  </el-table>

  <el-pagination
    background
    layout="prev, pager, next"
    :total="(filteredOrders||[]).length"
    class="mt-4"
    :hide-on-single-page="(filteredOrders||[]).length"
    @currentChange="(val: number)=>{page = val}"
  />

  <PieChart 
    :key="chartData.length"
    :data="chartData"
  />

</template>

<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import type { Ref } from 'vue';
import type { TableInstance } from 'element-plus';
import PieChart from './PieChart.vue';
import moment from 'moment';

interface Orders {
  'barcode': number,
  'brand': string,
  'cancel_dt': string | null,
  'category': string,
  'date': string,
  'discount_percent': number,
  'g_number': string,
  'income_id': number,
  'is_cancel': boolean,
  'last_change_date': string,
  'nm_id': number,
  'oblast': string,
  'odid': string,
  'subject': string,
  'supplier_article': string,
  'tech_size': string,
  'total_price': string,
  'warehouse_name': string
}

type TData = {[key: string]: number}

const orders: Ref<Orders[] | null> = ref(null);
const filteredOrders: Ref<Orders[] | null> = ref(orders.value);
const tableRef = ref<TableInstance>();
const chartData = ref();
const limit = 10;
const page = ref(1);

const filters = reactive({
  date: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
  name: ''
});

const prepareChartData = () => {
  if(!orders.value) {
     chartData.value = []
     return
  }
  const data: TData = {};

  (orders.value || []).forEach(item => {
    const msUTC = moment(item.date.slice(0, 10)).valueOf();
    if(!data[msUTC]) data[msUTC] = 0;
    data[msUTC] += +item.total_price;
  });

  chartData.value = Object.keys(data).sort().map(date => ({key: moment(+date).format('YYYY-MM-DD'), value: Math.round(data[date])}));
}

const runFilter = () => {
  if (!filters.name) {
    filteredOrders.value = orders.value;
    return;
  }
  filteredOrders.value = (orders.value || []).filter(({ warehouse_name }) => warehouse_name.toLocaleLowerCase().includes(filters.name.toLocaleLowerCase()));
}

const clearFilter = () => {
  filters.name = "";
  runFilter();
}

const getOrders = async () => {
  if(!filters.date) return;
  const [dateFrom, dateTo] = filters.date;
  try {
    const response = await fetch(`http://109.73.206.144:6969/api/orders?dateFrom=${dateFrom}&dateTo=${dateTo}&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    orders.value = data.data;
    runFilter();
  } catch (e) {
    console.log((e as Error).message);
  }
  return orders;
}
getOrders();

watch(()=>orders, prepareChartData, {deep: true});
</script>

<style>
form.el-form {
  margin-top: 20px;
  margin-bottom: 20px;
}

div.el-form-item {
  margin-top: 20px;
  margin-bottom: 20px;
}

button.el-button {
  margin: 20px 0;
}

div.el-pagination {
  margin: 20px 0;
}
</style>
