<script setup lang="ts">
import * as icons from '@lnnlmario/icons'
</script>

<template>
  <component :is="Icon" v-for="(Icon, key) in icons" :key="key" class="icon" />
</template>

<style>
.icon {
  height: 48px;
  color: orange;
}
</style>
