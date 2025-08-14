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
        @change="getIncomes"
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
  v-if="incomes"
  ref="tableRef"
  :data="(filteredIncomes||[]).slice((page-1)*limit, page*limit)"
  style="width: 100%"
  >
    <el-table-column
      prop="date"
      label="Дата"
      column-key="date"
    />
    <el-table-column prop="warehouse_name" label="Наименование склада" />
    <el-table-column prop="quantity" label="Количество" />
    <el-table-column prop="barcode" label="Штрих-код" />

  </el-table>

  <el-pagination
    background
    layout="prev, pager, next"
    :total="(filteredIncomes||[]).length"
    class="mt-4"
    :hide-on-single-page="(filteredIncomes||[]).length"
    @currentChange="(val: number)=>{page = val}"
  />

  <BarChart 
    :key="chartData.length"
    :data="chartData"
  />

</template>

<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import type { Ref } from 'vue';
import type { TableInstance } from 'element-plus';
import BarChart from './BarChart.vue';
import moment from 'moment';

interface Income {
  'barcode': number,
  'date': string,
  'date_close': string,
  'income_id': number,
  'last_change_date': string,
  'nm_id': number,
  'number': string,
  'quantity': number,
  'supplier_article': string,
  'tech_size': string,
  'total_price': string,
  'warehouse_name': string
}

type TData = {[date: string]: {
  [key: string]: number
}}

const incomes: Ref<Income[] | null> = ref(null);
const filteredIncomes: Ref<Income[] | null> = ref(incomes.value);
const tableRef = ref<TableInstance>();
const chartData = ref();
const limit = 10;
const page = ref(1);

const filters = reactive({
  date: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
  name: ''
});

const prepareChartData = () => {
  if(!incomes.value) {
     chartData.value = []
     return
  }
  const data: TData = {};

  (incomes.value || []).forEach(item => {
    const msUTC = moment(item.date).valueOf();
    if(!data[msUTC]) data[msUTC] = {};
    if(!data[msUTC][item.warehouse_name]) data[msUTC][item.warehouse_name] = 0;
    data[msUTC][item.warehouse_name] += item.quantity;
  });

  chartData.value = Object.keys(data).sort().map(date => ({date: moment(+date).format('YYYY-MM-DD'), ...data[date]}));
}

const runFilter = () => {
  if (!filters.name) {
    filteredIncomes.value = incomes.value;
    return;
  }
  filteredIncomes.value = (incomes.value || []).filter(({ warehouse_name }) => warehouse_name.toLocaleLowerCase().includes(filters.name.toLocaleLowerCase()));
}

const clearFilter = () => {
  filters.name = "";
  runFilter();
}

const getIncomes = async () => {
  if(!filters.date) return;
  const [dateFrom, dateTo] = filters.date;
  try {
    const response = await fetch(`http://109.73.206.144:6969/api/incomes?dateFrom=${dateFrom}&dateTo=${dateTo}&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const { data = [] } = await response.json();
    incomes.value = data;
    
    runFilter();
  } catch (e) {
    console.error(e);
  }
  return incomes;
}
getIncomes();

watch(()=>incomes, prepareChartData, {deep: true});
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
