export default {
  created () {
    this.getUsersList()
  },

  data () {
    return {
      // 查询的数据
      usersList: [],
      // 总页数
      total: 0,
      // 每页显示条目个数
      pagesize: 2,
      // 搜索内容
      search: '',
      // 展示第几页数据
      pagenum: 1,
      // 添加数据
      dialogFormVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '用户名长度为3到12个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为6到12个字符', trigger: 'blur' }
        ],
        email: [
          {
            // pattern 表示使用正则表达式对数据进行校验
            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^1(3|4|5|7|8)\d{9}$/,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取数据
    async getUsersList (pagenum = 1, query = '') {
      // this.$axios.get() 方法返回值就是一个 Promise 对象
      const res = await this.$axios.get('users', {
        // GET请求参数
        params: {
          // 每页显示条目个数
          pagesize: this.pagesize,
          // 第几页
          pagenum,
          // 查询条件
          query
        }
      })

      // console.log('用户列表数据为：',res)
      if (res.data.meta.status === 200) {
        /// 成功获取数据
        this.usersList = res.data.data.users
        // 总条数
        this.total = res.data.data.total
        // 设置当前页
        this.pagenum = res.data.data.pagenum
      } else {
        // 获取数据失败，跳转到登录页
        this.$router.push('/login')
        // 清空token
        localStorage.removeItem('token')
      }
    },
    // currentPage 改变时会触发
    currentChange (curPage) {
      // curPage表示当前页
      // console.log(curPage)
      this.getUsersList(curPage, this.search)
    },
    // 查询
    searchList () {
      this.getUsersList(1, this.search)
    },
    // 改变用户的状态
    async changeUserState (state) {
      const res = await this.$axios.put(
        `users/${state.id}/state/${state.mg_state}`
      )
      // console.log(res)
      if (res.data.data.mg_state === 1) {
        this.$message({
          message: '启用成功',
          type: 'success',
          duration: 800
        })
      } else {
        this.$message({
          message: '禁用成功',
          type: 'success',
          duration: 600
        })
      }
    },

    // 显示添加用户对话框
    isShowAddUserDialog () {
      this.dialogFormVisible = true
    },

    // 添加用户
    async addUser () {
      try {
        const res = await this.$axios.post('users', this.addUserForm)
        const { meta } = res.data
        if (meta.status === 201) {
          // 添加成功
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 600
          })
          // 重新刷新页面
          this.getUsersList(1, this.search)
          // 关闭添加用户对话框
          this.dialogFormVisible = false
        } else {
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 800
          })
        }
      } catch (e) {}
    },

    // 清空对话框的数据
    clearAddUserMsg () {
      // 重置表单
      this.$refs.addUserFormMsg.resetFields()
    },

    // 删除用户数据
    async delUser (id) {
      try {
        await this.$confirm('您确定删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送请求,删除
        const res = await this.$axios.delete(`users/${id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 800
          })
          // 重新刷新页面
          this.getUsersList(1, this.search)
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '取消删除',
          duration: 800
        })
      }
    }
  },

  // 监视搜索框的变化
  watch: {
    search (curVal) {
      if (curVal.trim().length === 0) {
        this.getUsersList()
      }
    }
  }
}
