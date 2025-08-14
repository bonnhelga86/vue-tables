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
        @change="getSales"
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
  v-if="sales"
  ref="tableRef"
  :data="(filteredSales||[]).slice((page-1)*limit, page*limit)"
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
    <el-table-column prop="for_pay" label="К оплате" />
    <el-table-column prop="oblast_okrug_name" label="Область" />
  </el-table>

  <el-pagination
    background
    layout="prev, pager, next"
    :total="(filteredSales||[]).length"
    class="mt-4"
    :hide-on-single-page="(filteredSales||[]).length"
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

interface Sales {
  'barcode': number,
  'brand': string,
  'category': string,
  'country_name': string,
  'date': string,
  'discount_percent': string,
  'finished_price': string,
  'for_pay': string,
  'g_number': string,
  'income_id': number,
  'is_realization': boolean,
  'is_storno': boolean | null,
  'is_supply': boolean,
  'last_change_date': string,
  'nm_id': number,
  'oblast_okrug_name': string,
  'odid': string,
  'price_with_disc': string,
  'promo_code_discount': string | null,
  'region_name': string,
  'sale_id': string,
  'sss': string,
  'subject': string,
  'supplier_article': string,
  'tech_size': string,
  'total_price': string,
  'warehouse_name': string
}

type TData = {[key: string]: number}

const sales: Ref<Sales[] | null> = ref(null);
const filteredSales: Ref<Sales[] | null> = ref(sales.value);
const tableRef = ref<TableInstance>();
const chartData = ref();
const limit = 10;
const page = ref(1);

const filters = reactive({
  date: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
  name: ''
});

const prepareChartData = () => {
  if(!sales.value) {
     chartData.value = []
     return
  }
  const data: TData = {};

  (sales.value || []).forEach(item => {
    const msUTC = moment(item.date.slice(0, 10)).valueOf();
    if(!data[msUTC]) data[msUTC] = 0;
    data[msUTC] += +item.finished_price;
  });

  chartData.value = Object.keys(data).sort().map(date => ({key: moment(+date).format('YYYY-MM-DD'), value: Math.round(data[date])}));
}

const runFilter = () => {
  if (!filters.name) {
    filteredSales.value = sales.value;
    return;
  }
  filteredSales.value = (sales.value || []).filter(({ warehouse_name }) => warehouse_name.toLocaleLowerCase().includes(filters.name.toLocaleLowerCase()));
}

const clearFilter = () => {
  filters.name = "";
  runFilter();
}

const getSales = async () => {
  if(!filters.date) return;
  const [dateFrom, dateTo] = filters.date;
  try {
    const response = await fetch(`http://109.73.206.144:6969/api/sales?dateFrom=${dateFrom}&dateTo=${dateTo}&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    sales.value = data.data;
    runFilter();
  } catch (e) {
    console.log((e as Error).message);
  }
  return sales;
}
getSales();

watch(()=>sales, prepareChartData, {deep: true});
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
