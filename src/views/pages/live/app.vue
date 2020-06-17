<template>
  <div id="app"
       class="lala_live">
    <my-header></my-header>
    <user-live></user-live>
    <my-footer></my-footer>
  </div>
</template>
<script>
import UserLive from './content/userLive'
import myHeader from 'Views/components/header'
import myFooter from 'Views/components/foot'
export default {
  name: 'app',
  components: {
    UserLive, myFooter, myHeader
  }//组件集合
}
</script>