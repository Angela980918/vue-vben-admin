<script lang="ts" setup>
import { computed, h, nextTick, onMounted, onUpdated, ref, watch } from 'vue';

import {
  CheckCircleTwoTone,
  CheckOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileSearchOutlined,
  FileWordOutlined,
  IdcardOutlined,
  LoadingOutlined,
  TagOutlined,
} from '@ant-design/icons-vue';
import {
  Avatar as AAvatar,
  Button as AButton,
  Flex as AFlex,
  Image as AImage,
  Layout as ALayout,
  LayoutContent as ALayoutContent,
  LayoutFooter as ALayoutFooter,
  LayoutHeader as ALayoutHeader,
  Space as ASpace,
  Tooltip as ATooltip,
} from 'ant-design-vue';

// import ChatMessage from "@/components/chatBox/content/chatMessage.vue";
// import ImageView from "@/components/chatBox/content/message/ImageView.vue";
import ChatMessage from '#/components/chatBox/content/chatMessage.vue';
import ImageView from '#/components/chatBox/content/message/ImageView.vue';
import { useChatStore, useCustomerStore } from '#/store';
import { formatTime } from '#/tools';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const emits = defineEmits(['setShowRight']);
const videoPlayer = ref(null);
const syncLoading = ref(false);
// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();

const chatStore = useChatStore();

const currentCustomerInfo = computed(() => chatStore.currentCustomerInfo);

watch(
  () => chatStore.currentChatId,
  (newUserId) => {
    // console.log('newUserId', newUserId)
    const user = customerStore.assignedCustomers.find(
      (user) => user.id === newUserId,
    );
    // customerStore.unassignedCustomers.find(user => user.id === newUserId);
    // console.log('user', user);
    if (user) {
      chatStore.currentCustomerInfo = user;
      // console.log(customerStore.currentCustomerInfo)
    } else {
      console.warn(`未找到 ID 为 ${newUserId} 的用户。`);
      // 处理未找到用户的情况
    }
  },
);

const visiable = ref(false);
const imgUrl = ref('');

const data = computed(() => {
  // console.log("chatStore.chatMessages",chatStore.chatMessages)
  return chatStore.chatMessages;
});

// 样式
const headerStyle = {
  backgroundColor: '#FFFFFF',
  color: '#000',
  textAlign: 'left',
  fontWeight: 'bold',
};

const contentStyle = {
  padding: '20px',
  backgroundColor: '#f0f0f0',
};

const footerStyle = {
  padding: '10px 20px',
  backgroundColor: '#fff',
  borderTop: '1px solid #ddd',
  textAlign: 'center',
  flex: 1,
};

// 滚动到最底部的函数
const chatRoom = ref(null);
const chatRoom26 = ref(null);
const scrollToBottom = (prevHeight = null) => {
  nextTick(() => {
    const chatRoomElement = chatRoom26.value ? chatRoom26.value.$el : null;
    if (chatRoomElement) {
      if (prevHeight === null) {
        chatRoomElement.scrollTop = chatRoomElement.scrollHeight;
      } else {
        const firstMessageElement = document.querySelector(`#${prevHeight}`);
        if (firstMessageElement)
          firstMessageElement.scrollIntoView({
            behavior: 'auto',
            block: 'start',
          });
      }
    }
  });
};
const handleVisiable = (link) => {
  if (link !== undefined) {
    imgUrl.value = link;
  }
  // console.log("link", link)
  visiable.value = !visiable.value;
};

const getAvatarText = (name: string) => {
  if (name === undefined) return;
  // 使用正则表达式过滤掉数字，只取字母或汉字
  const filteredName = name.replaceAll(/\d/g, ''); // 移除数字
  return filteredName.charAt(0).toUpperCase(); // 获取第一个非数字字母或汉字
};

