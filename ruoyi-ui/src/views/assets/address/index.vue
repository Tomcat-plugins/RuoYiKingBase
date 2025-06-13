<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!-- 左侧树形菜单 -->
            <el-col :span="4">
                <div class="head-container">
                    <el-input
                        v-model="addrName"
                        placeholder="请输入地址名称"
                        clearable
                        size="small"
                        prefix-icon="el-icon-search"
                        style="margin-bottom: 20px"
                    />
                    <div class="tree-buttons">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-plus"
                            @click="handleExpandAll"
                        >全部展开</el-button>
                        <el-button
                            type="info"
                            size="mini"
                            icon="el-icon-minus"
                            @click="handleCollapseAll"
                        >全部折叠</el-button>
                    </div>
                </div>
                <div class="head-container">
                    <el-tree
                        v-loading="loading"
                        element-loading-text="加载中..."
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 0.8)"
                        :data="addrOptions"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        node-key="addrid"
                        default-expand-all
                        highlight-current
                        @node-click="handleNodeClick"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>
                                <i v-if="data.levelno === 1" class="el-icon-office-building"></i>
                                <i v-else-if="data.levelno === 2" class="el-icon-house"></i>
                                <i v-else class="el-icon-location"></i>
                                {{ node.label }}
                            </span>
                        </span>
                    </el-tree>
                </div>
            </el-col>

            <!-- 右侧内容区 -->
            <el-col :span="20">
                <!-- 操作按钮 -->
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['xinchuang:assets:addr']"
                        >新增地址</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="success"
                            plain
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            v-hasPermi="['xinchuang:assets:addr']"
                        >修改地址</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['xinchuang:assets:addr']"
                        >删除地址</el-button>
                    </el-col>
                </el-row>

                <!-- 表格 -->
                <el-table
                    v-loading="loading"
                    :data="addrList"
                    row-key="addrid"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="地址名称" align="center" prop="aname" />
                    <el-table-column label="地址编码" align="center" prop="acode" />
                    <el-table-column label="层级号" align="center" prop="levelno" />
                    <el-table-column label="排序号" align="center" prop="sortno" />
                    <el-table-column label="室号" align="center" prop="shino" />
                    <el-table-column label="责任人" align="center" prop="zrr" />
                    <el-table-column label="维管人员" align="center" prop="wgry" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['xinchuang:assets:addr']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['xinchuang:assets:addr']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        
        <!-- 添加或修改地址对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="父级地址" prop="pid">
                    <el-cascader
                        v-model="form.pid"
                        :options="addrOptions"
                        :props="{
                            checkStrictly: true,
                            value: 'addrid',
                            label: 'aname',
                            children: 'children',
                            emitPath: false
                        }"
                        :show-all-levels="false"
                        clearable
                        filterable
                        placeholder="请选择父级地址"
                        style="width: 100%"
                    >
                        <template slot-scope="{ node, data }">
                            <span>
                                <i v-if="data.levelno === 1" class="el-icon-office-building"></i>
                                <i v-else-if="data.levelno === 2" class="el-icon-house"></i>
                                <i v-else class="el-icon-location"></i>
                                {{ data.aname }}
                            </span>
                        </template>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="地址名称" prop="aname">
                    <el-input v-model="form.aname" placeholder="请输入地址名称" />
                </el-form-item>
                <el-form-item label="地址编码" prop="acode">
                    <el-input v-model="form.acode" placeholder="请输入地址编码" />
                </el-form-item>
                <el-form-item label="层级号" prop="levelno">
                    <el-input-number v-model="form.levelno" :min="1" :max="3" label="层级号"></el-input-number>
                </el-form-item>
                <el-form-item label="排序号" prop="sortno">
                    <el-input-number v-model="form.sortno" :min="0" :max="999" label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item label="室号" prop="shino">
                    <el-input v-model="form.shino" placeholder="请输入室号" />
                </el-form-item>
                <el-form-item label="责任人" prop="zrr">
                    <el-input v-model="form.zrr" placeholder="请输入责任人" />
                </el-form-item>
                <el-form-item label="维管人员" prop="wgry">
                    <el-input v-model="form.wgry" placeholder="请输入维管人员" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listAssetAddr, getAssetAddr, delAssetAddr, addAssetAddr, updateAssetAddr, getTreeData } from "@/api/assets/addr";

