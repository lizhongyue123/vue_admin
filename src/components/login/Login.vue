<template>
  <!--
    el-form  表单组件
      model  表单数据对象
      rules  表单验证规则
      label-width  表单域标签的宽度
      label-position="top" 用于设置表单域标签的位置, top表示顶部

    el-form-item 表单中的每一行
      label 标签文本(其实就是每一行表单的说明文字)
      prop  表单域model字段,在使用validata(表单验证)/resetFields(重置表单)
              方法的情况下,该属性是必填的.
-->
  <div class="login">
    <el-row class="login" type="flex" justify="center" align="middle">
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
        <el-form :model="loginForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top" class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type='password'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>

</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        // 用户名和密码的校验规则
        username: [
          // require  是否为必填项, true为必填项
          // message  表单教案失败时,展示的提示信息
          // trigger  表示触发表单验证的时机
          // min和max配合用来限制表单内容的长度
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录事件
    async submitForm (formName) {
      try {
        // validate方法用来实现表单校验
        // 若不传入回调函数，则会返回一个 promise
        await this.$refs.ruleForm.validate()
        // 校验成功
        const res = await this.$axios.post('login', this.loginForm)
        // console.log(res)
        if (res.data.meta.status === 200) {
          // 登录成功
          // 将数据存储到localStorage中
          localStorage.setItem('token', res.data.data.token)
          // 通过编程式导航实现路由跳转
          // push方法的参数是: 要跳转到的页面路径,与路由规则中的path匹配
          this.$router.push('/home')
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            // 显示时间, 毫秒。设为 0 则不会自动关闭
            // 默认值是3000
            duration: 800
          })
        } else {
          // 登录失败
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (error) {
        // 校验失败，不需要进行任何处理
        // console.log('表单校验失败: ', error)
      }
    },
    resetForm (formName) {
      // resetFields方法用来重置表单
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background: #2d434c;
}
.login-form {
  padding: 20px;
  border-radius: 15px;
  background-color: #fff;
}
</style>
