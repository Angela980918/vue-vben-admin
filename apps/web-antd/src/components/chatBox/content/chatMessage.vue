<script lang="ts" setup>
import type { MessageData } from '@vben/types';

import type { ChatMessage, SendMessageResponse } from '#/types';

import { computed, nextTick, onBeforeMount, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  AudioMutedOutlined,
  AudioOutlined,
  CloseCircleFilled,
  FileTextFilled,
  FileTextOutlined,
  MessageOutlined,
  PaperClipOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import {
  Button as AButton,
  Textarea as ATextarea,
  Tooltip as ATooltip,
  message,
} from 'ant-design-vue';
import data from 'emoji-mart-vue-fast/data/all.json';
import { EmojiIndex, Picker } from 'emoji-mart-vue-fast/src';
// 全局变量
import Recorder from 'recorder-core';

import { sendMessageApi, uploadMaterialApi } from '#/api';
import QuickMsg from '#/components/contact/QuickMsg.vue';
import { useHandleSendMessage } from '#/hooks/handleSendMessage';
import { useChatStore } from '#/store';

// 引入mp3格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

import 'emoji-mart-vue-fast/css/emoji-mart.css';

const emit = defineEmits(['openTemp']);
let rec: any;
const isRecording = ref(false);

const chatStore = useChatStore();
const currentPhone = computed(() => chatStore.currentPhone);

const size = ref('large');
const contentTxt = ref('');
const docTxt = ref(null);
const messageType = ref('text');

const quickRef = ref(null);
const showEmoji = ref(false);
// const colTemp = ref(null);
const emojiIndex = new EmojiIndex(data);
const textAreaRef = ref(null);
const fileInput = ref<HTMLInputElement | null>(null);
const smileIcon = ref(null);
// const showTemp = ref(false);
const pickerStyle = ref({ top: '0', left: '0' }); // Picker的位置

const uploadDoc = () => {
  fileInput.value?.click();
};
// 触发上传文件
const sendDocMessage = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  let type = files[0].type.split('/')[0];
  const fileContent = files[0];
  // console.log("fileContent",fileContent)
  if (fileContent.size > 100 * 1024 * 1024) {
    // console.log("fileContent",fileContent)
    message.error('文件大小应小于100mb');
    return;
  }

  if (type === 'application') {
    type = 'document';
  }
  // console.log("filesfilesfiles",files)
  if (files && files.length > 0) {
    const response = await uploadMaterialApi(fileContent!, 'room', type!, {
      roomId: chatStore.currentChatId.toString(),
    }); // 上传文件

    docTxt.value = {
      file_path: `https://cos.jackycode.cn/${response.file_path}`,
      file_name: response.file_name,
    };

    messageType.value = type;
    // sendMessage(type)
  }
};

// function getFileName() {
//   return docTxt.value.split('/').pop();
// }

function clearFile() {
  messageType.value = 'text';
  docTxt.value = null;
  // 清空 input 的值
  if (fileInput.value) {
    fileInput.value.value = ''; // 通过 ref 清空
  }
}

// 插入表情到光标位置
const insertAtCursor = (text) => {
  const textarea = textAreaRef.value?.resizableTextArea?.textArea;
  if (!textarea) return;

  const startPos = textarea.selectionStart; // 获取光标起始位置
  const endPos = textarea.selectionEnd; // 获取光标结束位置
  // console.log("startPos,endPos", startPos,endPos)
  // 插入表情文本
  contentTxt.value =
    contentTxt.value.slice(0, startPos) + text + contentTxt.value.slice(endPos);

  // 更新光标位置
  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(startPos + text.length, startPos + text.length);
    showSmile();
  });
};

function selectEmoji(emoji) {
  insertAtCursor(emoji.native);
}

function handleSubmit() {
  // showTemp.value = !showTemp.value
  // colTemp.value.controlTemp();
  emit('openTemp');
}

const userStore = useUserStore();

const wabaId = ref(userStore.selectAccount);
function showQuickMsg() {
  nextTick(() => quickRef.value!.setOpen(wabaId.value));
}

