<template>
	<div class="container">
		<my-header></my-header>
		<mess></mess>
		<my-footer></my-footer>
	</div>
</template>

<script>
import mess from './content/mess'
import myHeader from 'Views/components/header'
import myFooter from 'Views/components/foot'

export default {
	name: 'app',
	components:{
    	myHeader: myHeader,
    	mess: mess,
        myFooter: myFooter
    }
}
</script>