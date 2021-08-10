<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">後台管理系统</span>
      </div>
      <el-form
        :model="loginUser"
        :rules="rules"
        class="loginForm"
        ref="loginForm"
        label-width="60px"
      >
        <el-form-item label="信箱" prop="email">
          <el-input
            v-model="loginUser.email"
            placeholder="請輸入信箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="loginUser.password"
            placeholder="請輸入密碼"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            class="submit_btn"
            @click.prevent="submitForm('loginForm')"
            >登入</el-button
          >
        </el-form-item>

        <div class="registerTip">
          還沒有帳號嗎? 點擊
          <router-link to="/register" class="tipLink">這裡</router-link>註冊
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
// import jwt_decode from 'jwt-decode';
import { apiLogin } from '@/api/users';
export default {
  name: 'register',
  data() {
    return {
      loginUser: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          {
            type: 'email',
            required: true,
            message: '信箱格式不正確',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          {
            min: 6,
            max: 30,
            message: '密碼長度在 6 到 30 個字之間',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          apiLogin(this.loginUser).then((res) => {
            const token = res.data['token'];
            if (token) {
              localStorage.setItem('x-auth-token', token);

              this.$store.dispatch('auth/initLogin');

              this.$router.push('/index');
            } else {
              this.$message({
                message: '無法驗證，請稍後再試',
                type: 'error',
              });
            }
          });
        } else {
          this.$message({
            message: '請確認輸入欄位',
            type: Error,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}

.registerTip {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
}

.tipLink {
  color: #77aadd;
}
.tipLink:hover {
  color: #3a84ce;
}
</style>