// 发送消息
async function sendMessage() {
  // console.log("docTxt.value", docTxt.value)
  const data: MessageData = {
    from: userStore.selectPhone,
    to: currentPhone.value,
    type: 'text',
    message: contentTxt.value,
  };
  if (docTxt.value !== null) {
    data.type = messageType.value;
    data.link = docTxt.value.file_path;
  }

  const result = (await sendMessageApi(data)) as SendMessageResponse;
  const message: ChatMessage = {
    direction: 'outbound',
    _id: result.id,
    status: result.status,
    type: result.type,
    deliverTime: result.createTime,
    content: {},
    from: result.from,
    wamid: result.wamid,
    to: result.to,
    __v: 0,
    name: '',
    color: '',
    msgIndex: '0',
  };
  if (result.type === 'text') {
    message.content.body = result.text.body;
  } else if (result.type === 'template') {
    message.name = result.template.name;
  } else {
    message.content.link = result[result.type].link;
    const url = message.content.link;
    // message.content.filename = fileExtension;
    message.fileExtension = url?.split('.').pop();
    message.content.caption = result[result.type].caption;
  }
  //
  contentTxt.value = '';
  messageType.value = 'text';
  docTxt.value = null;
  chatStore.addMessage(message);
  /* 更新用戶消息 */
  useHandleSendMessage(result);
}

// 表情模板位置计算
const setPickerPosition = () => {
  if (smileIcon.value) {
    const rect = smileIcon.value.getBoundingClientRect(); // 获取图标的位置信息

    const pickerHeight = 480; // Picker的高度

    pickerStyle.value =
      rect.top < pickerHeight
        ? {
            top: `${rect.bottom}px`,
            left: `${rect.left}px`,
          }
        : {
            top: `${rect.top - pickerHeight}px`,
            left: `${rect.left}px`,
          };
  }
};

function showSmile() {
  showEmoji.value = !showEmoji.value;
  if (showEmoji.value) {
    setPickerPosition();
  }
}

// 修改录音初始化逻辑
const audioInit = async () => {
  try {
    // 创建录音对象
    rec = Recorder({
      type: 'mp3', // 录音格式，可以换成wav等其他格式
      sampleRate: 16_000, // 录音的采样率，越大细节越丰富越细腻
      bitRate: 16, // 录音的比特率，越大音质越好
    });
    if (!rec) {
      message.warn('当前浏览器不支持录音功能！');
      return;
    }
    // 打开录音，获得权限
    rec.open(
      () => {},
      () => {
        // 用户拒绝了录音权限，或者浏览器不支持录音
      },
    );
  } catch (error) {
    console.error('无法访问麦克风:', error);
    message.error('無法連接麥克風');
  }
};

const audioStart = async () => {
  if (!rec) {
    console.error('未打开录音');
    return;
  }
  isRecording.value = true;
  rec.start();
};

