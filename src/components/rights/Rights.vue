<template>
  <div>
    <!--  面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="rights">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightsList" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  async created () {
    const res = await this.$axios.get(`rights/list`)
    // console.log(res)
    this.rightsList = res.data.data
  },
  data () {
    return {
      // 列表数据
      rightsList: []
    }
  },

  methods: {
    // 让序号从0开始
    indexMethod (index) {
      return index
    }
  }
}
</script>

<style>
.rights {
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  background-color: #d4dae0;
  padding-left: 10px;
}
</style>
