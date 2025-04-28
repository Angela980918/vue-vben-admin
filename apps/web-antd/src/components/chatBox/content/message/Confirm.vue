<script lang="ts" setup>
import { Modal as AModal } from 'ant-design-vue';
import { ref } from 'vue';

const props = defineProps({
  msgName: {
    type: String,
    default: '此',
  },
  msgType: {
    type: String,
    default: '消息',
  },
});
const emits = defineEmits(['sendMsg']);
const open = ref<boolean>(false);

const handleSubmit = () => {
  open.value = !open.value;
  emits('sendMsg');
};
const showModal = () => {
  open.value = true;
};

defineExpose({
  showModal: () => {
    showModal();
  },
});
</script>

<template>
  <div>
    <AModal
      style="top: 40%"
      title="確認"
      v-model:open="open"
      @ok="handleSubmit"
      ok-text="發送"
      cancel-text="取消"
    >
      <p>是否發送 {{ props.msgName }} {{ props.msgType }}</p>
    </AModal>
  </div>
</template>

<style scoped></style>
