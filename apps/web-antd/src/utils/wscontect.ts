// import {useChatStore} from "@/store/chatStore.js";
// import {useCustomerStore} from "@/store/customerStore.js";
import {useChatStore, useCustomerStore} from "#/store";
import { io } from 'socket.io-client';
// import {handleTemplateMsg} from "@/tools/index.js";
import {handleTemplateMsg} from "#/utils/common";
import {getNewRoomId} from "#/api";

const MAX_MISSED_PONGS = 3; // 最大未响应心跳次数
let wsList = {};
let isReconnecting = {};  // 用来标记每个连接是否正在重连，防止重复重连
// @ts-ignore
let resetTimer = null;
const eventTypes = {
  connect: "connect",
  heart: "heart",
  error: "connect_error",

  email : "email.delivery.updated",
  personCreate: "personal_whatsapp.channel.created",
  personDelete: "personal_whatsapp.channel.deleted",

  // 消息
  inbound_message: "whatsapp.inbound_message.received",
  message: "whatsapp.message.updated",

  // 模板
  template: ""
}

export const messageType = {
  failed: "failed",
  read: "read",
  sent: "sent",
  arrow: "delivered",
  accept: "accepted"
}

let wsConfigs = {
  '449711484896804': { id: '449711484896804', url: 'https://whatsapi.jackycode.cn/socket.io', isContect: false }
};

