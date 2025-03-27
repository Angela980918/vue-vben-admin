import { useUserStore } from '@vben/stores';

import { io } from 'socket.io-client';

import { getNewRoomId } from '#/api';
// import {useChatStore} from "@/store/chatStore.js";
// import {useCustomerStore} from "@/store/customerStore.js";
import { useChatStore, useCustomerStore } from '#/store';
// import {handleTemplateMsg} from "@/tools/index.js";
import { handleTemplateMsg } from '#/utils/common';

const MAX_MISSED_PONGS = 3; // 最大未响应心跳次数
const wsList = {};
const isReconnecting = {}; // 用来标记每个连接是否正在重连，防止重复重连
// @ts-ignore: 定时器
let resetTimer = null;
const eventTypes = {
  connect: 'connect',
  heart: 'heart',
  error: 'connect_error',

  email: 'email.delivery.updated',
  personCreate: 'personal_whatsapp.channel.created',
  personDelete: 'personal_whatsapp.channel.deleted',

  // 消息
  inbound_message: 'whatsapp.inbound_message.received',
  message: 'whatsapp.message.updated',

  // 模板
  template: '',
};

// const errorCode = (code: string) => {
//   const errorMsg = {
//     "131049": "未回復的客人24小時內只能發送一條模板信息"
//   }
//   return errorMsg[code] || "消息發送失敗"
// }

export const messageType = {
  failed: 'failed',
  read: 'read',
  sent: 'sent',
  arrow: 'delivered',
  accept: 'accepted',
};

const wsConfigs = {
  '1974246803381729': {
    id: '1974246803381729',
    url: 'https://whatsapi.jackycode.cn/socket.io',
    isContect: false,
  },
};

