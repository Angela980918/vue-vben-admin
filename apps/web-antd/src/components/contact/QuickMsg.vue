<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';

import { useUserStore } from '@vben/stores';

import { FileTextOutlined, UploadOutlined } from '@ant-design/icons-vue';
import {
  Button as AButton,
  Flex as AFlex,
  Image as AImage,
  Input as AInput,
  Modal as AModal,
  Select as ASelect,
  Table as ATable,
  Textarea as ATextarea,
  message,
} from 'ant-design-vue';

// import {cosApi} from "@/api/whatsapp/index.js";
import { sendMessageApi, uploadQuickMsgApi } from '#/api';
import Confirm from '#/components/chatBox/content/message/Confirm.vue';
import SelectItem from '#/components/contact/SelectItem.vue';
// import {useTempStore} from "@/store/useTempStore";
// import {useChatStore} from "@/store/chatStore";
import { useChatStore, useTemplateStore } from '#/store';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import type { LibraryFilesParams } from '@vben/types';

// const handleRemove: UploadProps['onRemove'] = file => {
//   const index = fileList.value.indexOf(file);
//   const fileArrayIndex = selectFileArr.value.findIndex(item => file.name === item.file_name);
//   if (fileArrayIndex !== -1) {
//     const newFileArray = selectFileArr.value.slice();
//     newFileArray.slice(fileArrayIndex, 1);
//     selectFileArr.value = newFileArray;
//   }
//   const newFileList = fileList.value.slice();
//   newFileList.splice(index, 1);
//   fileList.value = newFileList;
// };

const props = defineProps({
  showQuickList: {
    type: Boolean,
    default: false,
  },
  msgName: {
    type: String,
    default: '快捷回復',
  },
  fileArray: {
    type: Array,
    default: () => [],
  },
  fileContent: {
    type: String,
    default: '',
  },
});
const templateStore = useTemplateStore();
const chatStore = useChatStore();
const userStore = useUserStore();
const open = ref(false);

// 确认栏
const confirmRef = ref(null);
const selectName = ref(null);

const selectFileArr = ref([]);
const selectContent = ref(null);

const headerTxt = ref('');

const quickList = computed(() => templateStore.getQuickMsg);
const currentPhone = computed(() => chatStore.currentPhone);
const sendQuickMsg = async () => {
  const fromNumber = userStore.selectPhone;
  const toNumber = currentPhone.value;
  const files = selectFileArr.value;
  const messageContent = selectContent.value;

  const sendMessage = async (data) => {
    const result = await sendMessageApi(data);
    const message = {
      direction: 'outbound',
      _id: result.id,
      status: result.status,
      type: result.type,
      deliverTime: result.createTime,
      content: {},
    };

    if (data.type === 'text') {
      message.content.body = result.text.body;
    } else {
      message.content.link = result[result.type].link;
      const url = message.content.link;
      // message.content.filename = fileExtension;
      message.fileExtension = url.split('.').pop();
      message.content.caption = result[result.type].caption;
    }

    chatStore.addMessage(message);
  };

  if (files.length > 1) {
    for (const item of files) {
      await sendMessage({
        from: fromNumber,
        to: toNumber,
        type: item.file_type === 'file' ? 'document' : item.file_type,
        link: `https://cos.jackycode.cn/${item.file_path}`,
        message: '',
      });
    }
  } else if (files.length === 1) {
    await sendMessage({
      from: fromNumber,
      to: toNumber,
      type: files[0].file_type === 'file' ? 'document' : files[0].file_type,
      link: `https://cos.jackycode.cn/${files[0].file_path}`,
      message: messageContent,
    });
  }

  if (messageContent && files.length !== 1) {
    await sendMessage({
      from: fromNumber,
      to: toNumber,
      type: 'text',
      message: messageContent,
    });
  }

  open.value = !open.value;
};

//
const selectedRow = ref<null | number>(1);
const fileList = ref<UploadProps['fileList']>([]);

// 選擇上傳庫
const selectItemRef = ref(null);

const options = computed(() => templateStore.selectOptions);
const value1 = ref(options.value[0].value);
const isCheck = ref(false);

// 上傳modal
const type = ref('');
const accountChange = ref('public');

// 編輯器配置
// const editorRef = shallowRef();
// const toolbarConfig = {
//   toolbarKeys: ['bold', 'italic', 'emotion'], // 仅显示加粗、斜体和表情菜单
// };
// const editorConfig = {
//   placeholder: '请输入内容...',
// };
// const handleCreated = (editor) => {
//   editorRef.value = editor;
// };

