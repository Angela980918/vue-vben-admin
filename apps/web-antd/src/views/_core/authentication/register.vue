<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationRegister, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message as AntDmessage } from 'ant-design-vue';

import { reqCommonResgister } from '#/api';

defineOptions({ name: 'Register' });

const loading = ref(false);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.loginandregisterTip'),
      },
      fieldName: 'account',
      label: $t('authentication.username'),
      rules: z
        .string({
          required_error: $t('authentication.accountFormatError'),
          invalid_type_error: $t('authentication.accountFormatError'),
        })
        .refine(
          (val) => {
            const isPhone = /^1[3-9]\d{9}$/.test(val); // 国内手机号校验
            const isEmail = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(val); // 简单邮箱校验
            return isPhone || isEmail;
          },
          {
            message: $t('authentication.accountFormatError'),
          },
        ),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
      rules: z
        .string()
        .min(10, { message: $t('authentication.passwordTip') })
        .max(20, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.confirmPassword'),
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ required_error: $t('authentication.passwordTip') })
            .min(10, { message: $t('authentication.passwordTip') })
            .max(20, { message: $t('authentication.passwordTip') })
            .refine((value) => value === password, {
              message: $t('authentication.confirmPasswordTip'),
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: $t('authentication.confirmPassword'),
    },
    {
      component: 'VbenCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            $t('authentication.agree'),
            h(
              'a',
              {
                class: 'vben-link ml-1 ',
                href: '',
              },
              `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
            ),
          ]),
      }),
      rules: z.boolean().refine((value) => !!value, {
        message: $t('authentication.agreeTip'),
      }),
    },
  ];
});
const router = useRouter();
type RegisterFormValue = {
  account: string;
  agreePolicy: boolean;
  confirmPassword: string;
  password: string;
};
const handleSubmit = async (value: Recordable<any>) => {
  loading.value = true;
  try {
    const { account, password, confirmPassword } = value as RegisterFormValue;
    const { message, user } = await reqCommonResgister({
      account,
      password,
      confirmPassword,
    });
    AntDmessage.success(message).then(() => {
      // 注册成功后，跳转到登录页
      router.push('/auth/login');
    });
    return user;
  } catch (error) {
    console.error('Error during registration:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthenticationRegister
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
