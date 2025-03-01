// template.ts
import type { Map } from './index';

export const categoryMap: Map[] = [
  { label: '通用', value: 'UTILITY' },
  { label: '營銷', value: 'MARKETING' },
  {
    label: '認證',
    value: 'AUTHENTICATION',
  },
];

export const languageMap: Map[] = [
  { label: '簡體中文', value: 'zh_CN' },
  { label: '繁體中文', value: 'zh_HK' },
  {
    label: '英文',
    value: 'en_US',
  },
];

export const headerMap: Map[] = [
  { label: '無', value: 'NONE' },
  { label: '文本', value: 'TEXT' },
  {
    label: '媒體',
    value: 'MEDIA',
  },
];

export const mediaMap: Map[] = [
  { label: '圖片', value: 'IMAGE' },
  { label: '影片', value: 'VIDEO' },
  {
    label: '文檔',
    value: 'DOCUMENT',
  },
];

export const statusMap: Map[] = [
  { label: '可用', value: 'APPROVED' },
  { label: '拒絕', value: 'REJECTED' },
  {
    label: '審核中',
    value: 'PENDING',
  },
];
