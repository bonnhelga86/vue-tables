<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
</script>

<template>
  <el-header>
    <Header />
  </el-header>

  <RouterView />
</template>
