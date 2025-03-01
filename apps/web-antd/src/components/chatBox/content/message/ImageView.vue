<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  imgUrl: {
    type: String,
    default: '',
  },
  visiable: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['handleChange']);
// console.log("props",props)
</script>
<template>
  <div
    class="preview-modal"
    v-if="props.visiable"
    @click="emits('handleChange')"
  >
    <img :src="props.imgUrl" class="preview-image" />
  </div>
</template>
<style scoped>
.preview-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 80%);
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
}
</style>
