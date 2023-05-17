/* jsx语法中,上面不能有template */
<script>
import menuList from "@/config/menuConfig.js";
import memoryUtils from "@/utils/memoryUtils.js";
export default {
  data() {
    return {
      //页面要展示的菜单项
      menuNodes: "",
    };
  },
  render() {
    return (
      <div class="navbar">
        <el-menu
          router={true}
          default-active={this.$route.path}
          default-openeds={["/students"]}
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          {this.menuNodes}
        </el-menu>
      </div>
    );
  },
  components: {},
  mounted() {
    this.menuNodes = this.getMenuNodes(menuList);
  },

  methods: {
    //判断权限是否拥有
    hasAuth(item) {
      //menulist中的某一个元素
      const { index, isPublic } = item;
      //当前的登陆的用户权限列表
      const menus = memoryUtils.user.role.menus;
      //当前登录的用户名
      const username = memoryUtils.user.username;
      console.log("username", username);
      /* 
  当前登录的用户是否是超级管理员(admin)
  当前item是否为isPublic
  当前登陆的用户列表(menus)中是否包含item的index
  */
      if (username === "admin" || isPublic || menus.indexOf(index) !== -1) {
        return true;
      } else if (item.children) {
        return !!item.children.find(
          (child) => menus.indexOf(child.index) !== -1
        );
      } else {
        return false;
      }
    },
    //下方的方法获取了侧边菜单栏的项目
    getMenuNodes(menuList) {
      console.log(menuList);
      console.log("调用该方法获取了侧边菜单栏的项目");
      return menuList.map((item) => {
        if (this.hasAuth(item)) {
          if (!item.children) {
            return (
              <el-menu-item index={item.index}>
                <i class={item.icon}></i>
                <span slot="title">{item.title}</span>
              </el-menu-item>
            );
          } else {
            return (
              <el-submenu index={item.index}>
                <template slot="title">
                  <i class={item.icon}></i>
                  <span>{item.title}</span>
                </template>
                {this.getMenuNodes(item.children)}
              </el-submenu>
            );
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.el-menu {
  border-right: 0;
}
</style>