<template>
    <div id="live-start" class='withdraw'>
        <my-header></my-header>
        <withdraw></withdraw>
        <my-footer></my-footer>
    </div>
</template>
<script>
    import withdraw from './content/withdraw'
    import myHeader from 'Views/components/header'
    import myFooter from 'Views/components/foot'
    export default {
        name: 'app',
        components: {
            withdraw, myFooter, myHeader
        }//组件集合
    }
</script>