// 处理滚动条
const scrolling = (e) => {
  const scrollTop = e.target.scrollTop;
  // console.log("scrollTopscrollTopscrollTop", scrollTop)
  // console.log("syncLoading.valuesyncLoading.value", syncLoading.value)
  if (data.value.length === 0) return;
  if (scrollTop === 0 && !syncLoading.value) {
    syncLoading.value = true;
    // console.log("滚动")
    chatStore.loadMoreMessages();
  }
};
// 在数据更新后自动滚动到底部
onMounted(async () => {
  // scrollToBottom();
});

onUpdated(async () => {
  // scrollToBottom();
});

watch(
  () => data,
  async () => {
    await nextTick(); // 确保 DOM 已经更新
    // console.log("chatStore.page",chatStore.page)
    if (chatStore.page === 1) {
      scrollToBottom();
    } else {
      syncLoading.value = false;
      const msgIndex = `${chatStore.page - 1}-0-index`;
      scrollToBottom(msgIndex);
    }
  },
  { deep: true },
);
</script>

<template>
  <div :style="{ width: '100%', height: '100%' }">
    <!-- 聊天框 -->
    <ALayout style=" flex-direction: column;height: 100%">
      <ImageView
        :img-url="imgUrl"
        :visiable="visiable"
        @handle-change="handleVisiable"
      />
      <!-- 头部：聊天标题或信息 -->
      <ALayoutHeader :style="headerStyle">
        <AFlex style="height: 100%" justify="space-between" align="center">
          <span>{{ currentCustomerInfo.name }}</span>
          <ASpace size="middle">
            <ATooltip placement="top">
              <template #title>
                <span>添加會話標簽</span>
              </template>
              <AButton :icon="h(TagOutlined)" />
            </ATooltip>

            <ATooltip placement="top">
              <template #title>
                <span>搜索聊天記錄</span>
              </template>
              <AButton :icon="h(FileSearchOutlined)" />
            </ATooltip>

            <AButton type="primary">結束會話</AButton>

            <ATooltip placement="top">
              <template #title>
                <span>顯示更多</span>
              </template>
              <AButton
                :icon="h(IdcardOutlined)"
                @click="emits('setShowRight')"
              />
            </ATooltip>
          </ASpace>
        </AFlex>
      </ALayoutHeader>

      <!-- 中间内容区域：显示聊天记录，可滚动 -->
      <ALayoutContent
        class="chatroom22"
        ref="chatRoom26"
        @scroll="scrolling"
        :style="contentStyle"
        style="width: 100%"
      >
        <LoadingOutlined style="font-size: 50px" v-if="syncLoading" />
        <div class="chatRoom" ref="chatRoom">
          <div v-for="(item, index) in data" :key="index">
            <div :id="item.msgIndex">
              <div
                :class="
                  item.direction === 'inbound'
                    ? ['message-content']
                    : ['message-content right']
                "
              >
                <div
                  style="display: flex; flex-direction: column-reverse"
                  v-if="item.direction === 'outbound'"
                >
                  <AAvatar
                    style="margin-bottom: 10px"
                    size="large"
                    src="https://randomuser.me/api/portraits/women/7.jpg"
                  />
                </div>
                <div
                  style="display: flex; flex-direction: column-reverse"
                  v-else
                >
                  <!--                                    <a-avatar style="margin-bottom: 10px;" size="large"-->
                  <!--                                              src="https://randomuser.me/api/portraits/women/7.jpg"/>-->
                  <AAvatar
                    size="large"
                    :style="{ backgroundColor: item.color }"
                  >
                    {{ getAvatarText(item.name) }}
                  </AAvatar>
                  <!--                                    <a-avatar size="large" :style="{ backgroundColor: item.color }">{{ item.name }}</a-avatar>-->
                </div>

                <div
                  :class="
                    item.direction === 'inbound'
                      ? ['list-item-content']
                      : ['list-item-content content-right']
                  "
                >
                  <div v-if="item.type === 'text'">
                    <span>{{ item.content.body }}</span>
                  </div>

                  <div v-else-if="item.type === 'image'">
                    <div
                      style="
                        position: relative;
                        max-width: 350px;
                        max-height: 350px;
                        overflow: hidden;
                      "
                    >
                      <AImage :src="item.content.link" />
                    </div>
                    <span>{{ item.content.caption }}</span>
                  </div>

                  <div v-else-if="item.type === 'video'">
                    <div>
                      <video
                        ref="videoPlayer"
                        width="100%"
                        controls
                        class="mt-2"
                      >
                        <source :src="item.content.link" type="video/mp4" />
                      </video>
                      <span>{{ item.content.caption }}</span>
                    </div>
                  </div>

                  <div v-else-if="item.type === 'document'">
                    <div>
                      <a
                        :href="item.content.link"
                        download
                        target="_blank"
                        style="
                          display: flex;
                          justify-content: center;
                          max-width: 100px;
                          padding: 15px;
                          font-size: 50px;
                          border-color: #0e0e0e0e;
                          border-style: solid;
                          border-width: 1px;
                          border-radius: 10px;
                        "
                      >
                        <FilePdfOutlined
                          v-if="item.fileExtension === 'pdf'"
                          style="color: red; cursor: pointer"
                        />

                        <FileExcelOutlined
                          v-else-if="
                            item.fileExtension === 'xls' ||
                            item.fileExtension === 'xlsx'
                          "
                          style="color: green; cursor: pointer"
                        />

                        <FileWordOutlined
                          v-else-if="
                            item.fileExtension === 'doc' ||
                            item.fileExtension === 'docx'
                          "
                          style="color: blue; cursor: pointer"
                        />

                        <FileOutlined
                          v-else
                          style="color: #dcdcdc; cursor: pointer"
                        />
                      </a>
                      <span style="font-size: 14px; color: #a9a9a9">{{
                        item.content.caption
                      }}</span>
                    </div>
                  </div>

                  <div v-else-if="item.type === 'audio'">
                    <div>
                      <audio :src="item.content.link" controls></audio>
                      <span style="font-size: 14px; color: #a9a9a9">{{
                        item.content.caption
                      }}</span>
                    </div>
                  </div>

                  <div v-else-if="item.type === 'template'" style="width: 100%">
                    <div class="content">
                      <div
                        class="contentHeader"
                        v-if="item.content.header !== undefined"
                      >
                        <p
                          v-if="item.content.header.format === 'TEXT'"
                          style="font-size: 18px; color: rgb(162 157 174)"
                        >
                          {{ item.content.header.content }}
                        </p>

                        <AImage
                          v-else-if="item.content.header.format === 'IMAGE'"
                          :src="item.content.header.content"
                        />

                        <video
                          v-else-if="item.content.header.format === 'VIDEO'"
                          ref="videoPlayer"
                          width="100%"
                          controls
                          class="mt-2"
                        >
                          <source
                            :src="item.content.header.content"
                            type="video/mp4"
                          />
                        </video>

                        <a
                          :href="item.content.header.content"
                          v-else-if="item.content.header.format === 'DOCUMENT'"
                          download
                          target="_blank"
                          style="
                            display: flex;
                            justify-content: center;
                            width: 100px;
                            padding: 15px;
                            font-size: 50px;
                            border-color: #0e0e0e0e;
                            border-style: solid;
                            border-width: 1px;
                            border-radius: 10px;
                          "
                        >
                          <FilePdfOutlined
                            v-if="item.fileExtension === 'pdf'"
                            style="color: red; cursor: pointer"
                          />

                          <FileExcelOutlined
                            v-else-if="
                              item.fileExtension === 'xls' ||
                              item.fileExtension === 'xlsx'
                            "
                            style="color: green; cursor: pointer"
                          />

                          <FileWordOutlined
                            v-else-if="
                              item.fileExtension === 'doc' ||
                              item.fileExtension === 'docx'
                            "
                            style="color: blue; cursor: pointer"
                          />

                          <FileOutlined
                            v-else
                            style="color: #dcdcdc; cursor: pointer"
                          />
                        </a>
                      </div>

                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <span
                        class="contentBody"
                        v-html="item.content.body.content"
                      ></span>

                      <span
                        class="contentFooter"
                        v-if="item.content.footer !== undefined"
                      >
                        {{ item.content.footer.content }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                :class="
                  item.direction === 'inbound'
                    ? ['message-footer']
                    : ['message-footer', 'message-footer-right']
                "
              >
                <span>{{ formatTime(item.deliverTime) }}</span>
                <span class="status-icon" v-if="item.direction === 'outbound'">
                  <div v-if="item.status === 'delivered'">
                    <CheckOutlined
                      style="
                        padding-right: 12px;
                        padding-left: 12px;
                        font-size: 14px;
                        color: black;
                      "
                    />
                  </div>
                  <div v-else-if="item.status === 'read'">
                    <CheckCircleTwoTone
                      style="
                        padding-right: 12px;
                        padding-left: 12px;
                        font-size: 14px;
                        color: green;
                      "
                      two-tone-color="#52c41a"
                    />
                  </div>
                  <div v-else-if="item.status === 'failed'">
                    <ExclamationCircleOutlined
                      style="
                        padding-right: 12px;
                        padding-left: 12px;
                        font-size: 14px;
                        color: red;
                      "
                    />
                  </div>
                  <div v-else-if="item.status === 'sent' || 'accepted'">
                    <LoadingOutlined
                      style="
                        padding-right: 12px;
                        padding-left: 12px;
                        font-size: 14px;
                        color: black;
                      "
                    />
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </ALayoutContent>

      <!-- 底部输入框 -->
      <ALayoutFooter :style="footerStyle">
        <ChatMessage />
      </ALayoutFooter>
    </ALayout>
  </div>
</template>

<style scoped>
.chatroom22 {
  flex: 0 0 calc(-383px + 100vh);
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  text-align: center;
}

.chatRoom {
  height: 100%;
}

.item {
  display: flex;
}

.right {
  /* flex-direction: row; */
  flex-direction: row-reverse;
  justify-content: end;
}

.message-content {
  display: flex;
  padding: 12px;
  overflow-x: auto;
  font-size: 16px;
  line-height: 22px;
  color: #333;

  /* background: hsla(0, 0%, 89.8%, .2); */

  /* box-shadow: 0 1px 0 #e5e5e5; */
  border-radius: 0 8px 8px;
}

.content-right {
  margin-right: 10px;
  margin-left: 0;
}

.list-item-content {
  display: flex;
  width: unset;
  min-width: 200px;
  max-width: 50%;
  padding: 8px;
  margin-left: 10px;
  text-align: start;
  background: #fff;
  border-radius: 8px;

  span {
    margin-top: 10px;
    font-size: 22px;
  }
}

.message-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  padding: 0 12px 12px;
  margin-left: 58px;
}

.message-footer-right {
  justify-content: end;
  margin-right: 58px;
  margin-left: 0;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  padding: 8px;

  /* max-height: 300px; */
  overflow: hidden;
  background-color: rgb(255 255 255);
  border-radius: 8px;

  .contentHeader {
    margin: 0 0 4px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.0094em;
    word-break: break-word;
    white-space: break-spaces;
  }

  .contentBody {
    margin: 0;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.0107em;
    word-break: break-word;
    white-space: break-spaces;
  }

  .contentFooter {
    margin: 4px 0 0;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #a9a9a9;
    letter-spacing: 0.0094em;
    overflow-wrap: break-word;
  }
}

audio {
  padding: 5px; /* 内边距 */
  background-color: white; /* 背景变白 */
  border-radius: 8px; /* 圆角 */
}
</style>
