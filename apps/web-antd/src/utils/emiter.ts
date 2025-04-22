import { onMounted, onUnmounted } from 'vue';

import mitt from 'mitt';

/**
 * 定义基础事件类型接口
 * 包含了预定义的事件及其对应的数据类型
 */
type BaseEvents = {
  close: number;
  open: string;
};

/**
 * 定义扩展事件类型接口
 * 允许用户根据需求添加自定义事件
 */
type ExtendedEvents = {
  openSelectCompany: () => void;
};

/**
 * 使用交叉类型合并基础事件类型和扩展事件类型
 * 形成完整的事件类型定义
 */
type Events = BaseEvents & ExtendedEvents;

const emitter = mitt<Events>();

/**
 * 封装的 Vue 组合式函数，用于在组件挂载时绑定事件，卸载时解绑事件
 * @template K - 事件名称的类型，必须是 Events 类型的键
 * @param eventName - 要监听的事件名称
 * @param handler - 事件处理函数，接收的参数类型为对应事件的数据类型
 */
export function useEvent<K extends keyof Events>(
  eventName: K,
  handler: (data: Events[K]) => void,
) {
  // 绑定事件，在组件挂载时执行
  onMounted(() => {
    emitter.on(eventName, handler);
  });

  // 卸载事件，在组件卸载时执行
  onUnmounted(() => {
    emitter.off(eventName, handler);
  });
}

/**
 * 触发事件的函数
 * @template K - 事件名称的类型，必须是 Events 类型的键
 * @param eventName - 要触发的事件名称
 * @param data - 传递给事件处理函数的数据，类型为对应事件的数据类型
 */
export function emit<K extends keyof Events>(eventName: K, data: Events[K]) {
  emitter.emit(eventName, data);
}

// 暴露 emitter 供外部触发事件
export default emitter;
