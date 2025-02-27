<script lang="ts" setup>
import { getContactListApi } from '#/api';

const test = async () => {
  await getContactListApi().then((result) => {
    // console.log("resultresultresult",result)
    return result;
  });
};
</script>

<template>
  <div style="padding: 12px">
    <span>home1 123456</span>
    <a @click="test">1111</a>
  </div>
</template>

<style scoped></style>
