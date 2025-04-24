<script lang="ts" setup>
import type { ToggleCompanyProps } from '@vben/types';
import { computed, nextTick, ref, watch } from 'vue';
import StringToColor from 'string-to-color';
import { useUserStore } from '@vben/stores';
import { useInitCommonDataBeforeEnterRoute } from '#/hooks/useInit';

interface Props {
  companiesList: ToggleCompanyProps;
}

const { companiesList } = defineProps<Props>();
const activeIndex = ref(0);
const listRef = ref<HTMLDivElement | null>(null);

const coloredCompanies = computed(() =>
  companiesList.map((company) => ({
    ...company,
    backgroundColor: StringToColor(company.companyId),
    color: StringToColor(company.companyName),
  })),
);

const currentCompany = computed(
  () => coloredCompanies.value[activeIndex.value],
);

watch(activeIndex, async () => {
  await nextTick();
  const listEl = listRef.value;
  if (listEl) {
    const targetEl = listEl.children[activeIndex.value] as HTMLElement;
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }
});
const userStore = useUserStore();
/**
 * 點擊事件切換臨時會話的wabaId和apiKey
 */
async function changeComapny(event: Event, index: number) {
  activeIndex.value = index;
  // 獲取當前選擇公司的id
  const companyId = coloredCompanies.value[index]?.companyId;

  // 當前的公司詳細信息
  const comapny = userStore.companies.find((comany) => comany.id === companyId);
  // 獲取公司的waba賬號優選選擇第一個
  const wabaInfo = comapny && comapny?.waba_accounts[0];
  if (wabaInfo) {
    // 設置新的wabaid和apiKey
    userStore.setCurrentWabaId(wabaInfo.waba_id);
    userStore.setYcouldApiKey(wabaInfo.api_key);

    // 重新獲取全部的初始數據
    await useInitCommonDataBeforeEnterRoute();
  }
}
</script>
<template>
  <div class="carousel-horizontal">
    <div class="thumbnail-list" ref="listRef">
      <div
        v-for="(item, index) in coloredCompanies"
        :key="item.companyId"
        class="thumbnail"
        :class="{ active: index === activeIndex }"
        @click="changeComapny($event, index)"
      >
        <a-tooltip :color="item.backgroundColor">
          <template #title>
            {{ item.companyName }}
          </template>
          <img :src="item.companyLogo" />
        </a-tooltip>
      </div>
    </div>

    <div class="main-image">
      <a-tooltip>
        <template #title>
          {{ currentCompany?.companyName }}
        </template>
        <div
          class="thumbnail"
          :style="{
            backgroundColor: currentCompany?.backgroundColor,
            color: currentCompany?.color,
          }"
        >
          {{ currentCompany?.companyName.split('')[0] }}
        </div>
      </a-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel-horizontal {
  position: relative;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 12px;
  overflow: hidden; // 重要：避免背景层溢出
  border-radius: 0;

  .background-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; // 避免阻挡点击
    background: radial-gradient(
        110.88% 79.69% at 47.77% 151.82%,
        #ffec45 0%,
        rgb(255 236 69 / 30%) 54.92%,
        rgb(255 236 69 / 0%) 96.11%
      ),
      radial-gradient(
        50% 68.23% at 98.21% 96.61%,
        #41d1b7 0%,
        rgb(65 209 183 / 35%) 49.27%,
        rgb(65 209 183 / 0%) 100%
      ),
      radial-gradient(
        83.71% 75.52% at -10.04% 2.86%,
        #8263db 0%,
        rgb(129 114 218 / 26%) 56.87%,
        rgb(129 114 218 / 0%) 100%
      ),
      linear-gradient(180deg, #58ccdc 0%, rgb(88 204 220 / 0%) 100%),
      linear-gradient(
        81.23deg,
        #ff557e 21.4%,
        rgb(255 85 85 / 0%) 84.87%,
        #f2f5fa
      );
    filter: blur(50px);
    background-blend-mode: normal, normal, darken, normal, normal;
  }

  .thumbnail-list,
  .main-image {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .thumbnail {
      position: relative;
      z-index: 1;
      width: 50px;
      height: 50px;
      font-size: 16px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      background-color: #58ccdc;
      border-radius: 50%;
      box-shadow:
        0 0 6px rgba(88, 204, 220, 0.6),
        // 轻微边缘光晕
        0 0 12px rgba(88, 204, 220, 0.4),
        // 中层扩散
        0 0 24px rgba(88, 204, 220, 0.3); // 更远的外围光晕

      transition: box-shadow 0.3s ease;
    }
  }

  .thumbnail-list {
    display: flex;
    flex-direction: row;
    gap: 12px;
    height: 50px;
    padding: 0 8px;
    overflow-x: auto;
    scroll-behavior: smooth;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      overflow: hidden;
      cursor: pointer;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
      opacity: 0.6;
      transition:
        transform 0.3s,
        box-shadow 0.3s;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
      }

      &:hover {
        transform: scale(1.05);
      }

      &.active {
        box-shadow: 0 0 0 2px #1890ff;
        opacity: 1;
      }
    }
  }

  .main-image {
    width: 60px;
    height: 60px;
    margin-left: auto;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 0 0 2px #e6f7ff;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
