import Vue from 'vue'
//import FeedPage from './FeedPage.vue'
import RecoredPage from './RecoredPage.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(RecoredPage),
}).$mount('#app')
