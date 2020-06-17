<template>
  <div id="live-start"
       class='withdraw'>
    <my-header></my-header>
    <loginhome></loginhome>
    <my-footer style="clear: both;"></my-footer>
  </div>
</template>
<script>
import loginhome from './content/loginhome'
import myHeader from 'Views/components/header'
import myFooter from 'Views/components/foot'
export default {
  name: 'app',
  components: {
    loginhome, myFooter, myHeader
  }//组件集合
}
</script>