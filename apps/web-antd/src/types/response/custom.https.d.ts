/**
 * HTTP 状态码枚举
 */
const HttpStatusCode = {
  /**
   * 表示请求已被接受处理，但处理尚未完成。
   */
  ACCEPTED = 202,
  /**
   * 用于DAV: propstat响应元素内，避免重复枚举同一集合的多个绑定的内部成员。
   */
  ALREADY_REPORTED = 208,
  /**
   * 表示请求的资源有多个表示形式。
   */
  AMBIGUOUS = 300,
  /**
   * 表示服务器在充当网关或代理时，从访问的入站服务器收到无效响应。
   */
  BAD_GATEWAY = 502,
  /**
   * 表示服务器由于客户端错误而无法或不会处理请求。
   */
  BAD_REQUEST = 400,
  /**
   * 表示由于请求中的冲突（例如多个同时更新之间的编辑冲突），请求无法处理。
   */
  CONFLICT = 409,
  /**
   * 表示内容与原始内容不同。
   */
  CONTENT_DIFFERENT = 210,
  /**
   * 表示客户端可以继续其请求。
   */
  CONTINUE = 100,
  /**
   * 表示请求已成功处理，并导致创建了一个或多个新资源。
   */
  CREATED = 201,
  /**
   * 用于在最终HTTP消息之前返回一些响应头。
   */
  EARLYHINTS = 103,
  /**
   * 表示请求头Expect字段中给出的期望无法由该服务器满足。
   */
  EXPECTATION_FAILED = 417,
  /**
   * 表示该方法无法在资源上执行，因为请求的操作依赖于另一个操作，而该操作失败了。
   */
  FAILED_DEPENDENCY = 424,
  /**
   * 表示服务器理解请求，但拒绝授权。
   */
  FORBIDDEN = 403,
  /**
   * 表示请求的资源已临时移动到新的URI。
   */
  FOUND = 302,
  /**
   * 表示服务器在充当网关或代理时，未从上游服务器收到及时响应。
   */
  GATEWAY_TIMEOUT = 504,
  /**
   * 表示请求的资源在服务器上不再可用，并且不知道转发地址。
   */
  GONE = 410,
  /**
   * 表示请求中使用的HTTP版本不受服务器支持。
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,
  /**
   * 一个玩笑状态码。服务器拒绝煮咖啡，因为它永远是一个茶壶。
   */
  I_AM_A_TEAPOT = 418,
  /**
   * 表示服务器存在内部配置错误：所选的变体资源配置为自行进行透明内容协商，因此不是协商过程中的合适端点。
   */
  INSUFFICIENT_STORAGE = 507,
  /**
   * 表示服务器遇到意外情况，无法完成请求。
   */
  INTERNAL_SERVER_ERROR = 500,
  /**
   * 表示服务器拒绝接受没有定义Content-Length的请求。
   */
  LENGTH_REQUIRED = 411,
  /**
   * 表示方法的源或目标资源被锁定。
   */
  LOCKED = 423,
  /**
   * 表示服务器在处理请求时检测到无限循环。
   */
  LOOP_DETECTED = 508,
  /**
   * 表示服务器知道请求方法，但目标资源不支持该方法。
   */
  METHOD_NOT_ALLOWED = 405,
  /**
   * 表示请求指向的服务器无法产生响应。
   */
  MISDIRECTED = 421,
  /**
   * 表示请求的资源已永久移动到新的URI。
   */
  MOVED_PERMANENTLY = 301,
  /**
   * 传达有关多个资源的信息，适用于可能有多个状态码合适的情况。
   */
  MULTI_STATUS = 207,
  /**
   * 表示请求已成功处理，并且响应负载主体中没有额外的内容要发送。
   */
  NO_CONTENT = 204,
  /**
   * 表示返回的元信息来自缓存副本，而非源服务器。
   */
  NON_AUTHORITATIVE_INFORMATION = 203,
  /**
   * 表示请求的资源只能生成不符合请求中发送的Accept头的内容。
   */
  NOT_ACCEPTABLE = 406,
  /**
   * 表示请求的资源未找到，但可能在将来可用。
   */
  NOT_FOUND = 404,
  /**
   * 表示服务器不支持满足请求所需的功能。
   */
  NOT_IMPLEMENTED = 501,
  /**
   * 表示资源自请求头中指定的版本以来未被修改。
   */
  NOT_MODIFIED = 304,
  /**
   * 成功的HTTP请求的标准响应。
   */
  OK = 200,
  /**
   * 表示服务器由于客户端发送的范围头仅交付部分资源。
   */
  PARTIAL_CONTENT = 206,
  /**
   * 表示请求实体大于服务器定义的限制。
   */
  PAYLOAD_TOO_LARGE = 413,
  /**
   * 保留供将来使用。
   */
  PAYMENT_REQUIRED = 402,
  /**
   * 表示请求的资源已永久移动到新的URI。
   */
  PERMANENT_REDIRECT = 308,
  /**
   * 表示请求头中给出的一个或多个先决条件未满足。
   */
  PRECONDITION_FAILED = 412,
  /**
   * 表示源服务器要求请求是有条件的。
   */
  PRECONDITION_REQUIRED = 428,
  /**
   * 表示服务器正在处理请求，但尚未有响应可用。
   */
  PROCESSING = 102,
  /**
   * 类似于401 Unauthorized，但表示客户端必须首先向代理进行身份验证。
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,
  /**
   * 表示服务器在准备等待的时间内未收到完整的请求消息。
   */
  REQUEST_TIMEOUT = 408,
  /**
   * 表示Range头字段中的任何范围说明符值都不与所选资源的当前范围重叠。
   */
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  /**
   * 表示请求已成功处理，客户端应重置文档视图。
   */
  RESET_CONTENT = 205,
  /**
   * 表示请求的响应可以在另一个URI下找到。
   */
  SEE_OTHER = 303,
  /**
   * 表示服务器由于临时过载或维护而当前无法处理请求。
   */
  SERVICE_UNAVAILABLE = 503,
  /**
   * 表示客户端应切换到不同的协议。
   */
  SWITCHING_PROTOCOLS = 101,
  /**
   * 表示请求的资源已临时移动到新的URI。
   */
  TEMPORARY_REDIRECT = 307,
  /**
   * 表示用户在给定的时间内发送了太多请求。
   */
  TOO_MANY_REQUESTS = 429,
  /**
   * 类似于403 Forbidden，但专门用于需要身份验证且身份验证失败或尚未提供的情况。
   */
  UNAUTHORIZED = 401,
  /**
   * 表示服务器理解请求实体的内容类型，并且请求实体的语法正确，但无法处理其中包含的指令。
   */
  UNPROCESSABLE_ENTITY = 422,
  /**
   * 表示出现不可恢复的错误。
   */
  UNRECOVERABLE_ERROR = 456,
  /**
   * 表示请求数据的媒体格式不受服务器支持。
   */
  UNSUPPORTED_MEDIA_TYPE = 415,
  /**
   * 表示客户端请求的URI比服务器愿意解释的长度更长。
   */
  URI_TOO_LONG = 414,
} as const;

export type HttpStatusCode =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
