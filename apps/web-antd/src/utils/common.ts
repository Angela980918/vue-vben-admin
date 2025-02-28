import dayjs from 'dayjs';

import { useTemplateStore } from '#/store';
// 其他共用類方法
export const getLabel = (map, value, defaultLabel = '未知') => {
  const item = map.find((item) => item.value === value);
  return item ? item.label : defaultLabel;
};

// 处理模板信息
export const handleTemplateMsg = (name, language) => {
  // console.log("name, language", name, language)
  const rawTemplate = useTemplateStore().getRawTemplateList;
  const result = rawTemplate.find(
    (item) => item.name === name && item.language === language,
  );
  // console.log("resultresult",result)
  const { components } = result;
  const msgContent = {};
  for (const index in result.components) {
    switch (components[index].type) {
      case 'BODY': {
        msgContent.body = {
          content: components[index].text,
        };

        break;
      }
      case 'FOOTER': {
        msgContent.footer = {
          content: components[index].text,
        };

        break;
      }
      case 'HEADER': {
        msgContent.header = {
          format: components[index].format,
        };

        if (components[index].format === 'TEXT') {
          msgContent.header.content = components[index].text;
        } else {
          msgContent.header.content = components[index].example.header_url[0];

          const body = {
            type: 'header',
            parameters: [
              {
                type: components[index].format.toLowerCase(),
              },
            ],
          };
          const dynamicKey = `${body.parameters[0].type}`;
          const typeIndex = body.parameters[0];
          typeIndex[dynamicKey] = {
            link: components[index].example.header_url[0],
          };
        }

        break;
      }
      // No default
    }
  }
  return msgContent;
};

// 聊天日期
export const formatTime = (dateString) => {
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
