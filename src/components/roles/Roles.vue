<template>
  <div>
    <!--  面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="rights">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rolesList" stripe style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">暂无权限</el-row>
          <el-row v-else v-for="level1 in scope.row.children" :key="level1.id" class="level1">
            <el-col :span="4">
              <el-tag closable type="" @close="delTag(level1.id,scope.row.id)">
                {{level1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in level1.children" :key="level2.id" class="leval2">
                <el-col :span="4">
                  <el-tag closable type="success" @close="delTag(level2.id,scope.row.id)">
                    {{level2.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <span v-for="level3 in level2.children" :key="level3.id">
                    <el-tag closable type="warning" class="level3" @close="delTag(level3.id,scope.row.id)">
                      {{level3.authName}}
                    </el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <!-- 删除 -->
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          <!-- 分配角色 -->
          <el-button type="success" plain size="mini" icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  created () {
    // 调用角色列表
    this.getRolesList()
  },
  data () {
    return {
      // 列表数据
      rolesList: []
    }
  },

  methods: {
    // 让序号从0开始
    indexMethod (index) {
      return index
    },

    // 渲染角色列表
    async getRolesList () {
      try {
        const res = await this.$axios.get('roles')
        // console.log(res)
        const { meta } = res.data
        // 成功
        if (meta.status === 200) {
          // 赋值
          this.rolesList = res.data.data
        } else {
          // 失败
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 800
          })
        }
      } catch (e) {}
    },

    // 删除角色指定权限
    // 第一个参数：表示权限id
    // 第二个参数：角色id
    async delTag (rightId, roleId) {
      try {
        const res = await this.$axios.delete(
          `roles/${roleId}/rights/${rightId}`
        )
        console.log(res)
        const { meta } = res.data
        // 成功
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 800
          })
          // 重新刷新页面
          this.getRolesList()
        } else {
          // 失败
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 800
          })
        }
      } catch (e) {}
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

.level1 {
  margin-top: 10px;
  border-bottom: 1px dashed #ccc;
}
.level2 {
  margin-bottom: 5px;
}
.level3 {
  margin: 0 5px 10px 0;
}
</style>
