<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        mode="vertical"
      >
        <sidebar-item v-for="route in tempRoutes" :key="route.path" :item="route" :base-path="route.path" />
<!--        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />-->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { menuList } from "../../../api/menuManagement";
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data(){
    return{
      allRoutes:[],
      tempRoutes:[]
    }
  },
  mounted() {
    let prm = {
      pageSize:100,
      pageNum:1
    }
    menuList(prm).then(res=>{
      let {result} = res.data;
      this.allRoutes = result.list
      for (let i = 0;i<this.allRoutes.length;i++){
        if (this.allRoutes[i].subMenus&&this.allRoutes[i].subMenus.length>0){
          this.tempRoutes.push({
            meta:{title:this.allRoutes[i].name,icon:this.allRoutes[i].ico},
            name:this.allRoutes[i].name,
            path:this.allRoutes[i].route?this.allRoutes[i].route:`${i}`,
            children:this.formatMenus(this.allRoutes[i].subMenus)
          })
        }else{
          this.tempRoutes.push({
            meta:{title:this.allRoutes[i].name,icon:this.allRoutes[i].ico},
            name:this.allRoutes[i].name,
            path:this.allRoutes[i].route?this.allRoutes[i].route:`${i}`,
          })
        }
        // this.tempRoutes = this.formatMenus(this.allRoutes[i])
      }
      console.log("temp",this.tempRoutes)

      console.log("all",this.allRoutes)
    })
  },
  methods:{
    formatMenus(menu){
      let all = []
      for (let i= 0;i<menu.length;i++){
        let temp = {}
        temp.meta = {title:menu[i].name,icon:menu[i].ico}
        temp.path = menu[i].route
        temp.name = menu[i].name
        if (menu[i].subMenus&&menu[i].subMenus.length>0){
          temp.children = menu[i].subMenus
          for (let i = 0;i<temp.children.length;i++){
            this.formatMenus(temp.children[i])
          }
        }
        all.push(temp)
      }

      return all
    }
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
