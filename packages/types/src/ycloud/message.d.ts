// 定义 conversation 部分的类型
export interface Conversation {
  id: string;
  type: 'FREE_ENTRY';
  originType: 'referral_conversion';
  expireTime: string;
}

// 定义 header 组件中 parameters 部分的类型
export interface Parameter {
  type: 'text';
  text: string;
  payload: string;
  coupon_code: string;
  image: {
    caption: string;
    filename: string;
    link: string;
  };
  video: {
    caption: string;
    filename: string;
    link: string;
  };
  document: {
    caption: string;
    filename: string;
    link: string;
  };
  limited_time_offer: {
    expiration_time_ms: string;
  };
  action: {
    flow_action_data: {
      [key: string]: any;
    };
    flow_token: string;
    location: {
      address: string;
      latitude: number;
      longitude: number;
      name: string;
    };
    order_details: {
      currency: string;
      order: {
        catalog_id: string;
        description: string;
        discount: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        expiration: {
          description: string;
          timestamp: string;
        };
        items: {
          amount: {
            description: string;
            discount_program_name: string;
            offset: number;
            value: number;
          };
          country_of_origin: string;
          image: {
            caption: string;
            filename: string;
            link: string;
          };
          importer_address: string;
          importer_name: string;
          name: string;
          quantity: number;
          retailer_id: string;
          sale_amount: {
            description: string;
            discount_program_name: string;
            offset: number;
            value: number;
          };
        }[];
        shipping: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        status: 'pending';
        subtotal: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        tax: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        type: string;
      };
      payment_settings: {
        payment_gateway: {
          billdesk: {
            additional_info1: string;
            additional_info2: string;
            additional_info3: string;
            additional_info4: string;
            additional_info5: string;
            additional_info6: string;
            additional_info7: string;
          };
          configuration_name: string;
          payu: {
            udf1: string;
            udf2: string;
            udf3: string;
            udf4: string;
          };
          razorpay: {
            notes: {
              [key: string]: string;
            };
            receipt: string;
          };
          type: 'billdesk' | 'payu' | 'razorpay' | 'zaakpay';
          zaakpay: {
            extra1: string;
            extra2: string;
          };
        };
        type: 'payment_gateway';
      }[];
      reference_id: string;
      total_amount: {
        description: string;
        discount_program_name: string;
        offset: number;
        value: number;
      };
      type: string;
    };
    order_status: {
      order: {
        catalog_id: string;
        description: string;
        discount: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        expiration: {
          description: string;
          timestamp: string;
        };
        items: {
          amount: {
            description: string;
            discount_program_name: string;
            offset: number;
            value: number;
          };
          country_of_origin: string;
          image: {
            caption: string;
            filename: string;
            link: string;
          };
          importer_address: string;
          importer_name: string;
          name: string;
          quantity: number;
          retailer_id: string;
          sale_amount: {
            description: string;
            discount_program_name: string;
            offset: number;
            value: number;
          };
        }[];
        shipping: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        status: 'pending';
        subtotal: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        tax: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        type: string;
      };
      reference_id: string;
    };
    sections: {
      product_items: {
        product_retailer_id: string;
      }[];
      title: string;
    }[];
    thumbnail_product_retailer_id: string;
  };
}

// 定义 header 组件的类型
export interface HeaderComponent {
  type: 'header';
  sub_type: 'quick_reply';
  index: number;
  parameters: Parameter[];
  cards: {
    card_index: number;
    components: {
      index: number;
      parameters: Parameter[];
      sub_type: 'quick_reply';
      type: 'header';
    }[];
  }[];
}

// 定义 template 部分的类型
export interface Template {
  name: string;
  language: {
    code: 'en_US';
    policy: 'deterministic';
  };
  components: HeaderComponent[];
}

// 定义 text 部分的类型
export interface Text {
  body: string;
  preview_url: boolean;
}

// 定义 image 部分的类型
export interface Image {
  link: string;
  caption?: string;
  filename?: string;
}

// 定义 video 部分的类型
export interface Video {
  link: string;
  caption?: string;
  filename?: string;
}

// 定义 audio 部分的类型
export interface Audio {
  link: string;
  caption?: string;
  filename?: string;
}

// 定义 document 部分的类型
export interface Document {
  link: string;
  caption: string;
  filename: string;
}

// 定义 sticker 部分的类型
export interface Sticker {
  link: string;
  caption: string;
  filename: string;
}

// 定义 location 部分的类型
export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

// 定义 button 部分的类型
export interface Button {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
}

