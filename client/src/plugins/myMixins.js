import { mapState, mapMutations } from 'vuex'
 
const myPlugins = {
    install(Vue){
        Vue.mixin({
            data: () => ({
                api: 'http://localhost:2929/',
                updatedBy:"Charles"
            }),
            computed: {
                ...mapState([
                    'cartItems'
                ])
            },
            methods: {
                ...mapMutations([
                    'ADD_CART_ITEM',
                    "REMOVE_CART_ITEM",
                    "TRUNCATE_CART_ITEM"
                ])
            }
        })
    }
}
 
export default myPlugins