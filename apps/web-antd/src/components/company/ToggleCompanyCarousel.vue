<script lang="ts" setup>
import type { ToggleCompanyProps } from '@vben/types';
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import StringToColor from 'string-to-color';
import type { SelectProps } from 'ant-design-vue';

interface Props {
  companiesList: ToggleCompanyProps;
  height?: number;
  /**
   * 是否啟用頂部tag標籤是純白背景，默認為否，默認是根據ID生成特殊的背景顏色
   */
  activatePureWhite?: boolean;
  onToggleCompany?: (currentIndex: number) => void;
  defaultCompanyId?: string;
}

const {
  companiesList,
  height,
  activatePureWhite = false,
  onToggleCompany,

  defaultCompanyId,
} = defineProps<Props>();
const activeIndex = ref(0);
const listRef = ref<HTMLDivElement | null>(null);

const coloredCompanies = computed(() =>
  companiesList.map((company) => ({
    ...company,
    backgroundColor: StringToColor(company.companyId),
    color: StringToColor(company.companyName),
  })),
);
watch(activeIndex, async (newValue) => {
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
  onToggleCompany && onToggleCompany(newValue);
});

/**
 * 點擊事件切換臨時會話的wabaId和apiKey
 */
async function changeCompany(event: Event, index: number) {
  activeIndex.value = index;
}

onMounted(() => {
  if (defaultCompanyId) {
    const index = companiesList.findIndex(
      (company) => company.companyId === defaultCompanyId,
    );

    if (index !== -1) {
      activeIndex.value = index;
    }
  }
});
const elementStyle = ref<CSSProperties>({});

onBeforeMount(() => {
  elementStyle.value = {
    height: `${height ?? 30}px`,
    lineHeight: `${height ?? 30}px`,
    width: `${height ?? 30}px`,
  };
});

/**
 * 左側選擇框
 */
const leftOptions = ref<SelectProps['options']>(
  companiesList.map((item) => ({
    label: item.companyName,
    value: item.companyId,
  })),
);

const handleChange = (value: string) => {
  const index = companiesList.findIndex(
    (company) => company.companyId === value,
  );
  if (index !== -1) {
    activeIndex.value = index;
  }
};

// #region 橫向滾動

const showScrollButtons = ref(false);

const scrollLeft = () => {
  listRef.value?.scrollBy({
    left: -400,
    behavior: 'smooth',
  });
};

const scrollRight = () => {
  listRef.value?.scrollBy({
    left: 400,
    behavior: 'smooth',
  });
};

const checkIfScrollable = () => {
  if (listRef.value) {
    const el = listRef.value;
    showScrollButtons.value = el.scrollWidth > el.clientWidth;
  }
};

// 自动判断是否需要滚动按钮
onMounted(() => {
  checkIfScrollable();
  window.addEventListener('resize', checkIfScrollable);
});
// #endregion
</script>
<template>
  <div class="carousel-horizontal" :style="{ height: elementStyle.height }">
    <!-- 左按钮 -->
    <button
      class="nav-button left"
      @click="scrollLeft"
      v-if="showScrollButtons"
    >
      ‹
    </button>

    <a-select
      :value="companiesList[activeIndex]?.companyId"
      class="my-select"
      @change="handleChange"
    >
      <a-select-option
        v-for="item in leftOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>

    <div
      class="thumbnail-list"
      ref="listRef"
      :style="{ height: elementStyle.height }"
    >
      <div
        v-for="(item, index) in coloredCompanies"
        :key="item.companyId"
        class="thumbnail"
        :class="{ active: index === activeIndex }"
        @click="changeCompany($event, index)"
        :style="{
          height: elementStyle.height,
          lineHeight: elementStyle.lineHeight,
        }"
      >
        <a-tooltip :color="item.backgroundColor" placement="top">
          <template #title>
            <div
              style="
                line-height: 1.4;
                word-break: break-all;
                white-space: normal;
              "
            >
              手機號碼： {{ item.companyWabaInfo?.phone_number }}
            </div>
          </template>

          <div
            class="tag"
            :style="{
              backgroundColor: activatePureWhite
                ? '#F4F4F5'
                : item?.backgroundColor,
              color: item?.color,
            }"
          >
            <img class="img" :src="item.companyLogo" :style="elementStyle" />
            <p>
              {{ item.companyName }}
            </p>
          </div>
        </a-tooltip>
      </div>
    </div>
    <!-- 右按钮 -->
    <button
      class="nav-button right"
      @click="scrollRight"
      v-if="showScrollButtons"
    >
      ›
    </button>
    <div class="background-layer"></div>
  </div>
</template>

<style scoped lang="scss">
.carousel-horizontal {
  position: relative;
  display: flex;
  width: 100%;
  padding: 0 10px;
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

  .my-select {
    position: relative;
    box-sizing: border-box;
    width: fit-content;
    min-width: 140px;
    max-width: 100%;
    padding-right: 10px;
    white-space: nowrap;
  }

  .my-select::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 3px;
    height: 100%;
    content: '';
    background: linear-gradient(180deg, #a7dfdc 0%, #fed6e3 100%);
    border-radius: 2px;
  }

  .thumbnail-list,
  .main-image {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;

    .thumbnail {
      position: relative;
      z-index: 1;
      font-size: 16px;
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

      .tag {
        box-sizing: border-box;
        display: flex;
        padding: 0 10px;

        .img {
          margin-right: 5px;
          border-radius: 50%;
        }
      }
    }
  }

  .thumbnail-list {
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding: 0 8px;
    overflow-x: auto;
    scroll-behavior: smooth;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    .thumbnail {
      flex-shrink: 0;
      height: 30px;
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
        width: 30px;
        height: 30px;
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
}

.nav-button {
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 20px;
  color: white;
  cursor: pointer;
  background: rgb(0 0 0 / 30%);
  border: none;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgb(154 144 144 / 50%);
}

.nav-button.left {
  margin-right: 10px;
}
</style>