// @ts-ignore
export const wsconnect = {
  createConnect: () => {
    // ws = await new WebSocket('ws://ws.jackycode.cn:4000', {});

    // wsconnect.resConnect('449711484896804');
    // 遍历配置并建立 WebSocket 连接
    Object.values(wsConfigs).forEach(config => {
      wsconnect.resConnect(config.id);
    });

  },

  // 可选：通过 ID 获取对应的 WebSocket 实例
  getSocketById: (id: string) => {
    // @ts-ignore
    return wsList.find(ws => ws.id === id)?.socket || null;
  },

  sendMessage: (id: string,message: string) => {
    // @ts-ignore
    wsList.map(item => {
      if(item.id === id) {
        item.socket.send({
          id,
          message
        });
        return null;
      }
    })
    return "找不到正确id";
  },

  resConnect: async (id: string) => {
    // @ts-ignore
    let config = wsConfigs[id];
    // console.log("config",config)
    // @ts-ignore
    let connectWS;

    if(!config.isContect) {
      // console.log("重連開始")
      connectWS = await io(config.url,{
        query: {
          id: config.id,
        }
      });
    }

    // @ts-ignore
    if (isReconnecting[id]) {
      // console.log("已经在重连中，跳过连接请求");
      return;
    }

    // @ts-ignore
    isReconnecting[id] = true;  // 标记当前连接正在重连

    connectWS!.on(eventTypes.connect, () => {
      // console.log("valuevaluevalue",value)
      // @ts-ignore
      wsConfigs[config.id].isContect = true;
      // @ts-ignore
      wsList[config.id] = { id: config.id, socket: connectWS, isContect: true, missedPongs: 0 };
      // @ts-ignore
      clearTimeout(resetTimer);
      resetTimer = null;
      // 啟用心跳
      let heart = setInterval(() => {
        // console.log("心跳")
        if(connectWS!.connected) {
          // 心跳啟動
          connectWS!.emit('heart', {
            id: config.id,
            message: 'ping',
            token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkphY2t5IiwiaWF0IjoxNzM1NjMyNjkwLCJleHAiOjE3MzU2MzQ0OTB9.o85nnN5MTfNpoD3a4kfPuCA2oNcgK6NBnjR-fiOClYk'
          });

          // @ts-ignore
          wsList[config.id].missedPongs++;
          // @ts-ignore
          if(wsList[config.id].missedPongs > MAX_MISSED_PONGS) {
            console.log("服務未響應超過3次");
            // @ts-ignore
            connectWS.disconnect();
            // @ts-ignore
            wsConfigs[config.id].isContect = false;
            clearInterval(heart);
            // @ts-ignore
            heart = null;
            // 重連
            // console.log("wsConfigs[config.id]",wsConfigs[config.id])
            wsconnect.resConnect(config.id);
          }
        }

      },5000);
    });

    // @ts-ignore
    connectWS.on(eventTypes.error, (error) => {
      // @ts-ignore
      wsConfigs[config.id].isContect = false;
      // 如果是服務未連接的錯誤，重連
      // @ts-ignore
      clearTimeout(resetTimer);
      resetTimer = null;
      console.log("重连");

      resetTimer = setTimeout(() => {
        // @ts-ignore
        isReconnecting[id] = false;  // 重连完成，标记为未在重连
        wsconnect.resConnect(config.id);  // 延迟后重试连接
      }, 5000);  // 设置延时 5 秒后重试
    });

    // 接收用戶消息
    connectWS!.on(eventTypes.inbound_message, async (value) => {
      const customerStore = useCustomerStore();
      const chatStore = useChatStore();
      let newValue = JSON.parse(value);
      // console.log("newValuenewValuenewValue",newValue);

      const jsonData = newValue.data;
      let whatsappMessage = "";
      whatsappMessage = jsonData.whatsappInboundMessage;

      const assignedCustomers = customerStore.getAssignedCustomers;
      // const unAssignedCustomers = customerStore.getUnassignedCustomers;
      // console.log("whatsappMessage", whatsappMessage)
      // 如果拿出的消息是当前沟通用户，添加到当前记录
      if(chatStore.currentPhone === whatsappMessage.from) {
        let message = wsconnect.handleMessage(whatsappMessage, 'inbound', jsonData.time)
        // console.log("查看处理的消息", message)
        // 為當前用戶添加未讀
        // console.log("messagemessage", message)
        assignedCustomers.map(item => {
          if(item.phoneNumber === whatsappMessage.from) {
            if(item.badgeCount === undefined) item.badgeCount = 0;
            item.badgeCount++;

            if(message.type === 'text') {
              item.message = message.content.body;
            }else {
              item.message = `${message.type} Message`
            }

            message.name = item.name;
            message.color = item.color;
          }
        })

        customerStore.setAssignedCustomers(assignedCustomers);
        chatStore.addMessage(message);

      }
      // 如果不是，为那条记录更新最新的消息、未读+1
      else{
        let inserOrNot = 0;

        let message = "";
        // console.log("whatsappMessage.type",whatsappMessage.type,whatsappMessage.type==='text');

        if(whatsappMessage.type === 'text') {
          // console.log("whatsappMessage.type",whatsappMessage.text.body);
          message = whatsappMessage.text.body;
        }else {
          // message.title = whatsappMessage[whatsappMessage.type].caption;
          // message
          message = `[${whatsappMessage.type} message]`
        }

        // 查詢是否是來自已訂閱的用戶信息
        assignedCustomers.map(item => {
          if(item.phoneNumber === whatsappMessage.from) {
            inserOrNot = 1;
            item.time = whatsappMessage.sendTime;
            // item.message = message;

            item.message = message;
            if(item.badgeCount === undefined) item.badgeCount = 0;
            item.badgeCount++;
          }
        })

        if(inserOrNot === 1) {
          customerStore.setAssignedCustomers(assignedCustomers);
          return;
        }

        // 插入新用戶
        if(inserOrNot !== 1) {
          const { roomId } = await getNewRoomId(whatsappMessage.from);
          const color = wsconnect.generateRandomColor();
          const userName = whatsappMessage.customerProfile.name;
          // @ts-ignore
          assignedCustomers.push({
            id: roomId,
            key: roomId,
            phoneNumber: whatsappMessage.from,
            name: userName,
            time: whatsappMessage.sendTime,
            message: message,
            badgeCount: 1,
            color: color
          })
        }

        // 更新未訂閱
        customerStore.setAssignedCustomers(assignedCustomers);
        // 从ycloud获取新用户的信息
        // customerStore.getNewUser(whatsappMessage.from);
        // chatStore.addMessage(message);
      }
    })

    // 本人發送消息
    connectWS!.on(eventTypes.message, (value) => {
      const chatStore = useChatStore();
      let newValue = JSON.parse(value);
      const jsonData = newValue.data;
      // console.log("newValuenewValuenewValue", newValue);
      let whatsappMessage = "";
      whatsappMessage = jsonData.whatsappMessage;
      let message = wsconnect.handleMessage(whatsappMessage, "outbound", jsonData.createTime)
      const type = message.status;

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
        case messageType.sent:
          chatStore.updateMessage(message._id, messageType.sent, message);
          break;
        case messageType.arrow:
          chatStore.updateMessage(message._id, messageType.arrow);
          break;
        case messageType.failed:
          chatStore.updateMessage(message._id, messageType.failed);
          break;
        case messageType.read:
          chatStore.updateMessage(message._id, messageType.read);
          break;
        default:
          break
      }
    })

    connectWS!.on(eventTypes.heart, (id) => {
      if(wsList[id] !== undefined) {
        wsList[id].missedPongs = 0;
      }
    })

    connectWS!.on('template', () => {
    });

  },
  // 处理信息模块
  handleMessage: (whatsAppMessage, position, time) => {
    whatsAppMessage.sendTime = undefined;
    let message = {
      direction: position,
      _id: whatsAppMessage.id,
      type: whatsAppMessage.type,
      status: whatsAppMessage.status,
      deliverTime: time,
      content: {}
    }

    if(whatsAppMessage.type === 'text') {
      message.content.body = whatsAppMessage.text.body;
    }else if(whatsAppMessage.type === 'image' || whatsAppMessage.type === 'video' || whatsAppMessage.type === 'document'){
      message.content.link = whatsAppMessage[whatsAppMessage.type].link
      message.content.caption = whatsAppMessage[whatsAppMessage.type].caption
    }else if(whatsAppMessage.type === 'template') {
      message.content = handleTemplateMsg(whatsAppMessage.template.name, whatsAppMessage.template.language.code)
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
    Object.values(wsConfigs).forEach(config => {
      // @ts-ignore
      if(wsList[config.id].isContect) {
        // @ts-ignore
        wsList[config.id].socket.disconnect();
      }
    });
  }
};