// 停止录音
const stopRecording = () => {
  if (!rec) {
    console.error('未打开录音');
    return;
  }
  rec.stop(
    async (blob: any) => {
      isRecording.value = false;

      const audioFile = new File([blob], `audio-${Date.now()}.mp3`, {
        type: 'audio/mpeg', // 显式覆盖 MIME 类型
      });
      await uploadMaterialApi(audioFile, 'room', 'audio', {
        roomId: chatStore.currentChatId.toString(),
      }).then((result) => {
        docTxt.value = {
          file_path: `https://cos.jackycode.cn/${result.file_path}`,
          file_name: result.file_name,
        };
        messageType.value = 'audio';
      });

      rec.close(); // 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    },
    (err: any) => {
      console.error(`结束录音出错：${err}`);
      rec.close(); // 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec = null;
    },
  );
};

// 播放录音
// const playRecording = () => {
//     if (audioUrl.value) {
//         const audio = new Audio(audioUrl.value);
//         audio.play();
//         console.log('播放录音');
//     }
// };

// 下载录音
// const downloadRecording = () => {
//     if (audioBlob) {
//         const url = URL.createObjectURL(audioBlob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'recording.wav'; // 下载文件名
//         a.click();
//         URL.revokeObjectURL(url);
//         console.log('下载录音');
//     }
// };
onBeforeMount(() => {
  audioInit();
});
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <!-- 录音蒙版 v-if="isRecording"-->
    <div class="overlay" v-if="isRecording">
      <div class="icon-container" @click="stopRecording">
        <AudioMutedOutlined style="font-size: 35px" />
      </div>
    </div>

    <!--        模板消息选择-->
    <!--    <TemplateList-->
    <!--      :current-phone="currentPhone"-->
    <!--      ref="colTemp"-->
    <!--      v-show="showTemp"-->
    <!--    />-->

    <!--        快捷回复-->
    <QuickMsg ref="quickRef" :show-quick-list="true" />

    <!--        输入文本信息-->
    <!--      @press-enter="sendMessage()"-->
    <ATextarea
      name="messageContent"
      ref="textAreaRef"
      v-model:value="contentTxt"
      placeholder="輸入內容"
      :disabled="messageType === 'audio'"
      :rows="4"
    />

    <!--        选择的文件显示栏位-->
    <div
      v-if="messageType !== 'text'"
      style="
        width: 100%;
        max-height: 56px;
        padding: 10px;
        margin-top: 10px;
        overflow: hidden;
        background-color: #efedf5;
        border-color: #efedf5;
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
      "
    >
      <div
        style="
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          overflow: hidden;
        "
      >
        <!-- 图片或文件图标 -->
        <img
          v-if="messageType === 'image'"
          :src="docTxt.file_path"
          style="
            width: 40px;
            height: 40px;
            cursor: pointer;
            object-fit: contain;
          "
        />
        <FileTextFilled
          v-else
          style="font-size: 40px; color: #dcdcdc; cursor: pointer"
        />

        <!-- 文件名，flex-grow使其占用剩余空间 -->
        <span style="margin-left: 10px; font-size: 14px">
          {{ docTxt.file_name }}
        </span>

        <!-- 关闭图标，靠右对齐 -->
        <CloseCircleFilled class="closeBtn" @click="clearFile" />
      </div>
    </div>

    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-height: 50px;
        margin-top: 10px;
      "
    >
      <div>
        <ATooltip>
          <template #title>表情</template>
          <SmileOutlined
            class="inputText"
            style="margin: 4px; font-size: 20px"
            @click="showSmile"
            ref="smileIcon"
          />
        </ATooltip>
        <ATooltip>
          <template #title>快捷回復</template>
          <MessageOutlined
            style="margin: 4px; font-size: 20px"
            @click="showQuickMsg"
          />
        </ATooltip>
        <ATooltip>
          <template #title>上傳文檔</template>
          <PaperClipOutlined
            style="margin: 4px; font-size: 20px"
            @click="uploadDoc"
          />
          <input
            id="upload"
            accept="image/jpeg,image/png,video/mp4,application/*"
            ref="fileInput"
            style="display: none"
            type="file"
            @change="sendDocMessage"
          />
        </ATooltip>
        <!--        <ATooltip>-->
        <!--          <template #title>選擇產品/服務</template>-->
        <!--          <ContainerOutlined style="margin: 4px; font-size: 20px" />-->
        <!--        </ATooltip>-->
        <!--        <ATooltip>-->
        <!--          <template #title>地理位置</template>-->
        <!--          <EnvironmentOutlined style="margin: 4px; font-size: 20px" />-->
        <!--        </ATooltip>-->
        <ATooltip>
          <template #title>錄音</template>
          <AudioOutlined
            style="margin: 4px; font-size: 20px"
            @click="audioStart"
          />
        </ATooltip>
        <ATooltip>
          <template #title>訊息模板</template>
          <FileTextOutlined
            style="margin: 4px; font-size: 20px"
            @click="handleSubmit"
          />
        </ATooltip>
      </div>
      <div>
        <AButton
          @click="sendMessage"
          type="primary"
          shape="circle"
          :size="size"
        >
          <template #icon>
            <SendOutlined />
          </template>
        </AButton>
      </div>
    </div>

    <!-- 蒙版和表情Picker -->
    <div v-if="showEmoji" class="emoji-mask" @click="showSmile">
      <div class="emoji-picker-container" @click.stop :style="pickerStyle">
        <Picker :data="emojiIndex" set="twitter" @select="selectEmoji" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-input input {
  padding: 8px 11px;
  font-size: 16px;
  line-height: 1.2;
  text-align: left;
}

.inputText {
  position: relative;
}

.emoji-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.emoji-picker-container {
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

.closeBtn {
  margin-left: auto;
  font-size: 30px;
  color: #b5b5b5;
  cursor: pointer;
}

.closeBtn:hover {
  color: #7b68ee;
}

.overlay {
  position: fixed; /* 固定在屏幕上 */
  top: 0;
  left: 0;
  z-index: 1000; /* 确保蒙版显示在最前面 */
  display: flex;
  align-items: center; /* 居中显示 */
  justify-content: center; /* 居中显示 */
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%); /* 半透明黑色背景 */
}

.icon-container {
  display: flex;
  align-items: center; /* 图标垂直居中 */
  justify-content: center; /* 图标居中 */
  width: 100px; /* 圆形的宽度 */
  height: 100px; /* 圆形的高度 */
  background-color: #fff; /* 背景为白色 */
  border-radius: 50%; /* 设置圆形 */
}
</style>
