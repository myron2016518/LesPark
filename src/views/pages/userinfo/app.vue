<template>
  <div id="live-start"
       class='withdraw'>
    <my-header></my-header>
    <userinfo></userinfo>
    <my-footer style="clear: both;"></my-footer>
  </div>
</template>
<script>
import userinfo from './content/userinfo'
import myHeader from 'Views/components/header'
import myFooter from 'Views/components/foot'
export default {
  name: 'app',
  components: {
    userinfo, myFooter, myHeader
  }//组件集合
}
</script>