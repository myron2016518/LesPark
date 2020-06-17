<template>
  <div id="live-start"
       class='withdraw'>
    <my-header></my-header>
    <topic></topic>
    <my-footer style="clear: both;"></my-footer>
  </div>
</template>
<script>
import topic from './content/topic'
import myHeader from 'Views/components/header'
import myFooter from 'Views/components/foot'
export default {
  name: 'app',
  components: {
    topic, myFooter, myHeader
  }//组件集合
}
</script>