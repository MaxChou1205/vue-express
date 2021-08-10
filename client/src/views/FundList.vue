<template>
  <div class="fillcontain">
    <el-form :inline="true" ref="search_data" :model="searchData">
      <el-form-item label="時間區間:">
        <el-date-picker
          v-model="searchData.startTime"
          type="datetime"
          placeholder="開始時間"
        >
        </el-date-picker>
        --
        <el-date-picker
          v-model="searchData.endTime"
          type="datetime"
          placeholder="結束時間"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="search" @click="search()"
          >篩選</el-button
        >
      </el-form-item>
      <el-form-item class="btnRight" v-if="user.role === 'admin'">
        <el-button type="primary" size="small" icon="view" @click="onAdd()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{ prop: 'date', order: 'descending' }"
        style="width: 100%"
      >
        <el-table-column type="index" label="序號" align="center" width="70">
        </el-table-column>
        <el-table-column
          prop="date"
          label="建立時間"
          align="center"
          width="250"
          :formatter="dateFormat"
          sortable
        >
          <template #default="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              dateFormat(scope.row.date)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="類型" align="center" width="150">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template #default="scope">
            <span style="color: #00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template #default="scope">
            <span style="color: #f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="現金" align="center" width="170">
          <template #default="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註" align="center" width="220">
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="動作"
          width="320"
          v-if="user.role === 'admin'"
        >
          <template #default="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              @click="onEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              confirmButtonText="確定"
              cancelButtonText="取消"
              icon="el-icon-info"
              iconColor="red"
              title="確定要刪除嗎？"
              @confirm="onDelete(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button type="danger" icon="delete" size="small"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :title="dialog.title"
      :modelValue="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="formDialog"
          :model="formData"
          :rules="form_rules"
          label-width="120px"
          style="margin: 10px; width: auto"
        >
          <el-form-item label="類型:">
            <el-select v-model="formData.type" placeholder="類型">
              <el-option
                v-for="(formtype, index) in format_type_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="description" label="描述:">
            <el-input v-model="formData.description"></el-input>
          </el-form-item>

          <el-form-item prop="income" label="收入:">
            <el-input type="number" v-model="formData.income"></el-input>
          </el-form-item>

          <el-form-item prop="expend" label="支出:">
            <el-input type="number" v-model="formData.expend"></el-input>
          </el-form-item>

          <el-form-item prop="cash" label="現金:">
            <el-input type="number" v-model="formData.cash"></el-input>
          </el-form-item>

          <el-form-item label="備註:">
            <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取消</el-button>
            <el-button type="primary" @click="save('formDialog')"
              >儲存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import {
  apiGetProfiles,
  apiAddProfile,
  apiUpdateProfile,
  apiDeleteProfile,
} from '@/api/profiles';

// import Dialog from '@/components/Dialog';

export default {
  name: 'FundList',
  components: {
    // Dialog,
  },
  data() {
    return {
      tableData: [],
      allTableData: [],
      tableDataTemp: [],
      formData: {
        type: '',
        description: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: '',
      },
      dialog: {
        title: '',
        show: false,
        actionType: '',
      },
      format_type_list: ['現金', '加值', '優惠券'],
      form_rules: {
        description: [
          { required: true, message: '請輸入描述', trigger: 'blur' },
        ],
        income: [{ required: true, message: '請輸入收入', trigger: 'blur' }],
        expend: [{ required: true, message: '請輸入支出', trigger: 'blur' }],
        cash: [{ required: true, message: '請輸入現金', trigger: 'blur' }],
      },
      paginations: {
        page_index: 1, // 當前頁數
        total: 1, // 資料總數
        page_size: 5, // 每頁顯示筆數
        page_sizes: [5, 10, 15, 20], // 筆數選項
        layout: 'total, sizes, prev, pager, next, jumper', // 樣式格式
      },
      searchData: {
        startTime: '',
        endTime: '',
      },
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
  },
  methods: {
    dateFormat(date) {
      if (date == undefined) {
        return '';
      }
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    getData() {
      apiGetProfiles()
        .then((res) => {
          this.allTableData = res.data;
          this.tableDataTemp = res.data;
          this.setPaginations();
        })
        .catch((err) => {
          console.error(err);
          this.$message({
            message: '錯誤',
          });
        });
    },
    save(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let action;
          if (this.dialog.actionType === 'create') {
            action = apiAddProfile;
          } else {
            action = apiUpdateProfile;
          }

          try {
            await action(this.formData);
            this.$message({
              message: '儲存成功',
              type: 'success',
            });

            this.dialog.show = false;
            this.getData();
          } catch (error) {
            console.error(error);
            this.$message({
              message: '發生錯誤，請稍後再試',
              type: 'error',
            });
          }
        } else {
          this.$message({
            message: '請確認欄位是否完整填入',
            type: 'error',
          });
        }
      });
    },
    onAdd() {
      this.dialog = {
        show: true,
        title: '新增內容',
        actionType: 'create',
      };
      this.formData = {};
    },
    onEdit(row) {
      this.dialog = {
        show: true,
        title: '編輯內容',
        actionType: 'edit',
      };

      this.formData = {
        type: row.type,
        description: row.description,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id,
      };
    },
    async onDelete(row, index) {
      try {
        await apiDeleteProfile(row._id);
        this.$message({
          message: '刪除成功',
          type: 'success',
        });
        this.getData();
      } catch (error) {
        console.error(error);
        this.$message({
          message: '發生錯誤，請稍後再試',
          type: 'error',
        });
      }
    },
    handleCurrentChange(page) {
      this.paginations.page_index = page;
      let skipCount = this.paginations.page_size * (page - 1);

      this.tableData = this.allTableData.filter((item, index) => {
        return (
          index < skipCount + this.paginations.page_size && index >= skipCount
        );
      });
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;

      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    search() {
      if (!this.searchData.startTime || !this.searchData.endTime) {
        this.getData();
        return;
      }

      const stime = this.searchData.startTime.getTime();
      const etime = this.searchData.endTime.getTime();
      this.allTableData = this.tableDataTemp.filter((item) => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });

      this.setPaginations();
    },
  },
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.btnRight {
  float: right;
}

.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
