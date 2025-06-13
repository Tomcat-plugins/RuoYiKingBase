<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资产名称" prop="zcmc">
        <el-input
          v-model="queryParams.zcmc"
          placeholder="请输入资产名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="openImportDialog"
        >批量导入</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="assetList"
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="中心资产编号" align="center" prop="zxzcbh" />
      <el-table-column label="资产分类" align="center" prop="zcfl" />
      <el-table-column label="资产类型" align="center" prop="zclx" />
      <el-table-column label="资产名称" align="center" prop="zcmc" />
      <el-table-column label="品牌" align="center" prop="pp" />
      <el-table-column label="设备型号" align="center" prop="sbxh" />
      <el-table-column label="入库数量" align="center" prop="rksl" />
      <el-table-column label="库存数量" align="center" prop="kcsl" />
      <el-table-column label="计量单位" align="center" prop="jldw" />
      <el-table-column label="资产购入方式" align="center" prop="zcgrfs" />
      <el-table-column label="购买日期" align="center" prop="gmrq" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gmrq, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备单价" align="center" prop="sbdj" />
      <el-table-column label="供应商" align="center" prop="gys" />
      <el-table-column label="联系人" align="center" prop="lxr" />
      <el-table-column label="联系电话" align="center" prop="lxdh" />
      <el-table-column label="入库日期" align="center" prop="rkrq" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rkrq, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库人员" align="center" prop="rkry" />
      <el-table-column label="所属科室" align="center" prop="ssks" />
      <el-table-column label="房间编号" align="center" prop="fjbh" />
      <el-table-column label="合同名称" align="center" prop="htmc" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="说明" align="center" prop="shuoming" />
      <el-table-column label="文件地址" align="center" prop="fileurl" />
      <!-- <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['assets:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['assets:info:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改资产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="主键" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键" :disabled="true" />
        </el-form-item> -->
        <el-form-item label="中心资产编号" prop="zxzcbh">
          <el-input v-model="form.zxzcbh" placeholder="请输入中心资产编号" />
        </el-form-item>
        <el-form-item label="资产分类" prop="zcfl">
          <el-input v-model="form.zcfl" placeholder="请输入资产分类" />
        </el-form-item>
        <el-form-item label="资产类型" prop="zclx">
          <el-input v-model="form.zclx" placeholder="请输入资产类型" />
        </el-form-item>
        <el-form-item label="资产名称" prop="zcmc">
          <el-input v-model="form.zcmc" placeholder="请输入资产名称" />
        </el-form-item>
        <el-form-item label="品牌" prop="pp">
          <el-input v-model="form.pp" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="设备型号" prop="sbxh">
          <el-input v-model="form.sbxh" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="入库数量" prop="rksl">
          <el-input v-model="form.rksl" placeholder="请输入入库数量" />
        </el-form-item>
        <el-form-item label="库存数量" prop="kcsl">
          <el-input v-model="form.kcsl" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="计量单位" prop="jldw">
          <el-input v-model="form.jldw" placeholder="请输入计量单位" />
        </el-form-item>
        <el-form-item label="资产购入方式" prop="zcgrfs">
          <el-input v-model="form.zcgrfs" placeholder="请输入资产购入方式" />
        </el-form-item>
        <el-form-item label="购买日期" prop="gmrq">
          <el-date-picker clearable size="small"
            v-model="form.gmrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择购买日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备单价" prop="sbdj">
          <el-input v-model="form.sbdj" placeholder="请输入设备单价" />
        </el-form-item>
        <el-form-item label="供应商" prop="gys">
          <el-input v-model="form.gys" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="联系人" prop="lxr">
          <el-input v-model="form.lxr" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="form.lxdh" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="入库日期" prop="rkrq">
          <el-date-picker clearable size="small"
            v-model="form.rkrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库人员" prop="rkry">
          <el-input v-model="form.rkry" placeholder="请输入入库人员" />
        </el-form-item>
        <el-form-item label="所属科室" prop="ssks">
          <el-input v-model="form.ssks" placeholder="请输入所属科室" />
        </el-form-item>
        <el-form-item label="房间编号" prop="fjbh">
          <el-input v-model="form.fjbh" placeholder="请输入房间编号" />
        </el-form-item>
        <el-form-item label="合同名称" prop="htmc">
          <el-input v-model="form.htmc" placeholder="请输入合同名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="说明" prop="shuoming">
          <el-input v-model="form.shuoming" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="文件地址" prop="fileurl">
          <el-input v-model="form.fileurl" placeholder="请输入文件地址" />
        </el-form-item>
        <!-- <el-form-item label="创建者" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入创建者" :disabled="true" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
           <el-date-picker clearable size="small"
            v-model="form.createTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择创建时间"
            :disabled="true">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="更新者" prop="updateBy">
          <el-input v-model="form.updateBy" placeholder="请输入更新者" :disabled="true" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updateTime">
           <el-date-picker clearable size="small"
            v-model="form.updateTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择更新时间"
            :disabled="true">
          </el-date-picker> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog title="批量导入" :visible.sync="importDialogVisible" width="400px">
      <el-upload
        ref="upload"
        :action="importUrl"
        :headers="uploadHeaders"
        :show-file-list="true"
        :auto-upload="false"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
        :before-upload="beforeUpload"
      >
        <el-button slot="trigger" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">仅支持 .xls/.xlsx 格式</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitImport">上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listAsset, getAsset, delAsset, addAsset, updateAsset, exportAsset } from "@/api/assets/index";

export default {
  name: "Asset",
  dicts: ['zc_fl', 'zc_lx', 'zc_grfs'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 资产表格数据
      assetList: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        zcmc: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        zcmc: [
          { required: true, message: "资产名称不能为空", trigger: "blur" }
        ]
        // TODO: 根据实际需求添加其他字段的校验规则
      },
      importDialogVisible: false,
      importUrl: process.env.VUE_APP_BASE_API + "/assets/info/import",
      uploadHeaders: {
        Authorization: "Bearer " + (this.$store?.state?.user?.token || "")
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资产列表 */
    getList() {
      this.loading = true;
      listAsset(this.queryParams).then(response => {
        this.assetList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAsset(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资产";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAsset(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAsset(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除资产编号为"' + ids + '"的数据项？').then(() => {
        return delAsset(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('是否确认导出所有资产数据项？').then(() => {
        this.exportLoading = true;
        return exportAsset(this.queryParams);
      }).then(response => {
        this.download(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        zxzcbh: undefined,
        zcfl: undefined,
        zclx: undefined,
        zcmc: undefined,
        pp: undefined,
        sbxh: undefined,
        rksl: undefined,
        kcsl: undefined,
        jldw: undefined,
        zcgrfs: undefined,
        gmrq: undefined,
        sbdj: undefined,
        gys: undefined,
        lxr: undefined,
        lxdh: undefined,
        rkrq: undefined,
        rkry: undefined,
        ssks: undefined,
        fjbh: undefined,
        htmc: undefined,
        remark: undefined,
        shuoming: undefined,
        fileurl: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    openImportDialog() {
      this.importDialogVisible = true;
    },
    submitImport() {
      this.$refs.upload.submit();
    },
    handleImportSuccess(response) {
      this.importDialogVisible = false;
      this.$message.success("导入成功");
      this.getList();
    },
    handleImportError(err) {
      this.$message.error("导入失败");
    },
    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        this.$message.error('只能上传Excel文件！');
      }
      return isExcel;
    }
  }
};
</script>