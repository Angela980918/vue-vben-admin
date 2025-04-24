/**
 * 文件分類：image（圖片）、video（視頻）、document（文檔）、audio（音頻），篩選結果集
 */
export type FileCategory = 'audio' | 'document' | 'image' | 'video';

/**
 * 查詢文件存放的類型：room（聊天室文件）、material（素材文件）、temp（臨時文件）
 */
export type QueryType = 'material' | 'room' | 'temp';

export interface LibraryFilesParams {
  /**
   * 文件分類：image（圖片）、video（視頻）、document（文檔）、audio（音頻），篩選結果集
   */
  fileCategory?: FileCategory;
  /**
   * 查詢文件存放的類型：room（聊天室文件）、material（素材文件）、temp（臨時文件）
   */
  queryType: QueryType;
  /**
   * 聊天室ID（当 uploadType=room 时必填）
   */
  roomId?: string;
  /**
   * 用户ID，用于查询私人库
   */
  userId?: string;
  /**
   * WhatsApp Business Account ID,查詢該wabaId的文件
   */
  wabaId?: string;
}
