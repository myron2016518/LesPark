<template>
	<div id="live-start">
		<my-header></my-header>
		<liveStart></liveStart>
		<my-footer></my-footer>
	</div>
</template>

<script>
	import myHeader from 'Views/components/header'
	import myFooter from 'Views/components/foot'
	import liveStart from './content/liveStart'
	export default {
		name: 'app',
		components:{
    	 myHeader,
		 myFooter,
		liveStart
    }
	}
</script>