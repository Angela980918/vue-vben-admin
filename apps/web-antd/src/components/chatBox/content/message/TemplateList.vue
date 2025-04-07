<script lang="ts" setup>
import type { SendMessageResponse } from '#/types';

import { computed, onMounted, ref, watch } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  FileImageOutlined,
  FilePdfOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue';
import {
  Button as AButton,
  Divider as ADivider,
  Flex as AFlex,
  Image as AImage,
  Modal as AModal,
  Table as ATable,
  message,
} from 'ant-design-vue';
// import {useRouter} from "vue-router";
import { marked } from 'marked';

import { sendMessageApi } from '#/api';
// import Confirm from "@/components/chatBox/content/message/Confirm.vue";
import Confirm from '#/components/chatBox/content/message/Confirm.vue';
import { useHandleSendMessage } from '#/hooks/handleSendMessage';
import { useChatStore, useTemplateStore } from '#/store';
import { handleTemplateMsg } from '#/utils/common';

const props = defineProps({
  currentPhone: {
    type: String,
    default: '',
  },
});

const chatStore = useChatStore();
const userStore = useUserStore();
const template = useTemplateStore();
// const currentPhone = props.currentPhone === '' ? computed(() => chatStore.currentPhone) : ref(props.currentPhone);
const currentPhone = ref(props.currentPhone);
const containerTemp = ref({});
const selectedRow = ref<null | number>(1);
const confirmRef = ref(null);
const selectRecord = ref(null);
const selectName = ref(null);
const templateList = computed(() => template.getRawTemplateList);
const jump = ref(false);
// const router = useRouter();

watch(
  () => props.currentPhone,
  (newValue) => {
    currentPhone.value = newValue;
  },
);

// 预览模板处理
const preViewTemp = (data) => {
  if (!data || data.components === undefined) return;
  const components = data.components;
  const template = {
    body: undefined,
    footer: undefined,
    header: {},
  };
  components.forEach((item) => {
    switch (item.type) {
      case 'BODY': {
        template.body = item;

        break;
      }
      case 'FOOTER': {
        template.footer = item;

        break;
      }
      case 'HEADER': {
        if (item.format === 'TEXT') {
          template.header = item;
        } else {
          let obj = {};
          obj = {
            url: item.example.header_url[0],
            format: item.format,
            type: item.type,
          };
          template.header = obj;
        }
        break;
      }
      // No default
    }
  });
  containerTemp.value = template;
};

// 点击列
const handleRowClick = (record: any) => {
  return {
    onClick: () => {
      preViewTemp(record);
      selectedRow.value = record.key; // 更新选中行的 ID
    },
  };
};

const setRowClassName = (record: any) => {
  return record.key === selectedRow.value ? 'table-striped' : '';
};

const confirm = (record) => {
  const { name } = record;
  selectName.value = name;
  selectRecord.value = record;
  confirmRef.value.showModal();
};

// 分页配置
const pagination = {
  pageSize: 8,
  // showSizeChanger: true,  // 是否显示切换每页数量的选择器
  // pageSizeOptions: ['5', '10', '15'],  // 可选择的每页显示条数
};

