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
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
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
      allRoutes:[]
    }
  },
  mounted() {
   /* console.log(1111111111)
    let prm = {
      pageSize:15,
      pageNum:1
    }
    menuList(prm).then(res=>{
      let {result} = res.data;
      this.allRoutes = result.list
      for (let j = 0;j<this.allRoutes.length;j++){
        this.allRoutes[j] = this.formatMenus(this.allRoutes[j])
      }
      console.log("all",this.allRoutes)
    })*/
  },
  methods:{
    formatMenus(menu){
      menu.meta = {title:menu.name,ico:item.ico}
      menu.children = menu.subMenus
      if (menu.subMenus&&menu.subMenus.length>0){
        for (let i = 0;i<menu.subMenus.length;i++){
          this.formatMenus(menu.subMenus[i])
        }
      }
      return menu
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