// @ts-ignore: ws链接
export const wsconnect = {
  createConnect: () => {
    // ws = await new WebSocket('ws://ws.jackycode.cn:4000', {});

    // wsconnect.resConnect('449711484896804');
    // 遍历配置并建立 WebSocket 连接
    Object.values(wsConfigs).forEach((config) => {
      wsconnect.resConnect(config.id);
    });
  },

  // 可选：通过 ID 获取对应的 WebSocket 实例
  getSocketById: (id: string) => {
    // @ts-ignore: ws列表
    return wsList.find((ws) => ws.id === id)?.socket || null;
  },

  sendMessage: (id: string, message: string) => {
    // @ts-ignore: ws列表查询
    wsList.forEach((item) => {
      if (item.id === id) {
        item.socket.send({
          id,
          message,
        });
        return null;
      }
    });
    return '找不到正确id';
  },

  resConnect: async (id: string) => {
    // @ts-ignore: ws config
    const config = wsConfigs[id];
    // console.log("config",config)
    // @ts-ignore: ws 链接个体
    let connectWS;

    if (!config.isContect) {
      // console.log("重連開始")
      connectWS = await io(config.url, {
        query: {
          id: config.id,
        },
      });
    }

    // @ts-ignore: 判断链接
    if (isReconnecting[id]) {
      // console.log("已经在重连中，跳过连接请求");
      return;
    }

    // @ts-ignore 修改个体链接状态
    isReconnecting[id] = true; // 标记当前连接正在重连

    connectWS?.on(eventTypes.connect, () => {
      // console.log("valuevaluevalue",value)
      // @ts-ignore: 链接后修改状态
      wsConfigs[config.id].isContect = true;
      // @ts-ignore: 修改列表中个体
      wsList[config.id] = {
        id: config.id,
        socket: connectWS,
        isContect: true,
        missedPongs: 0,
      };
      // @ts-ignore: 清楚定时器
      clearTimeout(resetTimer);
      resetTimer = null;
      // 啟用心跳
      let heart = setInterval(() => {
        // console.log("心跳")
        if (connectWS?.connected) {
          // 心跳啟動
          connectWS?.emit('heart', {
            id: config.id,
            message: 'ping',
            token:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkphY2t5IiwiaWF0IjoxNzM1NjMyNjkwLCJleHAiOjE3MzU2MzQ0OTB9.o85nnN5MTfNpoD3a4kfPuCA2oNcgK6NBnjR-fiOClYk',
          });

          // @ts-ignore: 心跳响应次数
          wsList[config.id].missedPongs++;
          // @ts-ignore: 心跳判断
          if (wsList[config.id].missedPongs > MAX_MISSED_PONGS) {
            console.warn('服務未響應超過3次');
            // @ts-ignore: 断开连接
            connectWS.disconnect();
            // @ts-ignore: 修改断开状态
            wsConfigs[config.id].isContect = false;
            clearInterval(heart);
            // @ts-ignore: 心跳定时器清空
            heart = null;
            // console.log("wsConfigs[config.id]",wsConfigs[config.id])
            wsconnect.resConnect(config.id);
          }
        }
      }, 5000);
    });

    // @ts-ignore: 无法连接判断
    connectWS.on(eventTypes.error, () => {
      // @ts-ignore: 修改状态
      wsConfigs[config.id].isContect = false;
      // 如果是服務未連接的錯誤，重連
      // @ts-ignore: 清除定时器
      clearTimeout(resetTimer);
      resetTimer = null;
      console.warn('重连');

      resetTimer = setTimeout(() => {
        // @ts-ignore: 修改链接状态
        isReconnecting[id] = false; // 重连完成，标记为未在重连
        wsconnect.resConnect(config.id); // 延迟后重试连接
      }, 5000); // 设置延时 5 秒后重试
    });

    connectWS?.on(eventTypes.inbound_message, async (value) => {
      const customerStore = useCustomerStore();
      const chatStore = useChatStore();
      const newValue = JSON.parse(value);

      const jsonData = newValue.data;
      let whatsappMessage = '';
      whatsappMessage = jsonData.whatsappInboundMessage;

      const assignedCustomers = customerStore.getAssignedCustomers;
      // const unAssignedCustomers = customerStore.getUnassignedCustomers;
      // console.log("whatsappMessage", whatsappMessage)
      // 如果拿出的消息是当前沟通用户，添加到当前记录
      if (chatStore.currentPhone === whatsappMessage.from) {
        const message = wsconnect.handleMessage(
          whatsappMessage,
          'inbound',
          jsonData.time,
        );
        // console.log("查看处理的消息", message)
        // 為當前用戶添加未讀
        // console.log("messagemessage", message)
        assignedCustomers.forEach((item) => {
          if (item.phoneNumber === whatsappMessage.from) {
            if (item.badgeCount === undefined) item.badgeCount = 0;
            item.badgeCount++;

            // if(message.type === 'text') {
            //   item.message = message.content.body;
            // }else {
            //   item.message = `${message.type} Message`
            // }
            item.message =
              message.type === 'text'
                ? message.content.body
                : `${message.type} Message`;

            message.name = item.name;
            message.color = item.color;
          }
        });

        customerStore.setAssignedCustomers(assignedCustomers);
        chatStore.addMessage(message);
      }
      // 如果不是，为那条记录更新最新的消息、未读+1
      else {
        let inserOrNot = 0;
        let message = '';
        // console.log("whatsappMessage.type",whatsappMessage.type,whatsappMessage.type==='text');

        // if(whatsappMessage.type === 'text') {
        //   // console.log("whatsappMessage.type",whatsappMessage.text.body);
        //   message = whatsappMessage.text.body;
        // }else {
        //   // message.title = whatsappMessage[whatsappMessage.type].caption;
        //   // message
        //   message = `[${whatsappMessage.type} message]`
        // }
        message =
          whatsappMessage.type === 'text'
            ? whatsappMessage.text.body
            : (message = `[${whatsappMessage.type} message]`);

        // 查詢是否是來自已訂閱的用戶信息
        assignedCustomers.forEach((item) => {
          if (item.phoneNumber === whatsappMessage.from) {
            inserOrNot = 1;
            item.time = whatsappMessage.sendTime;
            // item.message = message;

            item.message = message;
            if (item.badgeCount === undefined) item.badgeCount = 0;
            item.badgeCount++;
          }
        });

        if (inserOrNot === 1) {
          customerStore.setAssignedCustomers(assignedCustomers);
          return;
        }

        // 插入新用戶
        if (inserOrNot !== 1) {
          //
          const sendPhone = useUserStore().selectPhone;
          const phone =
            whatsappMessage.from === sendPhone
              ? whatsappMessage.to
              : whatsappMessage.from;

          const { roomId } = await getNewRoomId(phone);
          const color = wsconnect.generateRandomColor();
          const userName = whatsappMessage.customerProfile.name;
          // @ts-ignore: 插入客户
          assignedCustomers.push({
            id: roomId,
            key: roomId,
            phoneNumber: whatsappMessage.from,
            name: userName,
            time: whatsappMessage.sendTime,
            message,
            badgeCount: 1,
            color,
          });
        }

        // 更新未訂閱
        customerStore.setAssignedCustomers(assignedCustomers);
        // 从ycloud获取新用户的信息
        // customerStore.getNewUser(whatsappMessage.from);
        // chatStore.addMessage(message);
      }
    });

    // 本人發送消息
    connectWS?.on(eventTypes.message, async (value) => {
      const chatStore = useChatStore();
      const newValue = JSON.parse(value);
      const jsonData = newValue.data;

      let whatsappMessage = '';
      whatsappMessage = jsonData.whatsappMessage;
      const message = wsconnect.handleMessage(
        whatsappMessage,
        'outbound',
        jsonData.createTime,
      );
      const type = message.status;

      const findByphone = useCustomerStore().getUserByPhone(whatsappMessage.to);

      if (!findByphone) {
        const assignedCustomers = useCustomerStore().getAssignedCustomers;
        let msgType = '';
        // if(whatsappMessage.type === 'text') {
        //   // console.log("whatsappMessage.type",whatsappMessage.text.body);
        //   msgType = whatsappMessage.text.body;
        // }else {
        //   // message.title = whatsappMessage[whatsappMessage.type].caption;
        //   // message
        //   msgType = `[${whatsappMessage.type} message]`
        // }
        msgType =
          whatsappMessage.type === 'text'
            ? whatsappMessage.text.body
            : `[${whatsappMessage.type} message]`;

        const { roomId } = await getNewRoomId(whatsappMessage.to);
        const color = wsconnect.generateRandomColor();
        // const userName = whatsappMessage.customerProfile.name;

        assignedCustomers.push({
          id: roomId,
          key: roomId,
          phoneNumber: whatsappMessage.to,
          name: whatsappMessage.to,
          time: whatsappMessage.sendTime || whatsappMessage.updateTime,
          message: msgType,
          badgeCount: 1,
          color,
        });

        useCustomerStore().setAssignedCustomers(assignedCustomers);
      }
      // console.log("message", message)
      // let message = {
      //     position: "outbound",
      //     id: whatsappMessage.id,
      //     type: whatsappMessage.type,
      //     status: whatsappMessage.status
      // }
      //
      // if(whatsappMessage.type === 'text') {
      //     message.title = whatsappMessage.text.body;
      // }else {
      //     message.link = whatsappMessage[whatsappMessage.type].link
      //     message.title = whatsappMessage[whatsappMessage.type].caption
      // }
      // message.time = whatsappMessage.sendTime;

      switch (type) {
        case messageType.arrow: {
          chatStore.updateMessage(message._id, messageType.arrow);
          break;
        }
        case messageType.failed: {
          chatStore.updateMessage(message._id, messageType.failed);
          break;
        }
        case messageType.read: {
          chatStore.updateMessage(message._id, messageType.read);
          break;
        }
        case messageType.sent: {
          chatStore.updateMessage(message._id, messageType.sent, message);
          break;
        }
        default: {
          break;
        }
      }
    });

    connectWS?.on(eventTypes.heart, (id) => {
      if (wsList[id] !== undefined) {
        wsList[id].missedPongs = 0;
      }
    });

    connectWS?.on('template', () => {});
  },
  // 处理信息模块
  handleMessage: (whatsAppMessage, position, time) => {
    whatsAppMessage.sendTime = undefined;
    const message = {
      direction: position,
      _id: whatsAppMessage.id,
      type: whatsAppMessage.type,
      status: whatsAppMessage.status,
      deliverTime: time,
      content: {},
    };

    switch (whatsAppMessage.type) {
      case 'audio':
      case 'document':
      case 'image':
      case 'video': {
        message.content.link = whatsAppMessage[whatsAppMessage.type].link;
        message.content.caption = whatsAppMessage[whatsAppMessage.type].caption;

        break;
      }
      case 'template': {
        message.content = handleTemplateMsg(
          whatsAppMessage.template.name,
          whatsAppMessage.template.language.code,
        );

        break;
      }
      case 'text': {
        message.content.body = whatsAppMessage.text.body;

        break;
      }
      // No default
    }

    return message;
  },
  generateRandomColor: () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  allDisContect: () => {
    Object.values(wsConfigs).forEach((config) => {
      // @ts-ignore: 判断状态
      if (wsList[config.id].isContect) {
        // @ts-ignore: 断开连接
        wsList[config.id].socket.disconnect();
      }
    });
  },
};