// 定义 interactive 部分的 action 类型
export interface Action {
  buttons: Button[];
  button: string;
  catalog_id: string;
  product_retailer_id: string;
  sections: {
    product_items: {
      product_retailer_id: string;
    }[];
    rows: {
      description: string;
      id: string;
      title: string;
    }[];
    title: string;
  }[];
  name: 'cta_url';
  parameters: {
    beneficiaries: {
      address_line1: string;
      address_line2: string;
      city: string;
      country: string;
      name: string;
      postal_code: string;
      state: string;
    }[];
    currency: string;
    display_text: string;
    flow_action: 'navigate';
    flow_action_payload: {
      data: {
        [key: string]: any;
      };
      screen: string;
    };
    flow_cta: string;
    flow_id: string;
    flow_message_version: string;
    flow_name: string;
    flow_token: string;
    order: {
      catalog_id: string;
      description: string;
      discount: {
        description: string;
        discount_program_name: string;
        offset: number;
        value: number;
      };
      expiration: {
        description: string;
        timestamp: string;
      };
      items: {
        amount: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
        country_of_origin: string;
        image: {
          caption: string;
          filename: string;
          link: string;
        };
        importer_address: string;
        importer_name: string;
        name: string;
        quantity: number;
        retailer_id: string;
        sale_amount: {
          description: string;
          discount_program_name: string;
          offset: number;
          value: number;
        };
      }[];
      shipping: {
        description: string;
        discount_program_name: string;
        offset: number;
        value: number;
      };
      status: 'pending';
      subtotal: {
        description: string;
        discount_program_name: string;
        offset: number;
        value: number;
      };
      tax: {
        description: string;
        discount_program_name: string;
        offset: number;
        value: number;
      };
      type: string;
    };
    payment_settings: {
      payment_gateway: {
        billdesk: {
          additional_info1: string;
          additional_info2: string;
          additional_info3: string;
          additional_info4: string;
          additional_info5: string;
          additional_info6: string;
          additional_info7: string;
        };
        configuration_name: string;
        payu: {
          udf1: string;
          udf2: string;
          udf3: string;
          udf4: string;
        };
        razorpay: {
          notes: {
            [key: string]: string;
          };
          receipt: string;
        };
        type: 'billdesk' | 'payu' | 'razorpay' | 'zaakpay';
        zaakpay: {
          extra1: string;
          extra2: string;
        };
      };
      type: 'payment_gateway';
    }[];
    reference_id: string;
    thumbnail_product_retailer_id: string;
    total_amount: {
      description: string;
      discount_program_name: string;
      offset: number;
      value: number;
    };
    type: string;
    url: string;
  };
}

// 定义 interactive 部分的类型
export interface Interactive {
  type: 'button';
  action: Action;
  body: {
    text: string;
  };
  header: {
    document: Document;
    image: Image;
    text: string;
    type: 'text';
    video: Video;
  };
  footer: {
    text: string;
  };
}

// 定义 address 部分的类型
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  country_code: string;
  type: 'WORK';
}

// 定义 email 部分的类型
export interface Email {
  email: string;
  type: 'WORK';
}

// 定义 name 部分的类型
export interface Name {
  formatted_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  prefix: string;
}

// 定义 org 部分的类型
export interface Org {
  company: string;
  department: string;
  title: string;
}

// 定义 phone 部分的类型
export interface Phone {
  phone: string;
  type: string;
  wa_id: string;
}

// 定义 url 部分的类型
export interface Url {
  url: string;
  type: string;
}

// 定义 contact 部分的类型
export interface Contact {
  addresses: Address[];
  birthday: string;
  emails: Email[];
  name: Name;
  org: Org;
  phones: Phone[];
  urls: Url[];
}

// 定义 reaction 部分的类型
export interface Reaction {
  message_id: string;
  emoji: string;
}

// 定义 context 部分的类型
export interface Context {
  message_id: string;
}

// 定义 whatsappApiError 部分的类型
export interface WhatsAppApiError {
  message: string;
  code: number;
  type: 'OAuthException';
  error_subcode: number;
  error_user_msg: string;
  error_user_title: string;
  fbtrace_id: string;
  error_data: any;
}

// 定义主接口类型
export interface WhatsAppMessage {
  id: string;
  wamid: string;
  wabaId: string;
  from: string;
  to: string;
  conversation: Conversation;
  type: 'template';
  template: Template;
  text: Text;
  image: Image;
  video: Video;
  audio: Audio;
  document: Document;
  sticker: Sticker;
  location: Location;
  interactive: Interactive;
  contacts: Contact[];
  reaction: Reaction;
  context: Context;
  externalId: string;
  status: 'accepted';
  errorCode: 'INTERNAL_SERVER_ERROR';
  errorMessage: string;
  createTime: string;
  updateTime: string;
  sendTime: string;
  deliverTime: string;
  readTime: string;
  totalPrice: number;
  currency: 'USD';
  regionCode: 'US';
  pricingCategory: 'referral_conversion';
  whatsappApiError: WhatsAppApiError;
  bizType: 'whatsapp';
  verificationId: string;
}
