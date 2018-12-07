<template>
  <el-container class="home">
    <el-header class="home-header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <img src="@/assets/images/logo.png" alt="黑马logo" class="logo">
        </el-col>
        <el-col :span="6" class="title">
          电商后台管理系统
        </el-col>
        <el-col :span="4" class="member">
          欢迎上海前端22期星曜会员
          <a href="javascript:;" class="logout" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="$route.path" class="home-header-menu" :router="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true">
          <el-submenu :index="menu1.id+''" v-for="menu1 in menuList" :key="menu1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>
            <el-menu-item :index="'/'+menu2.path" v-for="menu2 in menu1.children" :key="menu2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{menu2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getAsideMenu()
  },
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async getAsideMenu () {
      const res = await this.$axios.get('menus')
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.menuList = data
      } else {
        this.$message({
          type: 'error',
          message: meta.msg,
          duration: 800
        })
      }
    },

    // 点击退出
    logout () {
      this.$confirm('您确定是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出登录'
          })
          // 退出到的登录页面
          this.$router.push('/login')
          // 清空localStorage
          localStorage.removeItem('token')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出登录'
          })
        })
    }
  }
}
</script>

<style>
.home {
  height: 100%;
  background-color: #eaeef1;
}

.home-header {
  background-color: #b3c1cd;
  line-height: 60px;
}
.el-header {
  padding: 0;
}
.el-header .logo {
  width: 200px;
}
.el-header .title {
  color: #fff;
  font-weight: bolder;
  font-size: 30px;
}
.el-header .member {
  min-width: 236px;
  font-weight: bolder;
}
.el-header .logout {
  color: #b07a17;
}

.home-header-menu {
  height: 100%;
}
</style>
