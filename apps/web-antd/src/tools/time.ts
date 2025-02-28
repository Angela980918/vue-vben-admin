import dayjs, { Dayjs } from 'dayjs';

/**
 * 格式化聊天时间显示 (精确到分钟)
 * @param dateInput - 可接受的时间输入格式 (字符串/Date对象/dayjs对象/时间戳)
 * @returns 格式化后的时间字符串
 */
export const formatTime = (
  dateInput: Date | Dayjs | number | string,
): string => {
  // 统一转换为 dayjs 对象
  const date = dayjs(dateInput);

  // 有效性校验
  if (!date.isValid()) {
    throw new Error('輸入的日期無效');
  }

  const now = dayjs();
  const diffDays = now.diff(date, 'day');
  const timeFormatted = date.format('HH:mm');
  const isThisYear = now.year() === date.year();

  // 使用 Map 结构提升可读性
  const dayDescriptions = new Map<number, string>([
    [0, timeFormatted],
    [1, `昨天 ${timeFormatted}`],
    [2, `前天 ${timeFormatted}`],
  ]);

  return (
    dayDescriptions.get(diffDays) ||
    (isThisYear
      ? date.format('MM/DD ') + timeFormatted
      : date.format('YY/MM/DD ') + timeFormatted)
  );
};

/**
 * 格式化完整日期时间 (精确到秒)
 * @param dateInput - 可接受的时间输入格式
 * @returns YYYY-MM-DD HH:mm:ss 格式字符串
 */
export const formatDate = (
  dateInput: Date | Dayjs | number | string,
): string => {
  const date = dayjs(dateInput);

  if (!date.isValid()) {
    throw new Error('Invalid date input in formatDate function');
  }

  // 使用 dayjs 原生格式化能力
  return date.format('YYYY-MM-DD HH:mm:ss');
};

// 扩展 dayjs 类型声明
declare module 'dayjs' {
  interface Dayjs {
    isValid(): boolean;
  }
}
