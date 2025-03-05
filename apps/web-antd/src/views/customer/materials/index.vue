<template>
  <div class="Container">

      <div class="Table">
          <div style="display: flex; justify-content: space-between">
<!--                公共素材库 OR 个人素材库-->
              <ASelect
                  v-model:value="selectValue"
                  :size="size"
                  style="width: 200px"
                  :options="options"
                  @change="checkCos"
              ></ASelect>

              <ADropdown >
                  <template #overlay>
                      <AMenu @click="handleMenuClick">
                          <AMenuItem key="1">上傳圖片</AMenuItem>
                          <AMenuItem key="2">上傳附件</AMenuItem>
                          <AMenuItem key="3">上傳視頻</AMenuItem>
                      </AMenu>
                  </template>
                  <AButton  style="background-color: #108ee9; color: #ffffff">
                      上傳素材
                      <DownOutlined />
                  </AButton>
              </ADropdown>
              <input id="upload"
                     :accept="fileType"
                     ref="fileInput" style="display: none" type="file" @change="uploadFile" />
          </div>

<!--            素材tab-->
          <ATabs v-model:activeKey="activeKey">
              <template #leftExtra>
                  <AButton @click="toggleSelectMode" class="tabs-extra-demo-button">{{ isSelecting ? "取消选择" : "选择" }}</AButton>
                  <AButton
                      v-if="isSelecting"
                      type="primary"
                      danger
                      class="tabs-extra-demo-button"
                      @click="removeItem"
                      style="margin-left: 10px;">
                      删除
                  </AButton>
              </template>
              <ATabPane key="1" tab="图片">
                  <FileList ref="imgRef" :selectAble="isSelecting" type="image" :fileList="imageList"/>
              </ATabPane>
              <ATabPane key="2" tab="文档" force-render>
                  <FileList ref="docRef" :selectAble="isSelecting" type="document" :fileList="docList" />
              </ATabPane>
              <ATabPane key="3" tab="视频" force-render>
                  <FileList ref="videoRef" :selectAble="isSelecting" type="video" :fileList="videoList" />
              </ATabPane>
          </ATabs>
      </div>

  </div>
</template>

<script lang="ts" setup>
import {ref, watch, nextTick, computed} from "vue";
import {
  Select as ASelect,
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
  Button as AButton,
  Tabs as ATabs,
  TabPane as ATabPane,
  message
} from 'ant-design-vue';
// import FileList from "@/components/contact/FileList.vue";
import FileList from '#/components/contact/FileList.vue';
import type { SelectProps, MenuProps } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { useTemplateStore } from "#/store";
import { deleteMaterial, uploadMaterialApi } from "#/api";


const tempStore = useTemplateStore();

// 素材庫選擇
const size = ref<SelectProps['size']>('middle');
// const options = ref([
//   { value: '449711484896804', label: 'DataS素材库' },
//   { value: '67890', label: '个人素材库' },
// ]);
const options = computed(() => tempStore.selectOptions);
// console.log("options2",options2.value[0].value);

const selectValue = ref(options.value[0].value);

//  素材 tab 頁面
const activeKey = ref('1');
const imgRef = ref(null);
const docRef = ref(null);
const videoRef = ref(null);
let imageList  = computed(() => tempStore.imageList);
let docList = computed(() => tempStore.docList)
let videoList = computed(() => tempStore.videoList);

// 上傳
const fileInput = ref<HTMLInputElement | null>(null);
const fileType = ref("");
const type = ref("");

// 选择
const isSelecting = ref(false);

const toggleSelectMode = () => {
  isSelecting.value = !isSelecting.value;
};

// 刪除
const removeItem = async () => {
  let list = [];
  let selectList = [];
  let data = {};
  switch (activeKey.value) {
      case "1":
          list = imgRef.value.getRemoveItem() ;
          // tempStore.imageList = imageList.value.filter(item =>
          //     !list.some(removedItem => removedItem.title === item.file_name)
          // );
          break;
      case "2":
          list = docRef.value.getRemoveItem();
          // tempStore.docList = docList.value.filter(item =>
          //     !list.some(removedItem => removedItem.title === item.file_name)
          // );
          break;
      case "3":
          list = videoRef.value.getRemoveItem();
          // tempStore.videoList = videoList.value.filter(item =>
          //     !list.some(removedItem => removedItem.title === item.file_name)
          // );
          break;
  }
  let source = ``;

  if(selectValue.value.length > 6) {
    source += `wabaId=${selectValue.value}&userType=waba`
  }else {
    source += `userId=${selectValue.value}&userType=user`
  }

  list.map((item) => {
      // selectList.push(item.id)
      source+=`&materialIds=${item.id}`
  })
  console.log("source",source);
  
  await deleteMaterial(source).then(result => {
    message.success(result.message);
    checkCos();
  });
  
}

// 私人和公共素材切换
watch(() => selectValue.value, (newValue) => {
  checkCos();
  isSelecting.value = false;
})

// 上傳按鈕
const handleMenuClick: MenuProps["onClick"] = (e) => {
  switch (e.key) {
      case "1":
          type.value = "image";
          fileType.value = "image/jpeg,image/png";
          break;
      case "2":
          type.value = "document";
          fileType.value = "application/*";
          break;
      case "3":
          type.value = "video";
          fileType.value = "video/mp4";
          break;
  }

  nextTick(() => {
      fileInput.value?.click();
  });
};

// 触发上传素材
const uploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  let fileContent = files![0];

  await uploadMaterialApi(fileContent!, 'material', type.value, selectValue.value.length > 6 ? { wabaId: selectValue.value } : { userId: selectValue.value } )

  await checkCos();
};

// 检索素材库
async function checkCos() {
  let source = "";
  if(selectValue.value.length > 6) {
      source = "queryType=material&wabaId=" + selectValue.value;
  }else {
      source = "queryType=material&userId=" + selectValue.value;
  }
  tempStore.setMaterialListData(source);
}

</script>

<style scoped>
.ant-list-grid .ant-col {
  display: flex;
  justify-content: center;
  align-items: center;
}


img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}
.Container {
  padding: 20px;

}
.Table {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
}
.tabs-extra-demo-button {
  margin-right: 16px;
}
</style>
