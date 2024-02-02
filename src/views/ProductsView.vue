<template>
  <div class="container">
    <div class="mt-4">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td style="width: 200px">
              <div
                style="
                  height: 100px;
                  background-size: cover;
                  background-position: center;
                "
                :style="{ backgroundImage: `url(${product.imageUrl})` }"
              ></div>
            </td>
            <td>{{ product.title }}</td>
            <td>
              <del class="h6">原價 {{ product.origin_price }} 元</del>
              <div class="h5">現在只要 {{ product.price }} 元</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="openModal(product)"
                >
                  <i class="fas fa-spinner fa-pulse"></i>
                  查看更多
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="postCart(product.id)"
                >
                  <i class="fas fa-spinner fa-pulse"></i>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <template v-if="cartData?.final_total">
        <div class="text-end">
          <button
            class="btn btn-outline-danger"
            type="button"
            @click="deleteCart(null, '是否清空購物車')"
          >
            清空購物車
          </button>
        </div>
        <table class="table align-middle">
          <thead>
            <tr>
              <th></th>
              <th>品名</th>
              <th style="width: 150px">數量/單位</th>
              <th class="text-end">單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cart in cartData?.carts" :key="cart.id">
              <td>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteCart(cart.id, `是否刪除 ${cart.product.title}`)"
                >
                  <i class="fas fa-spinner fa-pulse"></i>
                  x
                </button>
              </td>
              <td>
                <div>{{ cart.product.title }}</div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3">
                    <input
                      min="1"
                      type="number"
                      class="form-control"
                      :value="cart.qty"
                      @input="putCart(cart.id, $event)"
                    />
                    <span class="input-group-text" id="basic-addon2">{{
                      cart.product.unit
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="text-end">
                {{ cart.total }}
              </td>
            </tr>
            <!-- </template> -->
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-end">總計</td>
              <td class="text-end">{{ cartData?.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="my-5 row justify-content-center">
          <OrderForm @reset-cart="getCart" />
        </div>
      </template>
    </div>
  </div>
  <MoreModalVue :tempData="tempData" ref="moreModal" @add-to-cart="postCart" />
  <LoadingOverlayVue ref="LoadingOverlay" />
</template>

<script>
import debounce from 'lodash.debounce';
import { passAlert, errorAlert, confirmAlert } from '@/assets/js/swal';

import MoreModalVue from '@/components/MoreModal.vue';
import OrderForm from '@/components/OrderForm.vue';
import LoadingOverlayVue from '@/components/LoadingOverlay.vue';

const { VITE_API, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      products: null,
      cartData: null,
      tempData: {},
    };
  },
  methods: {
    // 取得客戶產品
    getClientProducts() {
      this.$refs.LoadingOverlay.isLoading = true;
      this.$http
        .get(`${VITE_API}/v2/api/${VITE_PATH}/products`)
        .then((res) => {
          this.products = res.data.products;
          this.$refs.LoadingOverlay.isLoading = false;
        })
        .catch((err) => {
          errorAlert(err.response.data.message);
          this.$refs.LoadingOverlay.isLoading = false;
        });
    },

    // 新增購物車品項
    postCart(productId, qty = 1) {
      this.$refs.LoadingOverlay.isLoading = true;
      const data = {
        product_id: productId,
        qty,
      };
      this.$http
        .post(`${VITE_API}/v2/api/${VITE_PATH}/cart`, { data })
        .then((res) => {
          passAlert(res.data.message);
          this.getCart();
          this.$refs.LoadingOverlay.isLoading = false;
        })
        .catch((err) => {
          this.$refs.LoadingOverlay.isLoading = false;
          errorAlert(err.response.data.message);
        });
    },

    // 取得購物車資訊
    getCart() {
      this.$refs.LoadingOverlay.isLoading = true;
      this.$http
        .get(`${VITE_API}/v2/api/${VITE_PATH}/cart`)
        .then((res) => {
          this.$refs.LoadingOverlay.isLoading = false;
          this.cartData = res.data.data;
        })
        .catch((err) => {
          this.$refs.LoadingOverlay.isLoading = false;
          errorAlert(err.response.data.message);
        });
    },

    // 修改購物車數量
    putCart: debounce(function (productId, e) {
      this.$refs.LoadingOverlay.isLoading = true;
      const data = {
        product_id: productId,
        qty: Number(e.target.value),
      };
      this.$http
        .put(`${VITE_API}/v2/api/${VITE_PATH}/cart/${productId}`, { data })
        .then((res) => {
          this.$refs.LoadingOverlay.isLoading = false;
          passAlert(res.data.message);
        })
        .catch((err) => {
          this.$refs.LoadingOverlay.isLoading = false;
          errorAlert(err.response.data.message);
        });
    }, 1000),

    // 刪除購物車全品項及單一品項
    async deleteCart(productId, message) {
      const { isConfirmed } = await confirmAlert(message);
      if (isConfirmed) {
        this.$refs.LoadingOverlay.isLoading = true;
        const path = productId
          ? `/v2/api/${VITE_PATH}/cart/${productId}`
          : `/v2/api/${VITE_PATH}/carts`;
        this.$http
          .delete(`${VITE_API}${path}`)
          .then((res) => {
            passAlert(res.data.message);
            this.getCart();
            this.$refs.LoadingOverlay.isLoading = false;
          })
          .catch((err) => {
            errorAlert(err.response.data.message);
            this.$refs.LoadingOverlay.isLoading = false;
          });
      }
    },

    // 打開 modal
    openModal(product) {
      this.$refs.moreModal.modalNode.show();
      this.tempData = product;
    },
  },

  mounted() {
    this.getClientProducts();
    this.getCart();
  },

  components: {
    MoreModalVue,
    OrderForm,
    LoadingOverlayVue,
  },
};
</script>
