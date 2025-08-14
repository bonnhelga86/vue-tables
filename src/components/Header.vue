<template>
  <el-menu
    :router="true"
    :default-active="activeIndex"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/">Доходы</el-menu-item>
    <el-menu-item index="/orders">Заказы</el-menu-item>
    <el-menu-item index="/sales">Продажи</el-menu-item>
    <el-menu-item index="/stocks">Склады</el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentRouteName = computed(() => router.currentRoute.value.fullPath)
const activeIndex = ref(currentRouteName);
</script>
