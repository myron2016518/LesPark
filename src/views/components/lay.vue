<!-- 蒙层 -->
<template>
	<div class="lay" v-bind:style="{height:screenHeight,width:screenWidth}"></div>
</template>

<script>
	export default{
		name: 'lay',
		data(){
			return{
				screenHeight: '',
				screenWidth: '',
			}
		},
		created(){
			var that = this
			that.screenHeight = window.screen.height+'px'
			that.screenWidth = window.screen.width+'px'
		}
	}
</script>