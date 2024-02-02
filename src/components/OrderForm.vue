<template>
  <VForm class="col-md-6" @submit="postOrder" v-slot="{ errors }" ref="form">
    <div class="mb-3">
      <label for="email" class="form-label">信箱</label>
      <VField
        type="email"
        id="email"
        name="信箱"
        class="form-control"
        placeholder="請輸入信箱"
        v-model="data.user.email"
        rules="required|email"
        :class="{ 'is-invalid': errors['信箱'] }"
      >
      </VField>
      <ErrorMessage name="信箱" class="invalid-feedback"></ErrorMessage>
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">收件人姓名</label>
      <VField
        type="text"
        id="name"
        name="姓名"
        class="form-control"
        placeholder="請輸入姓名"
        v-model="data.user.name"
        rules="required"
        :class="{ 'is-invalid': errors['姓名'] }"
      >
      </VField>
      <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
    </div>
    <div class="mb-3">
      <label for="tel" class="form-label">收件人電話</label>
      <VField
        type="tel"
        id="tel"
        name="電話"
        class="form-control"
        placeholder="請輸入電話"
        v-model="data.user.tel"
        rules="required|min:6"
        :class="{ 'is-invalid': errors['電話'] }"
      >
      </VField>
      <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
    </div>
    <div class="mb-3">
      <label for="address" class="form-label">收件人地址</label>
      <VField
        type="text"
        id="address"
        name="地址"
        class="form-control"
        placeholder="請輸入地址"
        v-model="data.user.address"
        rules="required"
        :class="{ 'is-invalid': errors['地址'] }"
      >
      </VField>
      <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
    </div>
    <div class="mb-3">
      <label for="message" class="form-label">留言</label>
      <VField
        type="email"
        id="message"
        name="message"
        class="form-control"
        placeholder="有問題都可以留言~~"
        as="textarea"
        rows="5"
        v-model="data.message"
        :class="{ 'is-invalid': errors['message'] }"
      >
      </VField>
      <ErrorMessage name="message" class="invalid-feedback"></ErrorMessage>
    </div>
    <div class="text-end">
      <button type="submit" class="btn btn-danger">送出訂單</button>
    </div>
  </VForm>
</template>

<script>
import { passAlert, errorAlert } from '@/assets/js/swal';
import { defineRule, configure } from 'vee-validate';
import * as AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});
setLocale('zh_TW');

const { VITE_API, VITE_PATH } = import.meta.env;
export default {
  data() {
    return {
      data: {
        user: {},
      },
    };
  },

  methods: {
    postOrder() {
      this.$http
        .post(`${VITE_API}/v2/api/${VITE_PATH}/order`, { data: this.data })
        .then((res) => {
          passAlert(res.data.message);
          this.$refs.form.resetForm();
          this.resetCart();
        })
        .catch((err) => {
          errorAlert(err.response.data.message);
        });
    },

    resetCart() {
      this.$emit('reset-cart');
    },
  },
};
</script>