const setOpen = (value?: string) => {
  open.value = !open.value;
  if (value) {
    value1.value = value;
    // console.log("quickList.value[0]", quickList.value[0], props.showQuickList);
    templateStore.loadQuickMsg(value);
    // props.showQuickList && preViewQuick(quickList.value[0]);
    // props.showQuickList && preViewQuick(quickList.value[0]);
  }
};

// 切換公共\個人素材庫
const changeOptions = () => {
  /*   let source = '';
  source =
    value1.value.length > 6
      ? `queryType=material&wabaId=${value1.value}`
      : `queryType=material&userId=${value1.value}`; */
  const sourceParams: LibraryFilesParams =
    value1.value.length > 6
      ? {
          queryType: 'material',
          wabaId: value1.value,
        }
      : {
          queryType: 'material',
          userId: value1.value,
        };
  templateStore.setMaterialListData(sourceParams);
};

const handleOk = async () => {
  if (isCheck.value) {
    open.value = false;
  } else {
    const list = [];
    selectFileArr.value.forEach((item) => {
      list.push(item.id);
    });

    const data = {
      fileIds: list,
      title: headerTxt.value,
      content: selectContent.value,
    };

    if (value1.value.length > 6) {
      data.wabaId = value1.value;
    } else {
      data.userId = value1.value;
    }
    // console.log("datadata",data.content)
    // htmlToText(data,)
    await uploadQuickMsgApi(data).then(async () => {
      setOpen();
      message.success('上傳成功');
      await templateStore.loadQuickMsg(value1.value);
    });
  }
};

const btnUpload = (fileType) => {
  type.value = fileType;
  nextTick(() => selectItemRef.value.showModal(value1.value));
};

const getSelected = (value) => {
  const list = selectFileArr.value;
  list.push(value);
  // console.log("list-list", list)
  selectFileArr.value = list;
};

// 分页配置
const pagination = {
  pageSize: 8,
};

const columns = [
  {
    title: '快捷消息',
    dataIndex: 'title',
    width: '30%',
  },
  {
    title: '消息內容',
    dataIndex: 'content',
    width: '30%',
  },
  {
    title: '操作',
    key: 'operation',
  },
];

const preViewQuick = (data) => {
  selectContent.value = data?.content;
  selectFileArr.value = data?.attachments;

  selectedRow.value = data?._id;
};

// 点击列
const handleRowClick = (record: any) => {
  return {
    onClick: () => {
      preViewQuick(record);
      selectedRow.value = record._id; // 更新选中行的 ID
    },
  };
};

const setRowClassName = (record: any) => {
  return record._id === selectedRow.value ? 'table-striped' : '';
};

!props.showQuickList &&
  watch(
    () => props.fileArray,
    (newVal) => {
      selectFileArr.value = newVal;
      if (newVal.length > 0) {
        newVal.forEach((item) => {
          const newFile = {
            uid: item?.file_id || '1',
            name: item?.file_name,
            status: 'done',
            response: '',
            url: `https://cos.jackycode.cn/${item?.file_path}`,
          };
          fileList.value.push(newFile);
        });
      }
    },
    { immediate: true },
  );

!props.showQuickList &&
  watch(
    () => props.fileContent,
    (newVal) => {
      selectContent.value = newVal;
    },
    { immediate: true },
  );

!props.showQuickList &&
  watch(
    () => props.msgName,
    (newVal) => {
      headerTxt.value = newVal;
    },
    { immediate: true },
  );

props.showQuickList &&
  watch(
    () => templateStore.quickMessage,
    (newValue) => {
      quickList.value = newValue;
      preViewQuick(quickList.value[0]);
    },
  );

const confirm = (record) => {
  const { title } = record;
  selectName.value = title;
  confirmRef.value.showModal();
};

function loadAccountQuickMsg(value: string) {
  templateStore.loadQuickMsg(value);
}

onBeforeMount(() => {
  !props.showQuickList && changeOptions(options.value[0].value);
});

onMounted(() => {
  props.showQuickList && preViewQuick(quickList.value[0]);
});

defineExpose({
  setOpen: (value: string, check?: boolean) => {
    if (check !== undefined) {
      isCheck.value = check;
    }
    setOpen(value);
  },
});
</script>