const columns = [
  {
    key: 'name',
    title: 'name',
    dataIndex: 'name',
    width: '30%',
  },
  {
    key: 'language',
    title: 'language',
    dataIndex: 'language',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const open = ref(false);
// 蒙版
const handleSubmit = () => {
  open.value = !open.value;
};

defineExpose({
  controlTemp: (needJump?: boolean) => {
    if (needJump) jump.value = needJump;
    handleSubmit();
  },
});

// 发送模板信息处理
const sendTemplate = async () => {
  const { name, language } = selectRecord.value;
  //
  const sendData: {
    from: string;
    template: { language: { code: any }; name: any };
    to: string;
    type: string;
  } = {
    type: 'template',
    template: {
      name,
      language: {
        code: language,
      },
    },
    from: userStore.selectPhone,
    to: currentPhone.value.toString(),
  };

  const msgContent = handleTemplateMsg(name, language);
  for (const i in msgContent) {
    const item = msgContent[i];
    const obj = {};
    obj.type = i;
    if (i === 'header') {
      if (item.format === 'TEXT') {
        obj.parameters = [
          { type: item.format.toLowerCase(), text: item.content },
        ];
      } else {
        sendData.template.components = [];
        obj.parameters = [{ type: item.format.toLowerCase() }];
        const dynamicKey = `${obj.parameters[0].type}`;
        const typeIndex = obj.parameters[0];
        typeIndex[dynamicKey] = {
          link: item.content,
        };
        sendData.template.components.push(obj);
      }
    }
  }

  const resultObj = (await sendMessageApi(sendData)) as SendMessageResponse;
  const contactPhone = chatStore.currentPhone;

  if (sendData.to === contactPhone) {
    const message = {
      direction: 'outbound',
      _id: resultObj.id,
      status: resultObj.status,
      type: resultObj.type,
      deliverTime: resultObj.createTime,
      content: msgContent,
    };

    if (
      msgContent.header !== undefined &&
      msgContent.header.format === 'DOCUMENT'
    ) {
      const url = msgContent.header.content;
      const filename = url.split('/').pop();
      const fileExtension = filename.split('.');
      message.fileExtension = fileExtension[1];
    }

    chatStore.addMessage(message);
  }
  message.success('發送成功');
  handleSubmit();
  useHandleSendMessage(resultObj);
  // if(jump.value) {
  //   router.push({
  //     name: 'Chat',
  //   });
  // }
};

onMounted(() => {
  preViewTemp(templateList.value[0]);
});

function markedToHtml(markedValue) {
  return marked.parse(markedValue);
}
</script>

<template>
  <div>
    <AModal
      :footer="false"
      v-model:open="open"
      :title="$t('page.chat.selecttemplate')"
      @ok="handleSubmit"
      :width="1000"
    >
      <div class="flex-container">
        <ATable
          class="ant-table-striped"
          :columns="columns"
          :pagination="pagination"
          :custom-row="handleRowClick"
          row-key="key"
          :row-class-name="setRowClassName"
          :data-source="templateList"
          style="min-width: 600px"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a @click="preViewTemp(record)">預覽</a>
              <ADivider type="vertical" />
              <span>
                <AButton @click="confirm(record)" type="primary">發送</AButton>
              </span>
            </template>
          </template>
        </ATable>
        <div class="phoneBox">
          <!-- 确保居中 -->
          <div class="phone">
            <div class="phoneTop"></div>
            <div class="phoneCenter">
              <div class="arrow"></div>
              <div class="content">
                <h6
                  class="contentHeader"
                  v-if="containerTemp.header.format === 'TEXT'"
                >
                  {{ containerTemp.header.text }}
                </h6>
                <div class="mediaCenter" v-else>
                  <div v-if="containerTemp.header.format === 'IMAGE'">
                    <AFlex
                      v-if="containerTemp.header.url !== ''"
                      justify="center"
                      align="center"
                      style="width: 100%; height: 130px"
                    >
                      <AImage
                        height="100%"
                        width="100%"
                        :src="containerTemp.header.url"
                      />
                    </AFlex>
                    <AFlex
                      style="
                        width: 100%;
                        height: 130px;
                        background: rgb(215 213 223);
                      "
                      v-else
                      justify="center"
                      align="center"
                    >
                      <FileImageOutlined style="font-size: 50px; color: #fff" />
                    </AFlex>
                  </div>
                  <div v-else-if="containerTemp.header.format === 'VIDEO'">
                    <AFlex
                      v-if="containerTemp.header.url !== ''"
                      justify="center"
                      align="center"
                      style="width: 100%; height: 130px"
                    >
                      <iframe
                        :src="containerTemp.header.url"
                        style="width: 100%; height: 100%"
                      >
                      </iframe>
                    </AFlex>
                    <AFlex
                      style="
                        width: 100%;
                        height: 130px;
                        background: rgb(215 213 223);
                      "
                      v-else
                      justify="center"
                      align="center"
                    >
                      <VideoCameraOutlined
                        style="font-size: 50px; color: #fff"
                      />
                    </AFlex>
                  </div>
                  <div v-else-if="containerTemp.header.format === 'DOCUMENT'">
                    <AFlex
                      v-if="containerTemp.header.url !== ''"
                      justify="center"
                      align="center"
                      style="width: 100%; height: 130px"
                    >
                      <iframe
                        :src="containerTemp.header.url"
                        style="width: 100%; height: 130px"
                      >
                      </iframe>
                    </AFlex>
                    <AFlex
                      style="
                        width: 100%;
                        height: 130px;
                        background: rgb(215 213 223);
                      "
                      v-else
                      justify="center"
                      align="center"
                    >
                      <FilePdfOutlined style="font-size: 50px; color: #fff" />
                    </AFlex>
                  </div>
                </div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p
                  class="contentBody"
                  v-html="markedToHtml(containerTemp.body.text)"
                ></p>
                <p
                  class="contentFooter"
                  v-if="containerTemp.footer !== undefined"
                >
                  {{ containerTemp.footer.text }}
                </p>
              </div>
            </div>
            <div class="phoneBottom"></div>
          </div>
        </div>
      </div>
      <Confirm
        ref="confirmRef"
        @send-msg="sendTemplate"
        :msg-name="selectName"
        msg-type="模板消息"
      />
    </AModal>
  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
}

/* 浅色主题下的高亮行样式 */
.ant-table-striped :deep(.table-striped) td {
  background-color: #e8e8e8;
}

.phoneBox {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: calc(100% - 616px);
  min-width: 320px;
  height: calc(100% - 120px);
  -webkit-box-pack: center;

  .phone {
    top: 74px;
    right: 92px;
    display: flex;
    flex-direction: column;
    min-height: 595px;
    max-height: 100%;

    .phoneTop {
      position: relative;
      bottom: -1px;
      flex-shrink: 0;
      width: 320px;
      height: 83px;
      background-image: url('https://app.salesmartly.com/img/phoneheader.4b8c90cf.png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .phoneCenter {
      position: relative;
      box-sizing: border-box;
      width: 320px;
      height: calc(100% - 146px);
      min-height: 445px;
      padding: 18px 13px 9px;
      overflow-y: auto;
      background-color: rgb(232 224 213);
      border-right: 5.5px solid rgb(26 30 34);
      border-left: 5.5px solid rgb(26 30 34);

      .arrow {
        position: absolute;
        left: 7px;
        width: 0;
        height: 0;
        border-color: rgb(255 255 255) rgb(255 255 255) transparent transparent;
        border-style: solid;
        border-width: 3.5px;
        border-image: initial;
      }

      .content {
        padding: 8px;
        background-color: rgb(255 255 255);
        border-radius: 0 8px 8px;

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
          color: rgb(162 157 174);
          letter-spacing: 0.0094em;
          overflow-wrap: break-word;
        }
      }
    }

    .phoneBottom {
      position: relative;
      top: -1px;
      flex-shrink: 0;
      width: 320px;
      height: 63px;
      background-image: url('https://app.salesmartly.com/img/phonebottom.a32a8d85.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
