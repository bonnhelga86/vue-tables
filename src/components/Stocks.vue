<template>
  <el-form inline>
    <el-form-item label="">
      <el-date-picker
        v-model="filters.date"
        type="date"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :default-value="filters.date"
        @change="getStocks"
        disabled
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
  v-if="stocks"
  ref="tableRef"
  :data="(filteredStocks||[]).slice((page-1)*limit, page*limit)"
  style="width: 100%"
  >
    <el-table-column
      prop="date"
      label="Дата"
      column-key="date"
    />
    <el-table-column prop="warehouse_name" label="Наименование склада" />
    <el-table-column prop="price" label="Стоимость" />
    <el-table-column prop="quantity_full" label="Количество" />
    <el-table-column prop="in_way_from_client" label="К клиенту" />
    <el-table-column prop="in_way_to_client" label="От клиента" />
  </el-table>

  <el-pagination
    background
    layout="prev, pager, next"
    :total="(filteredStocks||[]).length"
    class="mt-4"
    :hide-on-single-page="(filteredStocks||[]).length"
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

interface Stocks {
  'barcode': number,
  'brand': string,
  'category': string,
  'date': string,
  'discount_percent': string,
  'in_way_from_client': number,
  'in_way_to_client': number,
  'is_realization': boolean,
  'is_supply': boolean,
  'last_change_date': string,
  'nm_id': number,
  'price': string,
  'quantity': number,
  'quantity_full': number,
  'sc_code': number,
  'subject': string,
  'supplier_article': string,
  'tech_size': string,
  'warehouse_name': string
}

type TData = {[key: string]: number}

const stocks: Ref<Stocks[] | null> = ref(null);
const filteredStocks: Ref<Stocks[] | null> = ref(stocks.value);
const tableRef = ref<TableInstance>();
const chartData = ref();
const limit = 10;
const page = ref(1);

const filters = reactive({
  date: moment().format('YYYY-MM-DD'),
  name: ''
});

const prepareChartData = () => {
  if(!stocks.value) {
     chartData.value = []
     return
  }
  const data: TData = {};

  (stocks.value || []).forEach(item => {
    if(!data[item.warehouse_name]) data[item.warehouse_name] = 0;
    data[item.warehouse_name] += +item.quantity_full;
  });

  chartData.value = Object.keys(data).sort().map(name => ({key: name, value: data[name]}));
}

const runFilter = () => {
  if (!filters.name) {
    filteredStocks.value = stocks.value;
    return;
  }
  filteredStocks.value = (stocks.value || []).filter(({ warehouse_name }) => warehouse_name.toLocaleLowerCase().includes(filters.name.toLocaleLowerCase()));
}

const clearFilter = () => {
  filters.name = "";
  runFilter();
}

const getStocks = async () => {
  if(!filters.date) return;
  try {
    const response = await fetch(`http://109.73.206.144:6969/api/stocks?dateFrom=${filters.date}&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    stocks.value = data.data;
    runFilter();
  } catch (e) {
    console.log((e as Error).message);
  }
  return stocks;
}
getStocks();

watch(()=>stocks, prepareChartData, {deep: true});
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
