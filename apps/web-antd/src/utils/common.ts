import dayjs from 'dayjs';

import { useTemplateStore } from '#/store';
import { message } from 'ant-design-vue';
import type { ComponentType, Content } from '@vben/types';
import type { Map } from '#/map';
// 其他共用類方法
export const getLabel = (map: Map[], value: string, defaultLabel = '未知') => {
  const item = map.find((item) => item.value === value);
  return item ? item.label : defaultLabel;
};

// 处理模板信息
// 定义 Header 类型

// 假设 RawTemplateItem 类型
interface RawTemplateItem {
  name: string;
  language: string;
  components: {
    example?: {
      header_url: string[];
    };
    format?: ComponentType;
    text?: string;
    type: string;
  }[];
}

export const handleTemplateMsg = (name: string, language: string): Content => {
  // console.log("name, language", name, language)
  const rawTemplate = useTemplateStore()
    .getRawTemplateList as RawTemplateItem[];
  const result = rawTemplate.find(
    (item) => item.name === name && item.language === language,
  );
  if (!result) {
    message.warn('模板消息尚未加載');
    throw new Error('模板消息尚未加載');
  }
  const { components } = result;
  // 正确初始化 msgContent
  const msgContent: Content = {
    body: {
      content: '',
    },
    footer: {
      content: '',
    },
  };
  for (const index in result.components) {
    const component = components[index];
    if (component) {
      switch (component.type) {
        case 'BODY': {
          if (component.text) {
            msgContent.body = {
              content: component.text,
            };
          }
          break;
        }
        case 'FOOTER': {
          if (component.text) {
            msgContent.footer = {
              content: component.text,
            };
          }
          break;
        }
        case 'HEADER': {
          if (component.format) {
            msgContent.header = {
              format: component.format,
            };
            if (component.format === 'TEXT' && component.text) {
              msgContent.header && (msgContent.header.content = component.text);
            } else if (
              component.example &&
              component.example.header_url.length > 0
            ) {
              msgContent.header &&
                (msgContent.header.content = component.example.header_url[0]);

              const body = {
                type: 'header',
                parameters: [
                  {
                    type: component.format.toLowerCase(),
                  },
                ],
              };
              const dynamicKey = body.parameters[0] && body.parameters[0].type;
              if (!dynamicKey) {
                message.warn('處理模板鏈接出錯');
                throw new Error('處理模板鏈接出錯');
              }
              const typeIndex = body.parameters[0] as { [key: string]: any };
              typeIndex[dynamicKey] = {
                link: component.example.header_url[0],
              };
            }
          }
          break;
        }
        // No default
      }
    }
  }
  return msgContent;
};

// 聊天日期
export const formatTime = (dateString: string) => {
  const now = dayjs();
  const date = dayjs(dateString);
  const diffDays = now.diff(date, 'day'); // 计算天数差
  const timeFormatted = date.format('HH:mm'); // 统一时间格式化
  const isThisYear = now.year() === date.year();

  switch (diffDays) {
    case 0: {
      return timeFormatted;
    } // 今天
    case 1: {
      return `昨天 ${timeFormatted}`;
    } // 昨天
    case 2: {
      return `前天 ${timeFormatted}`;
    } // 前天
    default: {
      return isThisYear
        ? date.format('MM/DD ') + timeFormatted // 更早的日期
        : date.format('YY/MM/DD ') + timeFormatted;
    } // 更早的年份
  }
};

// 創建日期&最近聯繫日期
// export const formatDate = (date) => {
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = (d.getMonth() + 1).toString().padStart(2, '0');  // 月份从0开始，+1确保月份正确
//   const day = d.getDate().toString().padStart(2, '0');
//   const hours = d.getHours().toString().padStart(2, '0');
//   const minutes = d.getMinutes().toString().padStart(2, '0');
//   const seconds = d.getSeconds().toString().padStart(2, '0');
//
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// };

export const MessageType = {
  failed: 'failed',
  read: 'read',
  sent: 'sent',
  arrow: 'delivered',
  accept: 'accepted',
};
