import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
    num : 1
}
const getters = {
    
}
const mutations = {
    add(state){
        state.num++;
    }
}
export default new Vuex.Store({
    state,mutations,getters,actions
})