<template>
  <div>
    <AModal
      v-model:open="open"
      :title="props.msgName !== '' ? props.msgName : '快捷回復'"
      style="justify-items: center"
      @ok="handleOk"
      ok-text="確認"
      :width="1000"
    >
      <!--                   选择公共库还是个人账号 -->
      <div
        v-show="showQuickList"
        style="display: flex; flex-direction: column; padding: 10px"
      >
        <span style="font-size: 18px">賬號</span>
        <div style="max-width: 400px; margin-top: 10px">
          <ASelect
            v-model:value="value1"
            style="width: 200px"
            :options="options"
            @change="loadAccountQuickMsg"
          />
        </div>
      </div>

      <div class="flex-container">
        <!--                显示可选快捷信息列表-->
        <ATable
          v-show="showQuickList"
          class="ant-table-striped"
          :columns="columns"
          :pagination="pagination"
          :custom-row="handleRowClick"
          row-key="_id"
          :row-class-name="setRowClassName"
          :key="(record) => record._id"
          :data-source="quickList"
          style="min-width: 600px"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <span>
                <AButton @click="confirm(record)" type="primary">發送</AButton>
              </span>
            </template>
          </template>
        </ATable>

        <!--                显示可编辑或可新增内容-->
        <div
          style="
            display: flex;
            flex-direction: column;
            min-width: 600px;
            padding: 10px;
          "
          v-show="!showQuickList"
        >
          <!--                   快捷回復標題 -->
          <div style="display: flex; flex-direction: column">
            <span style="font-size: 18px">標題</span>
            <div style="max-width: 400px; padding: 12px 0; margin-top: 10px">
              <AInput name="headerInput" v-model:value="headerTxt" show-count />
            </div>
          </div>

          <!--                   选择公共库还是个人账号 -->
          <div style="display: flex; flex-direction: column">
            <span style="font-size: 18px">賬號</span>
            <div style="max-width: 400px; padding: 12px 0; margin-top: 10px">
              <ASelect
                v-model:value="value1"
                style="width: 200px"
                :options="options"
                @change="changeOptions"
              />
            </div>
          </div>

          <!--                   快捷回復文件 -->
          <div style="display: flex; flex-direction: column; margin-top: 10px">
            <span style="font-size: 18px">选择素材</span>
            <div style="display: flex; flex-direction: row">
              <AButton @click="btnUpload('image')" style="margin-right: 12px">
                <UploadOutlined />
                上傳圖片
              </AButton>
              <AButton @click="btnUpload('document')" style="margin: 0 12px">
                <UploadOutlined />
                上傳文檔
              </AButton>
              <AButton @click="btnUpload('video')" style="margin: 0 12px">
                <UploadOutlined />
                上傳視頻
              </AButton>
            </div>
          </div>
          <!--                   快捷回復內容 -->
          <div style="display: flex; flex-direction: column; margin-top: 10px">
            <span style="font-size: 18px">編輯內容</span>
            <div
              style="
                box-sizing: border-box;
                width: 100%;
                max-width: 100%;
                height: 300px;

                /* border: 1px solid #ccc; */
              "
            >
              <!--              <Toolbar-->
              <!--                style="border-bottom: 1px solid #ccc"-->
              <!--                :editor="editorRef"-->
              <!--                :default-config="toolbarConfig"-->
              <!--                mode="default"-->
              <!--              />-->
              <!--              <Editor-->
              <!--                style="-->
              <!--                  box-sizing: border-box;-->
              <!--                  width: 100%;-->
              <!--                  height: 300px;-->
              <!--                  overflow-y: hidden;-->
              <!--                  word-break: break-word;-->
              <!--                  word-wrap: break-word;-->
              <!--                  overflow-wrap: break-word;-->
              <!--                  white-space: pre-wrap;-->
              <!--                "-->
              <!--                v-model="selectContent"-->
              <!--                :default-config="editorConfig"-->
              <!--                mode="default"-->
              <!--                @on-created="handleCreated"-->
              <!--              />-->
              <ATextarea
                style="
                  box-sizing: border-box;
                  width: 100%;
                  height: 300px;
                  overflow-y: hidden;
                  word-break: break-word;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                  white-space: pre-wrap;
                "
                v-model:value="selectContent"
              />
            </div>
          </div>
        </div>

        <!--                预览消息效果-->
        <div class="phoneBox">
          <div class="phone">
            <div class="phoneTop"></div>
            <div
              class="phoneCenter"
              style="max-height: 500px; overflow-y: auto"
            >
              <template v-if="selectFileArr?.length > 1">
                <div v-for="(item, index) in selectFileArr" :key="index">
                  <div class="arrow"></div>
                  <div class="content">
                    <div class="mediaCenter">
                      <div v-if="item.file_type === 'image'">
                        <AFlex
                          justify="center"
                          align="center"
                          style="width: 100%; height: 130px"
                        >
                          <AImage
                            height="100%"
                            width="100%"
                            :src="`https://cos.jackycode.cn/${item.file_path}`"
                          />
                        </AFlex>
                      </div>

                      <div v-else-if="item.file_type === 'video'">
                        <AFlex
                          justify="center"
                          align="center"
                          style="width: 100%; height: 130px"
                        >
                          <iframe
                            :src="`https://cos.jackycode.cn/${item.file_path}`"
                            style="width: 100%; height: 100%"
                          >
                          </iframe>
                        </AFlex>
                      </div>

                      <div v-else-if="item.file_type === 'document'">
                        <AFlex
                          justify="center"
                          align="center"
                          style="width: 100%; height: 130px"
                        >
                          <iframe
                            :src="`https://cos.jackycode.cn/${item.file_path}`"
                            style="width: 100%; height: 130px"
                          >
                          </iframe>
                        </AFlex>
                      </div>

                      <div v-else>
                        <AFlex
                          style="
                            width: 100%;
                            height: 130px;
                            background: rgb(215 213 223);
                          "
                          justify="center"
                          align="center"
                        >
                          <FileTextOutlined
                            style="font-size: 50px; color: #fff"
                          />
                        </AFlex>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="selectFileArr?.length === 1">
                <div v-for="(item, index) in selectFileArr" :key="index + 1">
                  <div class="arrow"></div>
                  <div class="content">
                    <div class="mediaCenter">
                      <div v-if="item.file_type === 'image'">
                        <AFlex
                          justify="center"
                          align="center"
                          style="width: 100%; height: 130px"
                        >
                          <AImage
                            height="100%"
                            width="100%"
                            :src="`https://cos.jackycode.cn/${item.file_path}`"
                          />
                        </AFlex>
                      </div>

                      <div v-else-if="item.file_type === 'video'">
                        <AFlex
                          justify="center"
                          align="center"
                          style="width: 100%; height: 130px"
                        >
                          <iframe
                            :src="`https://cos.jackycode.cn/${item.file_path}`"
                            style="width: 100%; height: 100%"
                          >
                          </iframe>
                        </AFlex>
                      </div>

                      <div v-else-if="item.file_type === 'document'">
                        <AFlex
                          justify="center"
                          align="center"
                          style="width: 100%; height: 130px"
                        >
                          <iframe
                            :src="`https://cos.jackycode.cn/${item.file_path}`"
                            style="width: 100%; height: 130px"
                          >
                          </iframe>
                        </AFlex>
                      </div>

                      <div v-else>
                        <AFlex
                          style="
                            width: 100%;
                            height: 130px;
                            background: rgb(215 213 223);
                          "
                          justify="center"
                          align="center"
                        >
                          <FileTextOutlined
                            style="font-size: 50px; color: #fff"
                          />
                        </AFlex>
                      </div>
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <p class="contentBody" v-html="selectContent"></p>
                    </div>
                  </div>
                </div>
              </template>

              <div
                v-else-if="selectContent !== '' && selectFileArr?.length > 1"
              >
                <div class="arrow"></div>
                <div class="content">
                  <div class="mediaCenter">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <p class="contentBody" v-html="selectContent"></p>
                  </div>
                </div>
              </div>
              <div
                v-else-if="selectContent !== '' && selectFileArr?.length === 0"
              >
                <div class="arrow"></div>
                <div class="content">
                  <div class="mediaCenter">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <p class="contentBody" v-html="selectContent"></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="phoneBottom"></div>
          </div>
        </div>
      </div>
      <Confirm
        ref="confirmRef"
        @send-msg="sendQuickMsg"
        :msg-name="selectName"
        msg-type="快捷回復"
      />
    </AModal>
    <SelectItem
      :account="accountChange"
      :type="type"
      @get-selected="getSelected"
      ref="selectItemRef"
    />
  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
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
        margin-top: 20px;
        background-color: rgb(255 255 255);
        border-radius: 0 8px 8px;

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
      }
    }

    .phoneCenter::-webkit-scrollbar {
      display: none;
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

.ant-table-striped {
  padding: 10px;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #e8e8e8;
}
</style>