export default {
    name: "Address",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 地址表格数据
            addrList: [],
            // 地址选项
            addrOptions: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                aname: undefined,
                acode: undefined,
                levelno: undefined,
                pid: undefined
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                pid: [
                    { required: true, message: "父级地址不能为空", trigger: "change" }
                ],
                aname: [
                    { required: true, message: "地址名称不能为空", trigger: "blur" }
                ],
                acode: [
                    { required: true, message: "地址编码不能为空", trigger: "blur" }
                ],
                levelno: [
                    { required: true, message: "层级号不能为空", trigger: "blur" }
                ],
                sortno: [
                    { required: true, message: "排序号不能为空", trigger: "blur" }
                ]
            },
            // 树形结构默认属性
            defaultProps: {
                children: "children",
                label: "aname"
            },
            // 地址名称
            addrName: undefined
        };
    },
    watch: {
        // 监听地址名称变化
        addrName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询地址列表 */
        getList() {
            this.loading = true;
            getTreeData().then(response => {
                // 构建树形结构
                const buildTree = (data, pid = '0') => {
                    const result = [];
                    for (const item of data) {
                        if (item.pid === pid) {
                            const children = buildTree(data, item.addrid);
                            if (children.length) {
                                item.children = children;
                            }
                            result.push(item);
                        }
                    }
                    return result;
                };

                const treeData = buildTree(response.data);
                this.addrList = treeData;
                // 添加主目录作为根节点
                this.addrOptions = [{ addrid: '0', aname: '主目录', children: treeData }];
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                addrid: undefined,
                pid: '0',
                acode: undefined,
                aname: undefined,
                sortno: 0,
                levelno: 1,
                shino: undefined,
                zrr: undefined,
                wgry: undefined,
                isdel: 'N'
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.addrid);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加地址";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const addrid = row.addrid || this.ids[0];
            getAssetAddr(addrid).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改地址";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.addrid != null) {
                        updateAssetAddr(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addAssetAddr(this.form).then(response => {
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
            const addrids = row.addrid || this.ids;
            this.$modal.confirm('是否确认删除地址编号为"' + addrids + '"的数据项？').then(function() {
                return delAssetAddr(addrids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        /** 树节点过滤方法 */
        filterNode(value, data) {
            if (!value) return true;
            return data.aname.indexOf(value) !== -1;
        },
        /** 树节点点击事件 */
        handleNodeClick(data) {
            this.queryParams.pid = data.addrid;
            this.getList();
        },
        /** 全部展开 */
        handleExpandAll() {
            const expandKeys = [];
            const getAllKeys = (data) => {
                data.forEach(item => {
                    expandKeys.push(item.addrid);
                    if (item.children && item.children.length > 0) {
                        getAllKeys(item.children);
                    }
                });
            };
            getAllKeys(this.addrOptions);
            this.$nextTick(() => {
                expandKeys.forEach(key => {
                    this.$refs.tree.store.nodesMap[key].expanded = true;
                });
            });
        },
        /** 全部折叠 */
        handleCollapseAll() {
            const expandKeys = [];
            const getAllKeys = (data) => {
                data.forEach(item => {
                    expandKeys.push(item.addrid);
                    if (item.children && item.children.length > 0) {
                        getAllKeys(item.children);
                    }
                });
            };
            getAllKeys(this.addrOptions);
            this.$nextTick(() => {
                expandKeys.forEach(key => {
                    this.$refs.tree.store.nodesMap[key].expanded = false;
                });
            });
        }
    }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.head-container {
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.tree-buttons {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.tree-buttons .el-button {
  flex: 1;
  padding: 8px 15px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 0;
}

.custom-tree-node i {
  margin-right: 8px;
  font-size: 16px;
}

/* 树形菜单样式 */
:deep(.el-tree) {
  background-color: transparent;
  padding: 10px;
}

:deep(.el-tree-node__content) {
  height: 40px;
  border-radius: 4px;
  margin: 2px 0;
  transition: all 0.3s;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #ecf5ff;
  color: #409EFF;
}

:deep(.el-tree-node__expand-icon) {
  color: #909399;
}

:deep(.el-tree-node__expand-icon.expanded) {
  transform: rotate(90deg);
}

/* 图标颜色 */
:deep(.el-icon-office-building) {
  color: #409EFF;
}

:deep(.el-icon-house) {
  color: #67C23A;
}

:deep(.el-icon-location) {
  color: #E6A23C;
}

/* 表格样式 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  height: 50px;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

/* 按钮样式 */
:deep(.el-button--primary.is-plain) {
  border-color: #409EFF;
  color: #409EFF;
}

:deep(.el-button--primary.is-plain:hover) {
  background-color: #409EFF;
  color: #fff;
}

:deep(.el-button--success.is-plain) {
  border-color: #67C23A;
  color: #67C23A;
}

:deep(.el-button--success.is-plain:hover) {
  background-color: #67C23A;
  color: #fff;
}

:deep(.el-button--danger.is-plain) {
  border-color: #F56C6C;
  color: #F56C6C;
}

:deep(.el-button--danger.is-plain:hover) {
  background-color: #F56C6C;
  color: #fff;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background-color: #f5f7fa;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 30px 20px;
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 表单样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

:deep(.el-input__inner:focus) {
  border-color: #409EFF;
}

/* 加载动画样式 */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.9);
}

:deep(.el-loading-spinner .el-loading-text) {
  color: #409EFF;
  font-size: 14px;
  margin-top: 8px;
}

:deep(.el-loading-spinner .path) {
  stroke: #409EFF;
}

/* 操作按钮组样式 */
.mb8 {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 表格内操作按钮样式 */
:deep(.el-button--text) {
  padding: 4px 8px;
  font-size: 13px;
}

:deep(.el-button--text:hover) {
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
