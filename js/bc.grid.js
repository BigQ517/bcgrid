/**
 * File:bc.grid.js
 * Youth is just a section of unoptimized code!
 * -------------------------------------------------------------------------
 * Created by BigQ on 2018/4/3.
 *--------------------------------------------------------------------------
 * This technical information is confidential information,
 * without my written,permission is prohibited for commercial purposes.　
 *--------------------------------------------------------------------------
 */
(function ($) {
    /**
     * grid
     * @param ele
     * @param opt
     */
    var bcGrid = function (ele, opt) {
        this.gridWrap = this.element = $(ele);
        this.grid = null;
        this.gridHead = null;
        this.gridContent = null;
        this.pager = null;
        this.ID = "";
        this.checkedTool = null;
        this.defaults = {
            varsion: 'version 1.0.0',
            width: 'auto',                          //宽度值
            height: 'auto',                          //宽度值
            csrfVaildate: true,
            csrfName: '_csrf',
            csrf: '',
            url: false,                             //ajax url
            data: [],                            //初始化数据
            localData: [],
            autoLoadData: true,
            showLoadingTip: true,               //是否显示加载状态提示
            usePager: true,                         //是否分页
            page: 1,                                //默认当前页
            pageSize: 20,                           //每页默认的结果数 all全部
            pageSizeOptions: [10, 20, 30, 40, 50],  //可选择设定的每页结果数
            enableSort: true,
            sortName: "",                       //排序列字段
            sortType: "",                      //排序方向
            params: [],                         //提交到服务器的参数
            columns: [],                          //数据源
            dataSource: 'server',                     //数据源：本地(local)或(server),本地是将读取p.data。不需要配置，取决于设置了data或是url
            pageSourceType: 'ajax',                    //分页的方式：本地(local)或(server),选择本地方式时将在客服端分页、排序。
            checkbox: false,                         //是否显示复选框
            serialNum: true,    //是否显示序号
            showBorder: true,
            showHead: true,
            showTitle: false,
            title: "",
            noDataText: '<div class="center">暂无任何记录</div>',
            dateFormat: 'yyyy-MM-dd hh:mm:ss',              //默认时间显示格式
            wrapCssClass: '',                    //类名
            cssClass: '.table',                    //类名
            rows: 'rows',                       //数据源字段名
            total: 'total',                     //数据源记录数字段名
            pageParamName: 'page',               //页索引参数名，(提交给服务器)
            pageSizeParamName: 'pagesize',        //页记录数参数名，(提交给服务器)
            sortNameParamName: 'sortname',        //页排序列名(提交给服务器)
            sortTypeParamName: 'sorttype',      //页排序方向(提交给服务器)
            pageElement: null,                  //分页容器
            enableSelectRow: true, //是否可选择行
            enableMultiSelectRow: true,//是否运行行多选
            onCheckClick: null,                       //选择事件(复选框)
            onCheckAllClick: null,                  //选择点击数据（全选/全不选）
            onError: null,                         //错误事件
            /*            onReload: null,                    //重新加载事件，可以通过return false来阻止操作
             onRefresh: null,                    //刷新事件，可以通过return false来阻止操作*/
            onToFirst: null,                     //第一页，可以通过return false来阻止操作
            onToPrev: null,                      //上一页，可以通过return false来阻止操作
            onToNext: null,                      //下一页，可以通过return false来阻止操作
            onToLast: null,                      //最后一页，可以通过return false来阻止操作
            onCompleted: null,                          //加载完函数
            onLoadData: null,                       //加载数据前事件
            onLoadedData: null,                  //加载完数据事件
            onSelectRow: null, //选择行事件
            onTreeExpandOrCollapse: null,//树展开/收缩事件
            refreshBtnEnable: false,//刷新按钮
            onDataChange: null, //数据改变事件
            onDataSave: null,
            pageOpt: {},
            toolBtns: [],
            treeOpt: null
        };
        this.options = $.extend({}, this.defaults, opt);
        this.treeOpt = opt.treeOpt;
        if (this.treeOpt) {
            this.treeOpt = $.extend({columnID: '', name: 'child', expand: false}, this.treeOpt);
        }
        this.options.url = $.isEmptyObject(this.options.url) ? window.location.href : this.options.url;
    };
    //定义bcGrid的方法
    bcGrid.prototype = {
        render: function () {
            this._init();
            return this;
        },

        /**public function **/
        //加载数据
        loadData: function (reloadPage) {
            var isReloadPage = false;
            if (arguments.length > 0) {
                isReloadPage = reloadPage;
            }
            var g = this, p = this.options;
            var dataParam = [];
            if (p.params) {
                var params = $.isFunction(p.params) ? p.params() : p.params;
                if (params.length) {
                    $.each(params, function () {
                        dataParam.push({name: this.name, value: this.value});
                    });
                }
                else if (typeof params == "object") {
                    for (var name in params) {
                        dataParam.push({name: name, value: params[name]});
                    }
                }

            }
            if (p.enableSort && p.sortname && p.sortorder) {
                dataParam.push({name: p.sortnameParamName, value: p.sortname});
                dataParam.push({name: p.sortorderParamName, value: p.sortorder});
            }
            dataParam.push({name: p.pageParamName, value: p.page});
            dataParam.push({name: p.pagesizeParamName, value: p.pageSize});


            if (p.csrfVaildate) {
                dataParam.push({name: p.csrfName, value: p.csrf});
            }
            if (p.onLoadData) {
                p.onLoadData.call(g);
            }
            if (p.dataSource == 'server') {
                BC.ajax({
                    url: p.url,
                    showLoading: p.showLoadingTip,
                    loadingTip: '数据加载中...',
                    data: $.param(dataParam),
                    success: function (message, data) {
                        p.data = data;
                        g._displayData();
                        if (isReloadPage) {
                            g._displayPage();
                        }
                        if (p.onComplete) {
                            p.onComplete.call(g, p.data);
                        }
                    },
                    fail: function (message) {
                        g._error(message);
                    },
                    error: function (MLHttpRequest, textStatus, errorThrown) {
                        g._error('数据加载失败！[' + textStatus + ']');
                    },
                    complete: function () {
                        //
                        if (g.checkedTool) {
                            $(".dataTotalCount", g.checkedTool).html(p.data[p.total]);
                            $(".dataCurrentCount", g.checkedTool).html(p.data[p.rows].length);
                        }
                        if (p.onLoadedData) {
                            p.onLoadedData.call(g, p.data);
                        }
                    }
                });
            }
            else if (p.dataSource == 'local') {
                //
                p.data[p.total] = p.localData.length;
                if (p.usePager) {
                    var start = (p.page - 1) * p.pageSize;
                    p.data[p.rows] = p.localData.slice(start, start + p.pageSize);
                }
                g._displayData();
                g._displayPage();
                if (g.checkedTool) {
                    $(".dataTotalCount", g.checkedTool).html(p.data[p.total]);
                    $(".dataCurrentCount", g.checkedTool).html(p.data[p.rows].length);
                }
                if (p.onLoadedData) {
                    p.onLoadedData.call(g, p.data);
                }
                if (p.onComplete) {
                    p.onComplete.call(g, p.data);
                }
            }
        },
        //重新加载
        reload: function () {
            var res = true;
            if (this.onReload) {
                res = this.onReload.call(this);
            }
            if (res) {
                this.options.page = 1;
                this.loadData(true);
            }
        },
        //重新加载
        reloadData: function () {
            var res = true;
            if (this.onReload) {
                res = this.onReload.call(this);
            }
            if (res) {
                this.loadData(true);
            }
        },
        //整体刷新
        refresh: function () {
            var res = true;
            if (this.onRefresh) {
                res = this.onRefresh.call(this);
            }
            if (res) {
                this._init();
            }
        },
        /**
         * 添加按钮
         * @param opt
         */
        addToolBtn: function (opt) {
            var self = this;
            self.pager.addToolButton(opt);
        },
        getPage: function () {
            return this.options.page;
        },
        getCurrentPage: function () {
            return this.options.page;
        },
        get: function (name) {
            return this.options[name];
        },
        set: function (opt) {
            this.options = $.extend(this.options, opt);
        },
        getData: function () {
            return this.options.data[this.options.rows]
        },
        getRowData: function (rowindex) {
            return this.options.data[this.options.rows][rowindex];
        },
        getTotal: function () {
            return this.options.data[this.options.total];
        },
        deleteRow: function (rowIndex) {
            var g = this, p = this.options;
            $('tr[id="bcgrid_' + g.ID + '_list_' + rowIndex + '"]', g.gridContent).remove();
            p.data[p.total] = parseInt(p.data[p.total]) - 1;
            g._displayPage();
        },
        deleteRows: function (rowIndexArr) {
            var g = this, p = this.options;
            $.each(rowIndexArr, function () {
                $('tr[id="bcgrid_' + g.ID + '_list_' + this + '"]', g.gridContent).remove();
            });
            p.data[p.total] = parseInt(p.data[p.total]) - rowIndexArr.length;
            g._displayPage();
        },
        getCheckedRows: function () {
            var rows = [];
            var g = this, p = this.options;
            if (p.checkbox) {
                $('input[tag="bcgrid_checkbox"]', g.gridContent).each(function () {
                    if ($(this).is(':checked')) {
                        rows.push(p.data[p.rows][parseInt($(this).data('index'))]);
                    }
                });
            }
            return rows;
        },
        setCheckedRows: function (rowIndexArr, ischecked) {
            var g = this, p = this.options;
            $.each(rowIndexArr, function (index, item) {
                g.setCheckedRow(item, ischecked);
            });
        },
        setCheckedRow: function (rowIndex, ischecked) {
            var g = this, p = this.options;
            $("#bcgrid_" + g.ID + "_checkbox_list_" + rowIndex, g.gridContent).prop('checked', ischecked);

        },
        getCheckedRowsIndex: function () {
            var rows = [];
            var g = this, p = this.options;
            if (p.checkbox) {
                $('input[tag="bcgrid_checkbox"]', g.gridContent).each(function () {
                    if ($(this).is(':checked')) {
                        rows.push(parseInt($(this).data('index')));
                    }
                });
            }
            return rows;
        },
        updateRow: function (rowIndex, rowItem) {
            var g = this, p = this.options;
            var dataHtml = [];
            if (rowItem) {
                p.data[p.rows][rowIndex] = rowItem;
            }
            else {
                rowItem = p.data[p.rows][rowIndex];
            }
            dataHtml.push(g._preRenderColumn(rowIndex));
            $.each(p.columns, function (index, item) {
                dataHtml.push(g._renderColumnData(item, rowItem, index));
            });
            $("#bcgrid_" + g.ID + "_list_" + rowIndex).html(dataHtml.join(''));
            g._bindEvent();
        },
        updateColumn: function (columnIndex, columnItem) {
            var g = this, p = this.options;
            if (columnItem) {
                p.columns[columnIndex] = columnItem;
            } else {
                columnItem = p.columns[columnIndex];
            }
            var cells = $('td[data-role="data"][data-columnindex="' + columnIndex + '"]', g.gridContent);
            cells.each(function () {
                var self = $(this);
                var rowIndex = self.parent("tr").data("rowindex");
                self.replaceWith(g._renderColumnData(columnItem, p.data[p.rows][rowIndex], columnIndex, rowIndex));
            });

        },
        setTitle: function (title) {
            var g = this, p = this.options;
            p.title = title;
            $("#bcgrid_" + g.ID + "_title").html(title);
        },
        addColumn: function (column, index) {
            var g = this, p = this.options;
            var pos = index || p.columns.length - 1;
            p.columns.splice(pos, 0, column || {});
            g.refresh();
        },
        setLocalData: function (rows) {
            var g = this, p = this.options;
            p.localData = rows;


        }
    };
    // private function and variable
    var _rowIndex = 0, _treeDepth = 0, _showColumnLength = 0;
    //初始化
    var _init = function () {
        var g = this, p = this.options;

        this.ID = uitls.getID();
        //csrf
        if (p.csrfVaildate && $.isEmptyObject(p.csrf)) {
            p.csrf = $("input[name='" + p.csrfName + "']").val();
        }
        if (!g.gridWrap.hasClass(p.wrapCssClass)) {
            g.gridWrap.addClass(p.wrapCssClass);
        }
        //page
        var page = g._getQueryString(p.pageParamName);
        if (!isNaN(page) && page != '') {
            p.page = page;
        }
        this.grid = $('<table role="grid"></table>');
        g.grid.addClass(p.cssClass);
        if (!p.showBorder) {
            g.grid.removeClass("table-bordered");
        }
        if (p.onSelectRow) {
            g.grid.addClass("enable-select");
        }
        g.gridWrap.html(g.grid);
        _preRenderColumnOpt.call(g);
        if (p.showHead || p.showTitle) {
            _setHead.call(g);
        }
        _setGridContent.call(g);
        if (p.autoLoadData) {
            loadData.call(g, true);
        }
    };
    //head
    var _setHead = function () {
        var g = this, p = this.options;
        var headAttr = [];
        headAttr.push('<thead>')
        if (p.showTitle) {
            headAttr.push('<tr role="row">');
            headAttr.push('<th class="text-center" colspan="' + g._showColumnLength + '" id="bcgrid_' + g.ID + '_title">' + p.title + '</th>');
            headAttr.push('</tr>')
        }
        if (p.showHead) {
            headAttr.push('<tr role="row">');
            if (p.checkbox) {
                headAttr.push('<th class="center"> <label><input type="checkbox" id="bcgrid_' + g.ID + '_checkbox_all" tag="bcgrid_checkbox"/><span class="lbl"></span></label></th>');
            }
            if (p.serialNum) {
                headAttr.push('<th class="center">序号</th>');
            }
            //标题
            $.each(p.columns, function (index, item) {
                var btnStr = '';
                if (item.enableEdit) {
                    btnStr = '<a href="javascript:;" class="grid_head_btn_edit" data-columnIndex="' + index + '" id="bcgrid_head_edit_' + index + '" data-action="edit" data-edittype="' + item.editType + '">[编辑]</a>';
                }
                var showText = '<span data-col="' + item.name + '" data-columnindex="' + index + '">' + item.display + '</span>' + btnStr;
                if (item.hide) {
                    headAttr.push('<th data-col="' + item.name + '" class="hidden">' + showText + '</th>');
                }
                else {
                    if (item.width) {
                        if (!isNaN(item.width)) {
                            headAttr.push('<th class="width-' + item.width + '">' + showText + '</th>');
                        }
                        else {
                            headAttr.push('<th  width="' + item.width + '">' + showText + '</th>');
                        }
                    }
                    else {
                        headAttr.push('<th>' + showText + '</th>');
                    }
                }
            });
            headAttr.push('</tr>')
        }
        headAttr.push('</thead>')
        g.gridHead = $(headAttr.join(''));
        if (p.showCheckedTool) {
            g.checkedTool = $('.checkedTool', this.gridHead);
        }
        g.grid.html(this.gridHead);
    };
    var _setGridContent = function () {
        this.gridContent = $('<tbody></tbody>');
        this.grid.append(this.gridContent);
    };
    var _displayData = function () {
        _rowIndex = 0;
        var g = this;
        if (!$.isEmptyObject(this.options.data)) {
            _displayListData(typeof this.options.data[this.options.rows] != 'undefined' ? this.options.data[this.options.rows] : [])
        }
        g._bindEvent();
    };
    var _error = function (message) {
        if (this.options.onError) {
            this.options.onError.call(this, message);
        }
        else {
            BC.showError(message);
        }
    };
    var _displayListData = function (data) {
        var g = this, p = this.options;
        g.gridContent.empty();
        g._rowIndex = 0;
        var dataHtml = [];
        if (data.length == 0) {
            dataHtml.push('<tr id="bcgrid_' + g.ID + '_list_nodata" role="row" class="odd no_data">');
            dataHtml.push('<td colspan="' + g._showColumnLength + '" class="text-center">' + p.noDataText + '</td>');
            dataHtml.push('</tr>');
            //check disable

        }
        else {
            $.each(data, function (index, rowItem) {
                g._treeDepth = 0;
                var tr = [];
                if (g._rowIndex % 2 == 0) {
                    tr.push('<tr id="bcgrid_' + g.ID + '_list_' + g._rowIndex + '" role="row" data-rowindex="' + g._rowIndex + '" class="odd">');
                } else {
                    tr.push('<tr id="bcgrid_' + g.ID + '_list_' + g._rowIndex + '" role="row" data-rowindex="' + g._rowIndex + '" class="even">');
                }
                tr.push(g._preRenderColumn());
                $.each(p.columns, function (index, item) {
                    tr.push(g._renderColumnData(item, rowItem, index, g._rowIndex));
                });
                tr.push('</tr>');
                tr = tr.join('');
                //tree
                var $tr = $(tr);
                if ($(".classification_name", $tr).length > 0 && rowItem[g.treeOpt.name].length > 0) {
                    g._treeDepth++;
                    tr += g._displayChildListData(rowItem[g.treeOpt.name], g._rowIndex + 0);
                }
                dataHtml.push(tr);
                g._rowIndex++;

            });
        }
        g.gridContent.html(dataHtml.join(''));
        if (!g.isCheckedAll) {
            $(':checkbox[tag="bcgrid_checkbox"]', g.gridHead).prop('checked', false);
        }
    };
    var _displayChildListData = function (data, parentRowIndex) {
        var g = this, p = this.options;
        var dataHtml = [];
        if (data.length > 0) {
            g._rowIndex++;
            var displayStr = '';
            displayStr = g.treeOpt.expand ? '' : ' style="display:none;"';
            $.each(data, function (index, rowItem) {
                var tr = [];
                if (g._rowIndex % 2 == 0) {
                    tr.push('<tr id="bcgrid_' + g.ID + '_list_' + g._rowIndex + '" role="row" data-parentrowindex="' + parentRowIndex + '" data-rowindex="' + g._rowIndex + '" class="odd"' + displayStr + '>');
                } else {
                    tr.push('<tr id="bcgrid_' + g.ID + '_list_' + g._rowIndex + '" role="row" data-parentrowindex="' + parentRowIndex + '" data-rowindex="' + g._rowIndex + '" class="even"' + displayStr + '>');
                }
                tr.push(g._preRenderColumn());
                $.each(p.columns, function (index, item) {
                    tr.push(g._renderColumnData(item, rowItem, index, g._rowIndex));
                });
                tr.push('</tr>');
                tr = tr.join('');
                //tree
                var $tr = $(tr);
                if ($(".classification_name", $tr).length > 0 && rowItem[g.treeOpt.name].length > 0) {
                    g._treeDepth++;
                    tr += g._displayChildListData(rowItem[g.treeOpt.name], parentRowIndex);
                }
                dataHtml.push(tr);
                g._rowIndex++;
            });
        }
        return dataHtml.join('');

    };
    var _preRenderColumnOpt = function () {
        var g = this, p = this.options;
        var defaultOpt = {
            display: '数据',
            id: '',
            name: 'name',
            type: 'text',
            render: null,
            hide: false,
            align: null,
            maxLength: null,
            format: null,
            role: 'data',
            enableSort: true,
            enableEdit: false,
            editType: 'textField',
            onEdit: null,
            onSave: null,
            onSaved: null,
            action: null,
            saveUrl: ''

        };
        //_showColumnLength
        g._showColumnLength = p.columns.length;
        for (var i = 0; i < p.columns.length; i++) {
            p.columns[i] = $.extend({}, defaultOpt, p.columns[i] || {});
            if (p.columns[i].hide) {
                g._showColumnLength--;
            }
        }
        //
        if (p.checkbox) {
            g._showColumnLength++;
        }
        if (p.serialNum) {
            g._showColumnLength++;
        }

    };
    var _preRenderColumn = function () {
        var g = this, p = this.options;
        var dataHtml = [];
        if (p.checkbox) {
            var checked = '';
            if (g.isCheckedAll) {
                checked = ' checked="checked"';
            }
            dataHtml.push('<td class="center" data-role="checkbox"> <label class="pos-rel"><input type="checkbox" id="bcgrid_' + g.ID + '_checkbox_list_' + g._rowIndex + '" data-index="' + g._rowIndex + '" tag="bcgrid_checkbox" class="ace"' + checked + '/> </label></td>');
        }
        if (p.serialNum) {
            var serial = 0;
            if ((p.pageSize + '').toLowerCase() == 'all') {
                serial = (  g._rowIndex + 1);
            }
            else {
                serial = (g._rowIndex + 1) + (p.page - 1) * p.pageSize;
            }
            dataHtml.push('<td class="text-center" data-role="data">' + serial + '</td>');
        }
        return dataHtml.join('');
    };
    var _displayPage = function () {
        var g = this, p = this.options;
        if (!$.isEmptyObject(p.data) && p.usePager) {
            var pageOpt = {
                pageSize: p.pageSize,                          //分页尺寸
                recordCount: p.data[p.total],
                pageSizeOptions: p.pageSizeOptions,          //范围
                currentPage: p.page,                             //当前页
                trunPageEvent: function (page, pageSize) {
                    p.page = page;
                    p.pageSize = pageSize;
                    g.loadData(false, page);
                }
            };
            /*   if (p.tree) {
             pageOpt.pageInfoTpl = '{currentPage}/{pageCount}页,共{recordCount}条记录';
             }*/
            pageOpt = $.extend(pageOpt, p.pageOpt);
            if ($.isEmptyObject(p.pageElement)) {
                p.pageElement = $("<div></div>");
                g.gridWrap.append(p.pageElement);
            }
            this.pager = $(p.pageElement).bcPager(pageOpt);//执行分页
            g._initToolBtn();

        }
    };
    //单元格数据
    var _renderColumnData = function (column, data, colIndex, rowIndex) {
        var g = this, p = this.options;
        var opt = column;
        var dataRes = '';
        if (typeof opt.render === "string") {
            eval("opt.render=" + opt.render);
        }
        if ($.isFunction(opt.render)) {
            dataRes = opt.render(data, g._rowIndex);
            if (dataRes && typeof dataRes === 'object') {
                if (dataRes instanceof jQuery) {
                    dataRes = dataRes[0].outerHTML;
                }
                else {
                    dataRes = dataRes.outerHTML;
                }
            }
        }
        else {
            switch (opt.type) {
                case 'grid':
                case 'table':
                    dataRes = g._tableItem(rowIndex + 0, column, data, colIndex);
                    break;
                case 'date':
                    dataRes = g._formatDate(data[column.name], opt.format);
                    break;
                case 'checkbox':
                    dataRes = g._checkBoxItem(rowIndex + 0, column, data, colIndex);
                    break;
                case 'textField':
                    dataRes = g._inputItem(rowIndex + 0, column, data, colIndex);
                    break;
                case 'select':
                    dataRes = g._selectItem(rowIndex + 0, column, data, colIndex);
                    break;
                default:
                    var val = typeof data[column.name] != 'undefined' ? data[column.name] + '' : '';
                    if (opt.maxLength && !isNaN(opt.maxLength)) {
                        if (val.length > opt.maxLength) {
                            val = val.substr(0, opt.maxLength) + '...';
                        }
                    }
                    dataRes = g._formatText(val, opt.format);
                    break;
            }
        }
        dataRes += "";
        //childOpt
        if (p.tree && p.tree.columnID == column.id) {
            if (g._treeDepth > 0) {
                var treeSpace = '';
                for (var i = 0; i <= g._treeDepth; i++) {
                    treeSpace += '<span class="standing_position"></span>';
                }
                dataRes = treeSpace + dataRes;

            } else {
                if (typeof data[p.tree.name] != "undefined" && data[p.tree.name].length > 0) {
                    dataRes = ' <span class="classification_name childLink ' + (p.tree.expand ? 'childOpen' : 'childClose') + '">' + (p.tree.expand ? '-' : '+') + '</span>' + dataRes;
                }
            }
        }
        if (opt.enableEdit) {
            dataRes = '<span data-role="display">' + dataRes + '</span>';
        }
        dataRes = '<td data-role="' + opt.role + '" data-columnindex="' + colIndex + '">' + dataRes + '</td>';
        var $ret = $(dataRes);
        if (opt.align) {
            $ret.addClass("text-" + opt.align);
        }
        if (opt.type == "table") {
            $ret.addClass("none-padding");
        }
        if (opt.hide) {
            $ret.addClass("hidden");
        }
        return $ret.prop('outerHTML');
    };
    /**
     * 子表格
     * @param rowIndex
     * @param column
     * @param data
     * @param colIndex
     * @private
     */
    var _tableItem = function (rowIndex, column, data, colIndex) {
        var g = this;
        column.tableDataName = typeof column.tableDataName != 'undefined' ? column.tableDataName : 'data';
        var tableData = typeof  data[column.tableDataName] != 'undefined' ? data[column.tableDataName] : {};

        return g._subTable.render(g, column.table, tableData).prop('outerHTML');
    };
    var _subTable = {
        parent: null,
        option: {},
        grid: null,
        gridHead: null,
        gridContent: null,
        _showColumnLength: 0,
        _rowIndex: 0,
        data: {},//数据
        render: function (g, option, data) {
            this.parent = g;
            this.option = option;
            this.data = data;
            this._init();
            return this.grid;
        },
        _init: function () {
            var self = this;
            //var
            var defSubOpt = {
                columns: [],                          //数据列
                serialNum: false,    //是否显示序号
                showBorder: false,
                showHead: false,
                showTitle: false,
                title: "",
                noDataText: '<div class="search_none">暂无任何记录</div>',
                cssClass: '',                    //类名
                rows: 'rows'
            };
            self.option = $.extend({}, defSubOpt, self.option);
            self.grid = $("<table class='subTable'></table>");
            self.grid.addClass(defSubOpt.cssClass);
            if (defSubOpt.showBorder) {
                self.grid.addClass("table-bordered");
            }
            self._preRenderColumnOpt();
            if (defSubOpt.showHead || defSubOpt.showTitle) {
                self._setHead();
            }
            self._setGridContent();
            self._displayListData();

        },
        _preRenderColumnOpt: function () {
            var g = this.parent, p = this.parent.options, self = this, subOpt = this.option;
            var defaultOpt = {
                display: '数据',
                id: '',
                name: 'name',
                type: 'text',
                render: null,
                hide: false,
                align: null,
                maxLength: null,
                format: null
            };
            self._showColumnLength = subOpt.columns.length;
            for (var i = 0; i < subOpt.columns.length; i++) {
                subOpt.columns[i] = $.extend({}, defaultOpt, subOpt.columns[i] || {});
                if (subOpt.columns[i].hide) {
                    self._showColumnLength--;
                }
            }
            //
            if (subOpt.serialNum) {
                self._showColumnLength++;
            }

        },
        _setHead: function () {
            var self = this, subOpt = this.option;
            var headAttr = [];
            headAttr.push('<thead>');
            if (subOpt.showTitle) {
                headAttr.push('<tr role="row">');
                headAttr.push('<th class="text-center" colspan="' + self._showColumnLength + '">' + subOpt.title + '</th>');
                headAttr.push('</tr>')
            }
            if (subOpt.showHead) {
                headAttr.push('<tr role="row">');
                if (subOpt.serialNum) {
                    headAttr.push('<th class="text-center">序号</th>');
                }
                //标题
                $.each(subOpt.columns, function (index, item) {
                    var showText = '<span data-col="' + item.name + '" data-columnindex="' + index + '">' + item.display + '</span>';
                    if (item.hide) {
                        headAttr.push('<th data-col="' + item.name + '" class="hidden">' + showText + '</th>');
                    }
                    else {
                        if (item.width) {
                            if (!isNaN(item.width)) {
                                headAttr.push('<th class="width-' + item.width + '">' + showText + '</th>');
                            }
                            else {
                                headAttr.push('<th  width="' + item.width + '">' + showText + '</th>');
                            }
                        }
                        else {
                            headAttr.push('<th>' + showText + '</th>');
                        }
                    }
                });
                headAttr.push('</tr>')
            }
            headAttr.push('</thead>');
            self.gridHead = $(headAttr.join(''));
            self.grid.html(self.gridHead);
        },
        _setGridContent: function () {
            this.gridContent = $('<tbody></tbody>');
            this.grid.append(this.gridContent);
        },
        _displayListData: function () {
            var self = this, subOpt = this.option;
            var g = this.parent;
            self.gridContent.empty();
            self._rowIndex = 0;
            var dataHtml = [];
            var data = typeof self.data[subOpt.rows] != 'undefined' ? self.data[subOpt.rows] : [];
            if (data.length == 0) {
                dataHtml.push('<tr role="row" class="odd no_data">');
                dataHtml.push('<td colspan="' + self._showColumnLength + '" class="text-center">' + subOpt.noDataText + '</td>');
                dataHtml.push('</tr>');
            }
            else {
                $.each(data, function (index, rowItem) {
                    var tr = [];
                    if (self._rowIndex % 2 == 0) {
                        tr.push('<tr role="row" data-rowindex="' + g._rowIndex + '" class="odd">');
                    } else {
                        tr.push('<tr role="row" data-rowindex="' + g._rowIndex + '" class="even">');
                    }
                    if (subOpt.serialNum) {
                        var serial = self._rowIndex + 1;
                        tr.push('<td class="text-center">' + serial + '</td>');
                    }
                    $.each(subOpt.columns, function (index, item) {
                        tr.push(self._renderColumnData(item, rowItem, index, self._rowIndex));
                    });
                    tr.push('</tr>');
                    tr = tr.join('');
                    dataHtml.push(tr);
                    self._rowIndex++;

                });
            }
            self.gridContent.html(dataHtml.join(''));
        },
        _renderColumnData: function (column, data, colIndex, rowIndex) {
            var self = this, subOpt = this.option, g = this.parent;
            var opt = column;
            var dataRes = '';
            if (typeof opt.render === "string") {
                eval("opt.render=" + opt.render);
            }
            if ($.isFunction(opt.render)) {
                dataRes = opt.render(data, g._rowIndex);
                if (dataRes && typeof dataRes === 'object') {
                    if (dataRes instanceof jQuery) {
                        dataRes = dataRes[0].outerHTML;
                    }
                    else {
                        dataRes = dataRes.outerHTML;
                    }
                }
            }
            else {
                switch (opt.type) {
                    case 'table':
                        dataRes = g._tableItem(rowIndex + 0, column, data, colIndex);
                        break;
                    case 'date':
                        dataRes = g._formatDate(data[column.name], opt.format);
                        break;
                    case 'checkbox':
                        dataRes = g._checkBoxItem(rowIndex + 0, column, data, colIndex);
                        break;
                    case 'textField':
                        dataRes = g._inputItem(rowIndex + 0, column, data, colIndex);
                        break;
                    case 'select':
                        dataRes = g._selectItem(rowIndex + 0, column, data, colIndex);
                        break;
                    default:
                        var val = typeof data[column.name] != 'undefined' ? data[column.name] + '' : '';
                        if (opt.maxLength && !isNaN(opt.maxLength)) {
                            if (val.length > opt.maxLength) {
                                val = val.substr(0, opt.maxLength) + '...';
                            }
                        }
                        dataRes = g._formatText(val, opt.format);
                        break;
                }
            }
            dataRes += "";
            //childOpt
            dataRes = '<td>' + dataRes + '</td>';
            var $ret = $(dataRes);
            if (opt.align) {
                $ret.addClass("text-" + opt.align);
            }
            if (opt.type == "table") {
                $ret.addClass("none-padding");
            }
            if (opt.hide) {
                $ret.addClass("hidden");
            }
            return $ret.prop('outerHTML');
        }

    };
    var _checkBoxItem = function (rowIndex, column, data, colIndex) {
        column.elValue = typeof column.elValue != 'undefined' ? column.elValue : 1;
        var $item = $("<label></label>");
        $check = $('<input class="columnCheckBox"   type="checkbox" data-rowindex="' + rowIndex + '" data-colindex="' + colIndex + '" >');
        if (column.elName) {
            $check.attr('name', column.elName);
        } else {
            $check.attr('name', column.name);
        }
        $check.attr('value', column.elValue);
        if (column.name && data[column.name] == column.elValue) {
            $check.attr('checked', 'checked');
        }
        $item.append($check);
        $item.append('<span class="lbl"></span>');
        return $item.prop('outerHTML');
    };
    var _selectItem = function (rowIndex, column, data, colIndex) {
        column.items = column.items || [];
        var $item = $('<select class="columnSelect" data-rowindex="' + rowIndex + '" data-colindex="' + colIndex + '" ></select>');
        if (column.elName) {
            $item.attr('name', column.elName);
        } else {
            $item.attr('name', column.name);
        }
        if (column.itemsName) {
            column.items = data[column.itemsName];
        }
        $.each(column.items, function (i, item) {
            //
            if (column.name && (typeof data[column.name] != 'undefined' ? data[column.name] : '') == item.value) {
                $item.append('<option value="' + item.value + '" selected="selected">' + item.text + '</option>');
            }
            else {
                $item.append('<option value="' + item.value + '">' + item.text + '</option>');
            }

        });

        return $item.prop('outerHTML');
    };
    var _inputItem = function (rowIndex, column, data, colIndex) {
        var $item = $('<input class="width_90 columnEdit" data-rowindex="' + rowIndex + '" data-colindex="' + colIndex + '" />');
        if (column.elName) {
            $item.attr('name', column.elName);
        } else {
            $item.attr('name', column.name);
        }
        $item.attr('value', typeof data[column.name] != 'undefined' ? data[column.name] : '');
        return $item.prop('outerHTML');
    };
    var _formatText = function (value, format) {
        if (typeof value == "undefined") value = "";
        if (!format) return value;
        value = value + "";
        return format.replace(/\{value\}/g, value);
    };
    var _formatDate = function (value, format) {
        var g = this, p = g.options;

        function getFormat(date, dateformat) {
            if (isNaN(date)) return '';
            var formatOpt = dateformat;
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S+": date.getMilliseconds()
            }
            if (/(y+)/.test(formatOpt)) {
                formatOpt = formatOpt.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(formatOpt)) {
                    formatOpt = formatOpt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return formatOpt;
        }

        if (!value) return "";
        // /Date(1328423451489)/
        if (typeof (value) == "string" && /^\/Date/.test(value)) {
            value = value.replace(/^\//, "new ").replace(/\/$/, "");
            eval("value = " + value);
        }
        if (!isNaN(value)) {
            var newDate = new Date();
            newDate.setTime(value * 1000);
            value = newDate;
        }
        if (value instanceof Date) {
            var formatOpt = format || p.dateFormat;
            return getFormat(value, formatOpt);
        }
        else {

            return value.toString();
        }
    };
    var _getQueryString = function (name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    };
    var _initToolBtn = function () {
        var self = this, p = this.options;
        var toolArr = [];
        if (p.refreshBtnEnable) {
            toolArr.push({
                id: 'refresh_' + self.ID,
                title: '刷新',
                style: 'btn-primary',
                icon: 'glyphicon-refresh',
                click: function (item) {
                    self.reload();
                }
            });
        }
        toolArr.push.apply(toolArr, p.toolBtns);
        self.pager.addToolButton(toolArr);
    };
    var _bindEvent = function () {
        var g = this, p = this.options;
        var rowsData = g.getData();
        $(':checkbox[tag="bcgrid_checkbox"]', g.gridHead).unbind();
        $(':checkbox[tag="bcgrid_checkbox"]', g.gridHead).on('click', function (e) {
            var isChecked = false;
            if ($(this).is(':checked')) {
                isChecked = true;
                $(":checkbox[tag='bcgrid_checkbox']", g.gridContent).prop('checked', true);
                //
                if (g.checkedTool) {
                    $("a[data-action='cancelChecked']", g.checkedTool).parent().show();
                }
            }
            else {
                isChecked = false;
                $(":checkbox[tag='bcgrid_checkbox']", g.gridContent).prop('checked', false);
                if (g.checkedTool) {
                    $("a[data-action='cancelChecked']", g.checkedTool).parent().hide();
                }
                g.isCheckedAll = false;

            }
            if (p.onCheckAllClick && $.isFunction(p.onCheckAllClick)) {
                p.onCheckAllClick.call(g, isChecked);
            }
            if (p.onCheckRow && $.isFunction(p.onCheckRow)) {
                p.onCheckRow.call(g, isChecked);
            }
        });
        $('th span[data-col]', g.gridHead).unbind();
        if (p.enableSort && p.dataSource == 'server') {
            $('th span[data-col]', g.gridHead).on('click', function () {
                var el = $(this);
                var columnIndex = parseInt(el.data("columnindex"));
                if (p.columns[columnIndex].enableSort) {
                    var name = el.data('col') || '';
                    var sort = el.data('sort') || 'asc';
                    if (sort == 'asc') {
                        el.data('sort', 'desc');
                    } else {
                        el.data('sort', 'asc');
                    }
                    if (name && typeof(name) != 'undefined') {
                        p.sortname = name;
                        p.sortorder = sort;
                        g.loadData(true);
                    }
                }
            });
        }
        $(':checkbox[tag="bcgrid_checkbox"]', g.gridContent).unbind();
        $(':checkbox[tag="bcgrid_checkbox"]', g.gridContent).on('click', function (e) {
            var isChecked = false;
            if ($(this).is(':checked')) {
                isChecked = true;
            } else {
                g.isCheckedAll = false;
            }
            var rowIndex = parseInt($(this).data('index'));
            if (p.onCheckClick && $.isFunction(p.onCheckClick)) {
                p.onCheckClick.call(g, rowIndex, isChecked, p.data[p.rows][rowIndex]);
            }
            if (p.onCheckRow && $.isFunction(p.onCheckRow)) {
                p.onCheckRow.call(g, isChecked);
            }

            //
            if (g.checkedTool) {
                var checkedRows = g.getCheckedRows();
                if (checkedRows.length > 0) {
                    $("a[data-action='cancelChecked']", g.checkedTool).parent().show();
                }
                else {
                    $("a[data-action='cancelChecked']", g.checkedTool).parent().hide();
                }
            }
            // e.stopPropagation();
        });
        //checkTool
        if (g.checkedTool) {
            $("a", g.checkedTool).unbind();
            $("a", g.checkedTool).on('click', function () {
                var self = $(this);
                var action = self.data("action");
                switch (action) {
                    case 'checkedCurrentShow':
                        g.isCheckedAll = false;
                        $(':checkbox[tag="bcgrid_checkbox"]', g.grid).prop('checked', true);
                        $("a[data-action='cancelChecked']", g.checkedTool).parent().show();
                        if (p.onCheckRow && $.isFunction(p.onCheckRow)) {
                            p.onCheckRow.call(g, true);
                        }
                        break;
                    case 'checkedAll':
                        g.isCheckedAll = true;
                        $(':checkbox[tag="bcgrid_checkbox"]', g.grid).prop('checked', true);
                        $("a[data-action='cancelChecked']", g.checkedTool).parent().show();
                        if (p.onCheckRow && $.isFunction(p.onCheckRow)) {
                            p.onCheckRow.call(g, true);
                        }
                        break;
                    case 'cancelChecked':
                        g.isCheckedAll = false;
                        $(':checkbox[tag="bcgrid_checkbox"]', g.grid).prop('checked', false);
                        $("a[data-action='cancelChecked']", g.checkedTool).parent().hide();
                        if (p.onCheckRow && $.isFunction(p.onCheckRow)) {
                            p.onCheckRow.call(g, false);
                        }
                        break;
                }

            });
        }
        //行选择
        $('td[data-role="data"]', 'tr[role="row"]:not(.no_data)', g.gridContent).unbind();
        if (p.selectRow) {
            $('td[data-role="data"]', 'tr[role="row"]:not(.no_data)', g.gridContent).on("click", function (e) {
                var self = $(this);
                var row = self.parent('tr');
                /* if (row.hasClass("success")) {
                 //    $(this).removeClass("success") ;
                 }
                 else {*/
                // row.addClass("success");
                // row.siblings().removeClass("success");
                if (p.onSelectRow && $.isFunction(p.onSelectRow)) {
                    var rowIndex = parseInt(row.data('rowindex'));
                    p.onSelectRow.call(g, rowIndex, p.data[p.rows][rowIndex]);
                }
                //}
            });
        }
        $('select.row-select', g.gridContent).unbind();
        //tree
        if (g.treeOpt) {
            $('.childLink', g.gridContent).on("click", function () {
                var self = $(this);
                var row = self.closest("tr");
                var rowIndex = row.data("rowindex");
                var isExpand = false;
                if (self.hasClass("childClose")) {
                    self.removeClass("childClose").addClass("childOpen").html("-");
                    //打开
                    row.nextAll('tr[data-parentrowindex="' + rowIndex + '"]').show();
                    isExpand = true;

                }
                else {
                    self.removeClass("childOpen").addClass("childClose").html("+");
                    //关闭
                    row.nextAll('tr[data-parentrowindex="' + rowIndex + '"]').hide();
                    isExpand = false;
                }
                if (p.onTreeExpandOrCollapse && $.isFunction(p.onTreeExpandOrCollapse)) {
                    p.onTreeExpandOrCollapse.call(g, isExpand, rowIndex);
                }
            });

        }
        //edit:
        $('th a.grid_head_btn_edit', g.gridHead).unbind();
        $('th a.grid_head_btn_edit', g.gridHead).on("click", function () {
            var self = $(this);
            var action = self.data("action") || 'edit';
            var editType = self.data("edittype");
            var columnIndex = self.data("columnindex");
            var column = p.columns[columnIndex];

            if (action == 'edit') {
                self.data("action", "save");
                self.html("[保存]");
                var cells = $('td[data-columnindex="' + columnIndex + '"]', g.gridContent);
                cells.each(function () {
                    var targetCell = $(this);
                    var rowIndex = targetCell.parent().data("rowindex") || 0;
                    var data = g.getRowData(rowIndex);
                    var input = "";
                    switch (editType) {
                        case 'checkbox':
                            input = g._checkBoxItem(rowIndex, column, data, columnIndex);
                            break;
                        case 'textField':
                            input = g._inputItem(rowIndex, column, data, columnIndex);
                            break;
                        case 'select':
                            input = g._selectItem(rowIndex, column, data, columnIndex);
                            break;
                    }
                    targetCell.append(input);
                    $('span[data-role="display"]', targetCell).hide();
                });
            }
            else {
                //
                self.data("action", "edit");
                self.html("[编辑]");
                g.updateColumn(columnIndex);
                if (column.action && $.isFunction(column.action)) {
                    column.action.call(g, column, g.getData());
                }
            }
            g._bindChangeEvent();

        });
        //
        if (rowsData.length == 0) {
            $('th a.grid_head_btn_edit', g.gridHead).hide();
            $(':checkbox[tag="bcgrid_checkbox"]', g.gridHead).attr("disabled", "disabled");
            if (g.checkedTool) {
                g.checkedTool.hide();
            }
        } else {
            $('th a.grid_head_btn_edit', g.gridHead).show();
            $(':checkbox[tag="bcgrid_checkbox"]', g.gridHead).removeAttr("disabled");
            if (g.checkedTool) {
                g.checkedTool.show();
            }

        }

    };
    var _bindChangeEvent = function () {
        var g = this, p = this.options;
        $('input.columnEdit,select.columnSelect,input.columnCheckBox', g.gridContent).unbind();
        $('input.columnEdit,select.columnSelect,input.columnCheckBox', g.gridContent).on("change", function () {
            var self = $(this);
            var name = self.attr("name");
            var rowIndex = parseInt(self.data('rowindex'));
            var colIndex = parseInt(self.data('colindex'));
            var value = self.val();
            p.data[p.rows][rowIndex][name] = value;
            //内容改变
            if (p.onDataChange && $.isFunction(p.onDataChange)) {
                p.onDataChange.call(g, p.data[p.rows][rowIndex], name, value, rowIndex, colIndex);

            }
        });

    };
    var userAgent = (win.navigator && win.navigator.userAgent) || '';
    var uitls = {
        isMS: /(edge|msie|trident)/i.test(userAgent) && !window.opera,
        isWebKit: /AppleWebKit/.test(userAgent),
        isFirefox: /Firefox/.test(userAgent),
        getID: function () {
            return Number(Math.random().toString().substr(3, 6) + Date.now()).toString(36);
        },
        parseInt: function (s, mag) {
            return parseInt(s, mag || 10);
        },
        /**
         *  check for string type.
         * @param s
         * @returns {boolean}
         */
        isString: function (s) {
            return typeof s === 'string';
        },
        /**
         * check is an array
         * @param obj
         * @returns {boolean}
         */
        isArray: function (obj) {
            var str = Object.prototype.toString.call(obj);
            return str === '[object Array]' || str === '[object Array Iterator]';
        },
        /**
         * check is number
         * @param n
         * @returns {boolean}
         */
        isNumber: function (n) {
            return typeof n === 'number' && !isNaN(n);
        },
        /**
         * check is object
         * @param obj
         * @param strict
         * @returns {boolean}
         */
        isObject: function (obj, strict) {
            return !!obj && typeof obj === 'object' && (!strict || !this.isArray(obj));
        },
        /**
         * is Jquery Object
         * @param obj
         * @returns {boolean}
         */
        isJqueryObject: function (obj) {
            return obj instanceof jQuery;
        },
        /**
         * check is function
         * @param obj
         * @returns {*|boolean}
         */
        isFunction: function (obj) {
            return obj && typeof (obj) == "function";
        },
        /**
         * in Array
         * @param arr
         * @param obj
         * @returns {boolean}
         */
        inArray: function (arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        /**
         * check obj is defined
         * @param obj
         * @returns {boolean}
         */
        isDefined: function (obj) {
            return obj !== undefined && obj !== null;
        }

    };
    /**
     * BC Gird
     * @param options
     * @returns {*}
     */
    $.fn.bcGrid = function (options) {
        var bcGridPlg = new bcGrid(this, options);
        return bcGridPlg.render();
    };
})(jQuery);
