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
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请选择活动区域', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          {
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            type: 'date',
            message: '请选择时间',
            trigger: 'change'
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

    // 显示添加用户文本框
    isShowAddUserDialog () {
      this.dialogFormVisible = true
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
