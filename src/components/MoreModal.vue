<template>
  <div
    class="modal fade"
    id="productModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modalNode"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ tempData.title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="tempData.imageUrl" />
            </div>
            <div class="col-sm-6 d-flex flex-column">
              <span class="align-self-start badge bg-primary rounded-pill">{{
                tempData.category
              }}</span>
              <p>商品描述：{{ tempData.description }}</p>
              <p>商品內容：{{ tempData.content }}</p>
              <del class="h6">原價 {{ tempData.origin_price }} 元</del>
              <div class="h5">現在只要 {{ tempData.price }} 元</div>
              <div class="mt-auto">
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    min="1"
                    v-model="qty"
                  />
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addToCart(tempData.id)"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tempData'],
  data() {
    return {
      modalNode: null,
      qty: 1,
    };
  },

  methods: {
    // 關閉 Modal
    closeModal() {
      this.modalNode.hide();
      this.qty = 1;
    },

    // Emit 呼叫父層方法
    addToCart(productId) {
      this.$emit('add-to-cart', productId, this.qty);
      this.closeModal();
    },
  },

  mounted() {
    // 綁定 Modal 節點
    this.modalNode = new this.$bs.Modal(this.$refs.modalNode, {
      backdrop: 'static',
      keyboard: false,
    });
  },
};
</script>
