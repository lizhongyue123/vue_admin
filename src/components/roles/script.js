export default {
  created () {
    // 调用角色列表
    this.getRolesList()

    // 调用树形控件的数据
    this.getTreeRolesList()
  },
  data () {
    return {
      // 列表数据
      rolesList: [],

      // 角色id
      roleId: -1,

      // 是否显示树形控件的对话框
      showRulesTreeDialog: false,

      // 树形控件的数据
      treeRolesList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
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

    // 渲染树形控件的数据列表
    async getTreeRolesList () {
      const res = await this.$axios.get(`rights/tree`)
      // console.log(res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        // 成功
        // 填充树形控件中的数据
        this.treeRolesList = data
      } else {
        // 失败
        this.$message({
          type: 'error',
          message: meta.msg,
          duration: 800
        })
      }
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
    },

    // 是否显示树形控件的对话框
    isShowRolesTree (treeRolesCur) {
      // 显示树形控件的对话框
      this.showRulesTreeDialog = true

      // 设置角色id
      this.roleId = treeRolesCur.id

      // 设置当前角色拥有的权限,并且选中
      this.$nextTick(() => {
        const curTreeId = []
        console.log(treeRolesCur)
        treeRolesCur.children.forEach(treeLevel1 => {
          treeLevel1.children.forEach(treeLevel2 => {
            treeLevel2.children.forEach(treeLevel3 => {
              curTreeId.push(treeLevel3.id)
            })
          })
        })
        // setCheckedKeys 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
        this.$refs.tree.setCheckedKeys(curTreeId)
      })
    },

    // 分配当前角色拥有的权限
    async assginTreeRoles () {
      // 全选中
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 半选中
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 拼接为一个新的数组
      const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

      const res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: allCheckedKeys.join()
      })
      // console.log(res)
      const { meta } = res.data
      if (meta.status === 200) {
        // 更新成功
        this.$message({
          type: 'success',
          message: meta.msg,
          duration: 800
        })
        // 隐藏树形控件的对话框
        this.showRulesTreeDialog = false
        // 刷新列表数据
        this.getRolesList()
      }
    }
  }
}
