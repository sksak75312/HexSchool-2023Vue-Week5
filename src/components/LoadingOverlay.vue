<template>
    <loading
      v-model:active="isLoading"
    />
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
  data() {
    return {
      isLoading: false,
      fullPage: true,
    };
  },
  components: {
    Loading,
  },
};
</script>
