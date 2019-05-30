/**
 * File:bc.grid.js
 * Youth is just a section of unoptimized code!
 * -------------------------------------------------------------------------
 * Created by BigQ on 2018/4/3.
 *--------------------------------------------------------------------------
 */
//
'use strict';
window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
        = c.clear = c.exception = c.trace = c.assert = function () {
    };
    return c;
})();
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('BCGrid', [], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        // like Node.
        module.exports = root.document ?
            factory(root) :
            factory;
    } else {
        root.BCGrid = factory(root);
    }
}(typeof window !== 'undefined' ? window : this, function (win) {
    var BCGrid = (function () {
        var win = window,
            doc = win.document;
        var userAgent = (win.navigator && win.navigator.userAgent) || '',
            isMS = /(edge|msie|trident)/i.test(userAgent) && !window.opera,
            isFirefox = /Firefox/.test(userAgent);
        var scriptsPath = function () {
            var jsPath = doc.currentScript ? doc.currentScript.src : function () {
                var js = doc.scripts, last = js.length - 1, src;
                for (var i = last; i > 0; i--) {
                    if (js[i].readyState === 'interactive') {
                        src = js[i].src;
                        break;
                    }
                }
                return src || js[last].src;
            }();
            return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        }();
        var BCGrid = {
            product: 'BC Grid',
            version: '1.2.1',
            doc: doc,
            isIE: /msie/i.test(userAgent),
            isMoz: /gecko/.test(userAgent),
            isMS: isMS,
            isWebKit: /AppleWebKit/.test(userAgent),
            isFirefox: isFirefox,
            win: win,
            path: scriptsPath
        };
        return BCGrid;
    }());
    var langMaps = {};
    //public methods
    (function (B) {
        /**
         * add lang
         * @param obj
         */
        B.addLang = function (lang, obj) {
            langMaps[lang] = obj;
        };
        /**
         * get lang text
         * @param lang
         * @param en
         * @returns {*}
         */
        B.getLangText = function (lang, en) {
            if (B.isEmptyObject(lang) || lang.toLowerCase() === 'en' || B.isUnDefined(langMaps[lang])) return en;
            var langObject = langMaps[lang];
            return B.isDefined(langObject[en]) ? langObject[en] : en;
        };
        /**
         * create a grid
         * @param selector
         * @param options
         * @returns {*}
         * @constructor
         */
        B.create = function (selector, options) {
            var bcGridPlg = new BcGrid(selector, options);
            return bcGridPlg.render();
        };
    }(BCGrid));
    (function (B) {
        B.getID = function () {
            return Number(Math.random().toString().substr(3, 4) + Date.now()).toString(36);
        };
        B.parseInt = function (s, mag) {
            return parseInt(s, mag || 10);
        };
        /**
         *  check for string type.
         * @param s
         * @returns {boolean}
         */
        B.isString = function (s) {
            return typeof s === 'string';
        };
        /**
         * check is an array
         * @param obj
         * @returns {boolean}
         */
        B.isArray = function (obj) {
            var str = Object.prototype.toString.call(obj);
            return str === '[object Array]' || str === '[object Array Iterator]';
        };
        /**
         * check is number
         * @param n
         * @returns {boolean}
         */
        B.isNumber = function (n) {
            return typeof n === 'number' && !isNaN(n);
        };
        /**
         * check is object
         * @param obj
         * @param strict
         * @returns {boolean}
         */
        B.isObject = function (obj, strict) {
            return !!obj && typeof obj === 'object' && (!strict || !B.isArray(obj));
        };
        /**
         * is Jquery Object
         * @param obj
         * @returns {boolean}
         */
        B.isJqueryObject = function (obj) {
            return obj instanceof jQuery;
        };
        /**
         * check is function
         * @param obj
         * @returns {*|boolean}
         */
        B.isFunction = function (obj) {
            return obj && typeof (obj) == "function";
        };
        B.isEmptyObject = function (obj) {
            return !B.isDefined(obj) || obj === "" || obj === null || obj === false || function () {
                var t;
                if (B.isNumber(obj)) return false;
                for (t in obj) {
                    return false;
                }
                return true;
            }();
        };
        /**
         * in Array
         * @param arr
         * @param obj
         * @returns {boolean}
         */
        B.inArray = function (arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        };
        /**
         * check obj is defined
         * @param obj
         * @returns {boolean}
         */
        B.isDefined = function (obj) {
            return typeof obj !== 'undefined' && obj !== null;
        };
        B.isUnDefined = function (obj) {
            return !B.isDefined(obj);
        };
        B.extend = function (a, b) {
            var n;
            if (!a) {
                a = {};
            }
            for (n in b) {
                a[n] = b[n];
            }
            return a;
        };
        /**
         * get sub array
         * @param arr
         * @param value
         * @param key
         * @returns {*}
         */
        B.getSubArray = function (arr, value, key) {
            if (B.isArray(arr)) {
                return arr.filter(function (val, index) {
                    if (key !== undefined) {
                        return val[key] === value;
                    } else {
                        return val === value;
                    }
                });
            } else {
                return [];
            }

        };
        /**
         * arrayToTree
         * @param arrayList
         * @param key
         * @param parentKey
         * @param children
         * @returns {Array}
         */
        B.arrayToTree = function (arrayList, key, parentKey, children) {
            var tree = []; //格式化的树
            var tmpMap = {};  //临时扁平数据
            var i = 0;
            for (i = 0; i < arrayList.length; i++) {
                tmpMap[arrayList[i][key]] = arrayList[i];
            }
            for (i = 0; i < arrayList.length; i++) {
                var item = arrayList[i], hash = tmpMap[item[parentKey]];
                if (B.isDefined(hash)) {
                    if (!B.isDefined(hash[children])) hash[children] = new Array();
                    hash[children].push(item);
                } else {
                    tree.push(item);
                }
            }
            return tree;
        };
        /**
         * arrayObjectFilter
         * @param arrayList
         * @param key string or filterParamArray
         * @param value
         * @returns {Array}
         */
        B.arrayObjectFilter = function (arrayList, key, value) {
            if (!BCGrid.isArray(arrayList) || arrayList.length == 0) return [];
            if (BCGrid.isUnDefined(key) || (!BCGrid.isArray(key) && BCGrid.isUnDefined(value))) return [];
            return arrayList.filter(function (item) {
                var validate = true;
                if (!BCGrid.isArray(key)) {
                    validate = (item[key] === value);
                } else {
                    for (var i in key) {
                        if (item[key[i].name] !== key[i].value) {
                            validate = false;
                            break;
                        }
                    }

                }
                return validate;

            });

        };
        /**
         * Object Deep Copy
         * @param source
         * @returns {*}
         */
        B.objectDeepCopy = function (source) {
            var sourceCopy = BCGrid.isArray(source) ? [] : {};
            for (var item in source) {
                sourceCopy[item] = B.isObject(source[item]) ? BCGrid.objectDeepCopy(source[item]) : source[item];
            }
            return sourceCopy;
        };
        /**
         * arraySortOnGroup
         * @param source
         * @param keysArr
         * @returns {*}
         */
        B.arraySortOnGroup = function (source, keysArr) {
            if (B.isEmptyObject(keysArr) || B.isEmptyObject(source)) {
                return source;
            }
            //去除不存在的key
            for (var i = keysArr.length - 1; i > 0; i--) {
                var isExist = false;
                for (var key in source[0]) {
                    if (keysArr[i] == key) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    keysArr.splice(i, 1);
                }
            }
            if (B.isEmptyObject(keysArr)) {
                return source;
            }
            var tempData = B.objectDeepCopy(source);
            var keyName = "";
            var hash = [];
            var rootIndex = 0, spanCount = 0;
            for (var i = 0; i < tempData.length; i++) {
                var isExt = false;
                for (var j = 0; j < hash.length; j++) {
                    var isEq = true;
                    for (var key in keysArr) {
                        keyName = keysArr[key];
                        if (tempData[i][keyName] !== hash[j][keyName]) {
                            isEq = false;
                            break;
                        }
                    }
                    if (isEq) {
                        isExt = true;
                        break;
                    }
                }
                if (!isExt) {
                    spanCount = 0;
                    // tempData[i]['_rootSpan']=true;
                    tempData[i]['_isroot'] = true;
                    hash.push(tempData[i]);
                    rootIndex = hash.length - 1;
                    for (var k = 0; k < tempData.length; k++) {
                        if (k == i) {
                            continue;
                        }
                        var isEqs = true;
                        for (var key in keysArr) {
                            keyName = keysArr[key];
                            if (tempData[i][keyName] !== tempData[k][keyName]) {
                                isEqs = false;
                                break;
                            }
                        }
                        if (isEqs) {
                            spanCount++;
                            tempData[k]['_spanCount'] = 0;
                            tempData[k]['_isroot'] = false;
                            hash.push(tempData[k]);
                        }
                    }
                    hash[rootIndex]['_spanCount'] = spanCount;
                }

            }
            return hash;

        };
        /**
         * getQueryString
         * @param name
         * @returns {string}
         */
        B.getQueryString = function (name) {
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        };
        /**
         * getUrlParam
         * @param url
         * @param name
         * @returns {RegExpExecArray | string}
         */
        B.getUrlParam = function (url, name) {
            var match = new RegExp('[?&]' + name + '=([^&]*)')
                .exec(url);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        };
        /**
         * setUrlParam
         * @param url
         * @param name
         * @param value
         * @returns {*}
         */
        B.setUrlParam = function (url, name, value) {
            var r = url;
            if (r != null && r != 'undefined' && r != "") {
                value = encodeURIComponent(value);
                var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
                var tmp = name + "=" + value;
                if (url.match(reg) != null) {
                    r = url.replace(eval(reg), tmp);
                }
                else {
                    if (url.match("[\?]")) {
                        r = url + "&" + tmp;
                    } else {
                        r = url + "?" + tmp;
                    }
                }
            }
            return r;
        };
        B.setLoadingCenterInBrowser = function () {
            var ele = $(".bc-loading");
            var bH = 0, bW = 0;
            if (window.innerWidth) {
                bW = window.innerWidth;
                bH = window.innerHeight;


            } else if (document.compatMode === "CSS1Compat") {
                bW = document.documentElement.clientWidth;
                bH = document.documentElement.clientHeight;


            } else {
                bW = document.body.clientWidth;
                bH = document.body.clientHeight;

            }
            var eleW = ele.outerWidth();
            var eleH = ele.outerHeight();
            var left = (bW - eleW) / 2;
            var top = (bH - eleH) / 2;
            ele.css("left", left + "px");
            ele.css("top", top + "px");
        };
        B.showShade = function (opacity, zIndex) {
            opacity = this.isNumber(opacity) ? opacity : 0.4;
            zIndex = this.isNumber(zIndex) ? zIndex : 19870515;
            var shade = $('<div class="bc-shade"></div>');
            shade.css("z-index", zIndex).css("opacity", opacity);
            $('body').append(shade);
        };
        B.hideShade = function () {
            $('.bc-shade').remove();
        };
        B.showLoading = function (options) {
            var defOpt = {
                style: 1,
                text: 'Loading...',
                zIndex: 19870515,
                shade: 0.2
            };
            var opt = $.extend({}, defOpt, options || {});
            //shade
            this.showShade(opt.opacity, opt.zIndex - 1);
            var $loadingWrap = $('<div class="bc-loading" width="180px"></div>');
            var $loadingContent = $('<div class="bc-loading-content"></div>');
            //
            if (opt.style != 3) {
                $loadingContent.addClass("bc-loading" + opt.style);
            } else {
                $loadingWrap.addClass("bc-loading-msg");
                $loadingContent.html('<i class="ico"></i>' + opt.text);
            }
            $loadingWrap.css("z-index", defOpt.zIndex);
            $loadingWrap.append($loadingContent);
            $('body').append($loadingWrap);
            $loadingWrap.show();
            $(window).on("resize", BCGrid.setLoadingCenterInBrowser);
            BCGrid.setLoadingCenterInBrowser();
        };
        B.hideLoading = function () {
            $(window).unbind("resize", this.setLoadingCenterInBrowser);
            $(".bc-loading").remove();
            BCGrid.hideShade();
        };
        B.closeLoading = function () {
            BCGrid.hideLoading();
        };
        B.ajax = function (options) {
            //默认值
            var defaultOpt = {
                url: '',
                async: true,
                showLoading: true,
                loadingTip: "数据请求中...",
                loadingStyle: 3,
                type: 'post',
                dataType: 'json',
                data: '',
                beforeSend: null,
                complete: null,
                success: null,
                error: null
            };
            var p = $.extend({}, defaultOpt, options || {});
            if (BCGrid.isEmptyObject(p.url)) {
                p.url = window.location.href;
            }
            p.url = BCGrid.setUrlParam(p.url, "_tmp", (new Date()).valueOf());
            $.ajax({
                cache: false,
                async: p.async,
                url: p.url,
                data: p.data,
                dataType: p.dataType,
                type: p.type,
                beforeSend: function () {
                    if (p.showLoading) {
                        B.showLoading({style: p.loadingStyle, text: p.loadingTip});
                    }
                    if (p.beforeSend) {
                        p.beforeSend();
                    }

                },
                complete: function () {
                    if (p.showLoading) {
                        B.hideLoading();
                    }
                    if (p.complete) {
                        p.complete();
                    }
                },
                success: function (result) {
                    if (!result) return;
                    if (p.success) {
                        p.success(result);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (p.error) {
                        p.error(XMLHttpRequest, textStatus, errorThrown);
                    }
                    else {
                        console.log(errorThrown);
                    }
                }
            });
        };
        B.loadJS = function (id, src, onload) {
            if (!B.isEmptyObject(document.getElementById(id))) {
                if (BCGrid.isFunction(onload)) {
                    onload();
                }
                return;
            }
            var _script = document.createElement('script');
            _script.setAttribute('type', 'text/javascript');
            _script.setAttribute('src', BCGrid.path + src);
            _script.id = id;
            document.getElementsByTagName('head')[0].appendChild(_script);
            if ('onreadystatechange' in _script) {
                _script.onreadystatechange = function () {
                    if (/loaded|complete/.test(_script.readyState)) {
                        if (BCGrid.isFunction(onload)) {
                            onload();
                        }
                    }
                };
            } else {
                _script.onload = function () {
                    if (BCGrid.isFunction(onload)) {
                        onload();
                    }
                };
            }
        };
        B.loadCSS = function (id, src, onload) {
            if (!B.isEmptyObject(document.getElementById(id))) {
                if (BCGrid.isFunction(onload)) {
                    onload();
                }
                return;
            }
            var _link = document.createElement('link');
            _link.type = 'text/css';
            _link.rel = 'stylesheet';
            _link.href = BCGrid.path + src;
            _link.id = id;
            document.getElementsByTagName('head')[0].appendChild(_link);
            if ('onreadystatechange' in _link) {
                _link.onreadystatechange = function () {
                    if (/loaded|complete/.test(_link.readyState)) {
                        if (BCGrid.isFunction(onload)) {
                            onload();
                        }
                    }
                };
            } else {
                _link.onload = function () {
                    if (BCGrid.isFunction(onload)) {
                        onload();
                    }
                };
            }
        };
        B.buildParams = function (selector) {
            var arrayObj = [];
            var sf = $(selector);
            sf.find("input, select, textarea")
                .not(":submit, :button,:reset, :image, [disabled]").each(function () {
                arrayObj.push({"name": "" + $(this).attr("name") + "", "value": "" + $(this).val() + ""});
            });
            return arrayObj;
        };
        /**
         * getTableAction
         * @param actionArr
         * @returns {string | *}
         */
        B.getTableAction = function (actionArr) {
            var btnsHtml = $('<div class="actions"></div>');
            $.each(actionArr, function (index, item) {
                var itemBtn = $('<a></a>');
                if (item.type) {
                    switch (item.type) {
                        case "edit":
                            item.color = item.color || "green";
                            item.icon = item.icon || "fa fa-pencil";
                            break;
                        case "delete":
                            item.color = item.color || "red";
                            item.icon = item.icon || "fa fa-trash-o";
                            break;
                        case "conf":
                        case "set":
                            item.color = item.color || "grey";
                            item.icon = item.icon || "fa fa-cog";
                            break;
                        case "list":
                        case "info":
                        case "detail":
                            item.color = item.color || "blue";
                            item.icon = item.icon || "fa fa-th";
                            break;
                        case "lock":
                            item.color = item.color || "grey";
                            item.icon = item.icon || "fa fa-lock";
                            break;
                        case "unlock":
                            item.color = item.color || "blue";
                            item.icon = item.icon || "fa fa-unlock";
                            break;
                    }
                }
                itemBtn.addClass(item.color || "");
                if (typeof item.type == 'undefined' || item.type == "text") {
                    itemBtn.html(item.title || "");
                }
                else {
                    itemBtn.append('<i class="' + (item.icon || "") + '"></i>');
                }
                itemBtn.attr("href", item.href || "javascript:void(0);");
                if (item.target) {
                    itemBtn.attr("target", item.target);
                }
                btnsHtml.append(itemBtn);
            });
            return btnsHtml.get(0).outerHTML;

        };
    }(BCGrid));
    /**
     * grid
     * @param ele
     * @param opt
     */
    var BcGrid = function (ele, opt) {
        this.gridWrap = this.element = $(ele);
        this.grid = null;
        this.gridHead = null;
        this.gridFoot = null;
        this.gridContent = null;
        this.pager = null;
        this.ID = "";
        this.defaults = {
            id: '',
            width: '',                          //宽度值
            height: '',                          //宽度值
            enableCsrf: false,
            csrfName: '_csrf',
            lang: 'en',
            theme: '',
            csrf: '',
            url: '',                             //ajax url
            data: {},                            //初始化数据
            localData: [],
            autoLoadData: true,
            showLoading: true,               //是否显示加载状态提示
            loadingTip: 'Loading',//加载提示信息
            loadingStyle: 3,//加载样式
            enablePager: true,                         //是否分页
            page: 1,                                //默认当前页
            pageSize: 40,                           //每页默认的结果数 all全部
            pageSizeOptions: [10, 20, 30, 40, 50, 100],  //可选择设定的每页结果数 支持 all
            pagerAlign: 'left',
            pagerOption: {},
            sortName: "",                       //排序列字段
            sortOrder: "",                      //排序方向
            params: [],                         //提交到服务器的参数
            columns: [],                          //数据源
            dataSource: 'server',                     //数据源：本地(local)或(server)
            //pageSourceType: 'ajax',                    //分页的方式：本地(local)或(server),选择本地方式时将在客服端分页、排序。
            ajaxType: 'post', //ajax数据提交方式 get/post
            showCheckbox: false,                         //是否显示复选框
            showSerialNum: true,    //是否显示序号
            showBorder: true, //是否显示边框
            showStripe: true,//是否显示条纹间隔效果
            showHeadColor: true,//是否表头显示背景色
            showHover: true,//是否显示hover效果
            showHead: true,
            showTitle: false,//显示标题 true/false  与colResize互斥  showTitle优先
            showFoot: false,//显示foot true/false
            serialNumWidth: null,//serialNumWidth
            title: "",
            foot: "",
            titleAlign: null,//标题对齐方向
            footAlign: null,//foot内容对齐方向
            noDataHtml: '<div class="center">暂无任何记录</div>',
            dateFormat: 'yyyy-MM-dd hh:mm:ss',              //默认时间显示格式
            wrapCssClass: '',                    //类名
            cssClass: 'bc-table',                    //类名
            rows: 'rows',                       //数据源字段名
            total: 'total',                     //数据源记录数字段名
            pageParamName: 'page',               //页索引参数名，(提交给服务器)
            pageSizeParamName: 'pagesize',        //页记录数参数名，(提交给服务器)
            sortNameParamName: 'sortname',        //页排序列名(提交给服务器)
            sortOrderParamName: 'sortorder',      //页排序方向(提交给服务器)
            pagerElement: null,                  //分页容器
            enableSelectRow: true, //是否可选择行
            enableMultiSelectRow: false,//是否允许行多选
            onCheckClick: null,                       //选择事件(复选框)
            onCheckAllClick: null,                  //选择点击数据（全选/全不选）
            onError: null,                         //错误事件
            onCompleted: null,                          //加载完函数
            onLoadData: null,                       //加载数据前事件
            onLoadedData: null,                  //加载完数据事件
            onSelectedRow: null, //选择行事件
            onRowClick: null, //单击行事件
            onRowDbClick: null,//双击行事件
            onRowDetailExpandOrCollapse: null,//row 明细展开/收缩事件
            onTreeExpandOrCollapse: null,//树展开/收缩事件
            onDataChange: null, //数据改变事件
            onSelectChange: null,//下拉改变事件
            onSwitchChange: null,//开关改变事件
            onTextFieldChange: null,//文本输入改变事件
            onDataSave: null,
            toolBtns: [],
            rowDetail: null,//明细 与tree和rowSpanKeys互斥 rowDetail优先，其次tree
            rowStyle: null,//行样式
            tree: null,//tree设置 与rowDetail和rowSpanKeys互斥 rowDetail优先，其次tree
            rowSpanKeys: null,//合并行key['key1','key2'] 与rowDetail和tree互斥 rowDetail优先，其次tree
            colResize:{
                liveDrag: true,
                minWidth: 20,
            } // jsonObject or null/false 列宽可变与showTitle互斥  showTitle优先
        };
        this.options = $.extend(true, {}, this.defaults, opt);
        this._rowIndex = 0;
        this._showColumnLength = 0;
        this._treeChildKey = '';
        //互斥
        if(this.options.showTitle){
            this.options.colResize = false;
        }
        //行明细
        if (this.options.rowDetail) {
            this.options.rowDetail = $.extend({}, {
                content: function (rowIndex, rowData) {
                    return "";
                },//明细内容string / function(rowIndex,rowData),return string/false
                ctrlStyle: 'db',//控制样式 db/sg/pm
                align: null,
                expand: false
            }, this.options.rowDetail);
            this.options.tree = null;
            this.options.showStripe = false;
            this.options.rowSpanKeys = null;
        }
        if (this.options.tree) {
            this.options.tree = $.extend({}, {
                displayID: '',
                key: 'id',
                parentKey: 'parentid',
                expand: false
            }, this.options.tree);
            this._treeChildKey = 'bc_t_' + BCGrid.getID();
            this.options.rowSpanKeys = null;
        }
        this.options.url = BCGrid.isEmptyObject(this.options.url) ? window.location.href : this.options.url;
    };
    //定义bcGrid的方法
    BcGrid.prototype = {
        render: function () {
            var g = this, p = g.options;
            if (p.lang && p.lang !== 'en') {
                BCGrid.loadJS("bc_grid_lang_" + p.lang, "lang/" + p.lang + ".js", function () {
                    _init.call(g);
                });
            }
            else {
                 _init.call(g);

            }
            return this;
        },
        /**public function **/
        /**
         * loadData
         * @param reloadPage
         */
        loadData: function (reloadPage) {
            var isReloadPage = false;
            if (arguments.length > 0) {
                isReloadPage = reloadPage;
            }
            var g = this, p = this.options;
            var dataParam = [];
            if (p.params) {
                var params = BCGrid.isFunction(p.params) ? p.params.call(g) : p.params;
                if (BCGrid.isArray(params)) {
                    $.each(params, function () {
                        dataParam.push({name: this.name, value: this.value});
                    });
                }
                else if (BCGrid.isObject(params)) {
                    for (var name in params) {
                        dataParam.push({name: name, value: params[name]});
                    }
                }

            }
            var beforeRes = true;
            if (p.onLoadData) {
                beforeRes = p.onLoadData.call(g) || true;
            }
            if (beforeRes == false) {
                return;
            }
            /* if (isReloadPage) {
                 p.page = 1;
             }
             p.page = page||p.page;*/
            if (p.dataSource == 'server') {
                if (!BCGrid.isEmptyObject(p.sortName)) {
                    dataParam.push({name: p.sortNameParamName, value: p.sortName});
                    dataParam.push({name: p.sortOrderParamName, value: p.sortOrder});
                }
                if (p.enablePager) {
                    dataParam.push({name: p.pageParamName, value: p.page});
                    dataParam.push({name: p.pageSizeParamName, value: p.pageSize});
                }
                if (p.enableCsrf) {
                    dataParam.push({name: p.csrfName, value: p.csrf});
                }
                BCGrid.ajax({
                    url: p.url,
                    showLoading: p.showLoading,
                    loadingTip: BCGrid.getLangText(p.lang, p.loadingTip),
                    data: $.param(dataParam),
                    type: p.ajaxType,
                    dataType: 'json',
                    success: function (data) {
                        p.data = data;
                        _rawData = g.getData();
                        _displayData.call(g);
                        if (isReloadPage && p.enablePager) {
                            _displayPage.call(g);
                        }
                        if (p.showCheckbox) {
                            $('#'+ g.ID + '_checkbox_all').prop('checked', false);
                        }
                        if (p.onLoadedData) {
                            //
                            p.onLoadedData.call(g, p.data);

                        }
                    },

                    error: function (MLHttpRequest, textStatus, errorThrown) {
                        if (p.showLoading) {
                            BCGrid.hideLoading();
                        }
                        _error.call(g, '数据加载失败！' + errorThrown.toLocaleString());
                    },
                    complete: function () {
                    }
                });
            }
            else if (p.dataSource == 'local') {
                var tempData = BCGrid.objectDeepCopy(p.localData);
                if (!BCGrid.isEmptyObject(p.sortName) && tempData.length > 0) {
                    tempData.sort(function (a, b) {
                        return p.sortOrder.toLowerCase() == "desc" ? b[p.sortName] - a[p.sortName] : a[p.sortName] - b[p.sortName];
                    });
                }
                //search
                if (dataParam.length > 0) {
                    tempData = BCGrid.arrayObjectFilter(tempData, dataParam);
                }
                if (p.enablePager) {
                    var start = BCGrid.parseInt((p.page - 1) * p.pageSize);
                    tempData = tempData.slice(start, start + BCGrid.parseInt(p.pageSize));
                }
                //

                p.data[p.rows] = tempData;
                p.data[p.total] = p.localData.length;
                _rawData = p.localData;
                //  _localCurrentTempData = tempData;
                _displayData.call(g, tempData);
                if (isReloadPage && p.enablePager) {
                    _displayPage.call(g);
                }
                if (p.showCheckbox) {
                    $('#'+ g.ID + '_checkbox_all').prop('checked', false);
                }
                if (p.onLoadedData) {
                    // 
                    p.onLoadedData.call(g, p.data);
                }
            }
        },
        /**
         * reload ---page will set 1
         */
        reload: function () {
            var res = true, g = this;
            if (g.options.onReload) {
                res = g.options.onReload.call(g);
            }
            if (res) {
                g.options.page = 1;
                g.loadData(true);
            }
        },
        /**
         * reloadData ---page no change
         */
        reloadData: function () {
            var res = true, g = this;
            if (g.options.onReload) {
                res = g.options.onReload.call(g);
            }
            if (res) {
                g.loadData(true);
            }
        },
        /**
         *  refresh grid
         */
        refresh: function () {
            var res = true, g = this;
            g.options.page = 1;
            if (g.options.onRefresh) {
                res = g.options.onRefresh.call(this);
            }
            if (res) {
                _init.call(g);
            }
        },
        /**
         * rebuild
         */
        rebuild:function(opt){
          /*  var   g = this,p=this.options;
            this.options = $.extend(true, {}, this.defaults, opt);
            this._rowIndex = 0;
            this._showColumnLength = 0;
            this._treeChildKey = '';
            this._initOption = opt;
            //行明细
            if (this.options.rowDetail) {
                this.options.rowDetail = $.extend({}, {
                    content: function (rowIndex, rowData) {
                        return "";
                    },//明细内容string / function(rowIndex,rowData),return string/false
                    ctrlStyle: 'db',//控制样式 db/sg/pm
                    align: null,
                    expand: false
                }, this.options.rowDetail);
                this.options.tree = null;
                this.options.showStripe = false;
                this.options.rowSpanKeys = null;
            }
            if (this.options.tree) {
                this.options.tree = $.extend({}, {
                    displayID: '',
                    key: 'id',
                    parentKey: 'parentid',
                    expand: false
                }, this.options.tree);
                this._treeChildKey = 'bc_t_' + BCGrid.getID();
                this.options.rowSpanKeys = null;
            }
            this.options.url = BCGrid.isEmptyObject(this.options.url) ? window.location.href : this.options.url;
            _init.call(g);*/

        },
        /*  /!**
         * 添加按钮
         * @param opt
         *!/
         addToolBtn: function (opt) {
         var self = this;
         self.pager.addToolButton(opt);
         },*/
        /**
         * get current page number
         * @returns {number|*}
         */
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
            if (BCGrid.isDefined(this.options.data[this.options.rows])) {
                return this.options.data[this.options.rows];
            }
            return [];

        },
        getRawData: function () {
            return _rawData;
        },
        getRowData: function (rowindex) {
            return this.options.data[this.options.rows][rowindex];
        },
        getTotal: function () {
            return this.options.data[this.options.total] || 0;
        },
        deleteRow: function (rowIndex) {
            var g = this, p = this.options;
          //  var row = $('tr[id="bcgrid_' + g.ID + '_list_' + rowIndex + '"]', g.gridContent);
            var row = $('tr[data-rowindex="' + rowIndex + '"]', g.gridContent);
            if (p.rowDetail) {
                row.next('tr[data-forrowindex="' + rowIndex + '"]').remove();
            }
            if (row.length > 0) {
                row.remove();
                p.data[p.total] = parseInt(p.data[p.total]) - 1;
                _displayPage.call(g);
            }

        },
        deleteRows: function (rowIndexArr) {
            var g = this, p = this.options;
            var tempDeleteRowCount = 0;
            $.each(rowIndexArr, function () {
                var row = $('tr[data-rowindex="' + this + '"]', g.gridContent);
               // var row = $('tr[id="bcgrid_' + g.ID + '_list_' + this + '"]', g.gridContent);
                if (p.rowDetail) {
                    row.next('tr[data-forrowindex="' + this + '"]').remove();
                }
                if (row.length > 0) {
                    row.remove();
                    tempDeleteRowCount++;
                }
            });
            p.data[p.total] = parseInt(p.data[p.total]) - tempDeleteRowCount;
            _displayPage.call(g);
        },
        getCheckedRows: function () {
            var rows = [];
            var g = this, p = this.options;
            if (p.showCheckbox) {
                $('input[tag="bcgrid_checkbox"]', g.gridContent).each(function () {
                    if ($(this).is(':checked')) {
                        //
                        rows.push(p.data[p.rows][parseInt($(this).closest("tr").data('rowindex'))]);
                    }
                });
            }
            return rows;
        },
        setCheckedRows: function (rowIndexArr, isChecked) {
            var g = this, p = this.options;
            $.each(rowIndexArr, function (index, item) {
                g.setCheckedRow(item, isChecked);
            });
        },
        setCheckedRow: function (rowIndex, isChecked) {
            var g = this, p = this.options;
            $("#" + g.ID + "_checkbox_" + rowIndex, g.gridContent).prop('checked', isChecked);
           // $("#bcgrid_" + g.ID + "_checkbox_list_" + rowIndex, g.gridContent).prop('checked', isChecked);

        },
        getCheckedRowsIndex: function () {
            var rows = [];
            var g = this, p = this.options;
            if (p.showCheckbox) {
                $('input[tag="bcgrid_checkbox"]', g.gridContent).each(function () {
                    if ($(this).is(':checked')) {
                        rows.push(parseInt($(this).closest("tr").data('rowindex')));
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

         //   $("#bcgrid_" + g.ID + "_list_" + rowIndex).html(dataHtml.join(''));
            _bindEvent.call(g);
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
            $("#" + g.ID + "_title").html(title);
        },
        setFoot: function (foot) {
            var g = this, p = this.options;
            p.foot = foot;
            $("#" + g.ID + "_foot").html(foot);
        },
        addColumn: function (column, index) {
            var g = this, p = this.options;
            var pos = index || p.columns.length - 1;
            p.columns.splice(pos, 0, column || {});
            g.refresh();
        },
        /*  setData: function (rows) {
              var g = this, p = this.options;
              p.data[p.rows] = rows;
              p.data[p.total] = rows.length;
          },*/
        toggleRowDetail: function (rowIndex) {
            var g = this, p = this.options;
            // var rowsData = p.dataSource == 'local' ? _localCurrentTempData : p.data[p.rows];
            var rowsData = g.getData();
            var row = $('tr[data-rowindex="' + rowIndex + '"]', g.gridContent);
         //   var row = $('tr[id="bcgrid_' + g.ID + '_list_' + rowIndex + '"]', g.gridContent);
            var isExpand = _toggleDetail.call(g, row);
            if (p.onRowDetailExpandOrCollapse && BCGrid.isFunction(p.onRowDetailExpandOrCollapse)) {
                p.onRowDetailExpandOrCollapse.call(g, isExpand, rowIndex, rowsData[rowIndex]);
            }
        },
        /**
         * 筛选数据
         * @param formSelector
         */
        filterData: function (formSelector) {
            var g = this, p = this.options;
            var paramsData = (BCGrid.isObject(formSelector) || BCGrid.isArray(formSelector)) ? formSelector : BCGrid.buildParams(formSelector);
            g.set({params: paramsData});
            g.reload();
        }
    };
    // private function and variable
    //初始化
    var _localCurrentTempData = [];
    var _rawData = [];//原始数据
    var _timeFn = null;
    var _init = function () {
        _rawData = [];
        var g = this, p = this.options;
        if (BCGrid.isEmptyObject(p.data) && !BCGrid.isEmptyObject(p.localData)) {
            p.data[p.rows] = p.localData;
            p.data[p.total] = p.localData.length;
        }
        if (!BCGrid.isEmptyObject(p.id)) {
            g.ID = p.id;
        }
        if (BCGrid.isEmptyObject(g.ID)) {
            g.ID = "bc_" + BCGrid.getID();
        }
        //csrf
        if (p.enableCsrf && BCGrid.isEmptyObject(p.csrf)) {
            p.csrf = $("input[name='" + p.csrfName + "']").val();
        }
        if (!g.gridWrap.hasClass(p.wrapCssClass)) {
            g.gridWrap.addClass(p.wrapCssClass);
        }
        //page
        var page = BCGrid.getQueryString(p.pageParamName);
        if (!isNaN(page) && page != '') {
            p.page = page;
        }
        var tableWrap = $(".bc-table-wrap", g.gridWrap);
        if (tableWrap.length == 0) {
            tableWrap = $('<div class="bc-table-wrap"></div>');
        }
        g.grid = $('<table role="grid"></table>');
        g.grid.attr("id", g.ID);
        g.grid.addClass(p.cssClass);
        if (p.showBorder) {
            g.grid.addClass("table-bordered");
        }
        if (p.showStripe) {
            g.grid.addClass("table-striped");
        }
        if (p.showHover) {
            g.grid.addClass("table-hover");
        }
        if (p.showHeadColor) {
            g.grid.addClass("table-head-color");
        }

        if (!BCGrid.isEmptyObject(p.width)) {
            tableWrap.css("width", p.width);
        }
        if (!BCGrid.isEmptyObject(p.height)) {
            tableWrap.css("height", p.height);
        }
        _preRenderColumnOpt.call(g);
        if (p.showHead || p.showTitle) {
            _setHead.call(g);
        }
        if (p.showFoot) {
            _setFoot.call(g);
        }
        _setGridContent.call(g);
        if ($("#" + g.ID, tableWrap).length == 0) {
            tableWrap.html(g.grid);
        }
        else {
            $("#" + g.ID, tableWrap).remove();
            tableWrap.prepend(g.grid);
        }
        g.gridWrap.html(tableWrap);
        if (p.onCompleted) {
            p.onCompleted.call(g);
        }
        if (p.autoLoadData) {
            g.loadData(true);
        }
        else{
            _lastHandler.call(g);
        }
    };
    var _preRenderColumnOpt = function () {
        var g = this, p = this.options;
        var defaultOpt = {
            display: '',//标题显示
            id: '',//id
            name: 'name',//数据name
            type: 'text',//数据类型
            render: null,//执行行数
            hide: false,//是否隐藏
            width: null,//列宽
            align: null,//文本水平对齐方式
            vAlign:null,//文本垂直对齐方式
            headAlign: null,//标题对齐方式
            maxLength: null,//显示的最大长度
            format: null,//显示数据格式(date)
            role: 'data',
            enableSort: false,//是否可以排序
            allowNewline: false,//是否允许自动换行
            elOpt: null//可编辑控制参数

        };
        g._showColumnLength = p.columns.length;
        for (var i = 0; i < p.columns.length; i++) {
            p.columns[i] = $.extend({}, defaultOpt, p.columns[i] || {});
            if (p.columns[i].hide) {
                g._showColumnLength--;
            }
        }
        //
        if (p.showCheckbox) {
            g._showColumnLength++;
        }
        if (p.showSerialNum) {
            g._showColumnLength++;
        }
        //detail
        if (p.rowDetail) {
            g._showColumnLength++;
        }

    };
    //head
    var _setHead = function () {
        var g = this, p = this.options;
        var headAttr = [];
        headAttr.push('<thead>');
        if (p.showTitle) {
            headAttr.push('<tr role="row" class="head-title">');
            headAttr.push('<th' + (BCGrid.isDefined(p.titleAlign) ? ' class="' + p.titleAlign + '"' : '') + ' colspan="' + g._showColumnLength + '" id="' + g.ID + '_title">' + p.title + '</th>');
            headAttr.push('</tr>');
        }
        if (p.showHead) {
            headAttr.push('<tr role="row">');
            if (p.rowDetail) {
                headAttr.push('<th class="center col-ctrl"></th>');
            }
            if (p.showCheckbox) {
                headAttr.push('<th class="center col-ctrl"> <label><input type="checkbox" id="' + g.ID + '_checkbox_all" tag="bcgrid_checkbox"/><span class="lbl"></span></label></th>');
            }
            if (p.showSerialNum) {
                //width
                var serialNumStyle = 'class="center';
                if (!BCGrid.isEmptyObject(p.serialNumWidth)) {
                    if (!isNaN(p.serialNumWidth)) {
                        serialNumStyle = serialNumStyle + ' width-' + p.serialNumWidth + '"';
                    }
                    else {

                        serialNumStyle = serialNumStyle + '" width="' + p.serialNumWidth + '"';
                    }
                } else {
                    serialNumStyle = serialNumStyle + '"';
                }
                headAttr.push('<th ' + serialNumStyle + '>' + BCGrid.getLangText(p.lang, "Serial") + '</th>');
            }
            //标题
            headAttr.push(_getHeadColumn.call(g));
            headAttr.push('</tr>');
        }
        headAttr.push('</thead>');
        g.gridHead = $(headAttr.join(''));
        g.grid.html(g.gridHead);
    };
    //foot
    var _setFoot = function () {
        var g = this, p = this.options;
        var footAttr = [];
        footAttr.push('<tfoot>');
        if (p.showFoot) {
            footAttr.push('<tr role="row" class="footer">');
            footAttr.push('<td' + (BCGrid.isDefined(p.footAlign) ? ' class="' + p.footAlign + '"' : '') + ' colspan="' + g._showColumnLength + '" id="' + g.ID + '_foot">' + p.foot + '</td>');
            footAttr.push('</tr>');
        }
        footAttr.push('</tfoot>');
        g.gridFoot = $(footAttr.join(''));
        g.grid.append(g.gridFoot);
    };
    //th
    var _getHeadColumn = function () {
        var g = this, p = this.options;
        var headAttr = [];
        $.each(p.columns, function (index, item) {
            var showText = item.display;
            if (BCGrid.isFunction(showText)) {
                showText = showText.call(g, item, index);
                if (BCGrid.isUnDefined(showText)) {
                    showText = "";
                }
            }
            var $th = $('<th data-col="' + item.name + '" data-columnindex="' + index + '"></th>');
            if (BCGrid.isDefined(item.headAlign)) {
                $th.addClass(item.headAlign);
            }
            if (!BCGrid.isEmptyObject(item.width)) {
                if (!isNaN(item.width)) {
                    $th.addClass("width-" + item.width);
                }
                else {
                    $th.attr("width", item.width);
                }
            }
            //sort
            if (item.hide) {
                $th.hide();
            }
            $th.html(showText);
            if (item.enableSort) {
                !$th.hasClass("cursor-pointer") && $th.addClass("cursor-pointer");
                var $sortEl = $('<span class="sort"><i class="asc"></i><i class="desc"></i></span>');
                $th.append($sortEl);
            }
            headAttr.push($th.prop('outerHTML'));
        });
        return headAttr.join("");
    };
    var _setGridContent = function () {
        this.gridContent = $('<tbody></tbody>');
        this.grid.append(this.gridContent);
    };
    var _displayData = function (data) {
        _localCurrentTempData = [];
        var g = this, p = g.options;
        data = data || g.getData();
        g.gridContent.empty();
        g._rowIndex = 0;
        var tempData = BCGrid.objectDeepCopy(data);
        //tree
        if (p.tree) {
            tempData = BCGrid.arrayToTree(tempData, p.tree.key, p.tree.parentKey, g._treeChildKey);
        }
        else if (!BCGrid.isEmptyObject(p.rowSpanKeys)) {
            //rowspan
            tempData = BCGrid.arraySortOnGroup(tempData, p.rowSpanKeys);
        }
        g.gridContent.html(_displayListData.call(g, tempData, 0));
        if (tempData.length == 0) {
            $('input:checkbox[tag="bcgrid_checkbox"]', g.gridHead).attr("disabled", "disabled");

        } else {
            $('input:checkbox[tag="bcgrid_checkbox"]', g.gridHead).removeAttr("disabled");
        }
        //
        _setData.call(g, _localCurrentTempData);
        _bindEvent.call(g);
    };
    var _displayListData = function (data, depth, parentRowIndex) {
        var g = this, p = this.options;
        var trArr = [];
        if (BCGrid.isUnDefined(depth)) depth = 0;
        if (BCGrid.isUnDefined(parentRowIndex)) parentRowIndex = 0;
        parentRowIndex--;
        if (data.length == 0 && depth == 0) {
            trArr.push('<tr id="' + g.ID + '_nodata" role="row" class="no_data">');
            trArr.push('<td colspan="' + g._showColumnLength + '" class="text-center">' + p.noDataHtml + '</td>');
            trArr.push('</tr>');
        }
        else {
            $.each(data, function (index, rowItem) {
                var hasChild = false, subData = [], appendAttr = '';
                var showDetail = false, detailContent = '';
                if (p.rowDetail) {
                    detailContent = _renderColumnDetailData.call(g, rowItem);
                    if (detailContent) {
                        showDetail = true;
                    }
                }
                var style = "";
                if (p.rowStyle) {
                    var opt = _renderRowStyle.call(g, rowItem);
                    if (!BCGrid.isEmptyObject(opt)) {
                        style = opt;
                    }
                }
                _localCurrentTempData.push(rowItem);
                if (p.tree) {
                    subData = BCGrid.isDefined(rowItem[g._treeChildKey]) ? rowItem[g._treeChildKey] : [];
                    if (subData.length > 0) {
                        hasChild = true;
                    }
                    if (depth > 0) {
                        appendAttr += 'data-parentrowindex="' + parentRowIndex + '"';
                        if (!p.tree.expand) appendAttr += ' style="display:none;"';
                    }
                    //
                }
               // trArr.push('<tr id="bcgrid_' + g.ID + '_list_' + g._rowIndex + '"' + style + ' role="row" data-rowindex="' + g._rowIndex + '"' + appendAttr + '>');
                trArr.push('<tr' + style + ' role="row" data-rowindex="' + g._rowIndex + '"' + appendAttr + '>');
                trArr.push(_preRenderColumn.call(g, showDetail));
                $.each(p.columns, function (index, item) {
                    trArr.push(_renderColumnData.call(g, item, rowItem, index, g._rowIndex, depth, hasChild));
                });
                trArr.push('</tr>');
                //detail
                if (showDetail) {
                    trArr.push(detailContent);
                }
                //tree
                g._rowIndex++;
                if (p.tree && hasChild) {
                    //
                    delete  _localCurrentTempData[_localCurrentTempData.length - 1][g._treeChildKey];
                    trArr.push(_displayListData.call(g, subData, depth + 1, g._rowIndex));
                    delete rowItem[g._treeChildKey];
                }


            });
        }
        return trArr.join('');
    };
    var _preRenderColumn = function (showDetail) {
        var g = this, p = this.options;
        var dataHtml = [];
        //detail
        if (p.rowDetail) {
            dataHtml.push('<td class="center" data-role="detail-ctrl">');
            if (showDetail) {
                var ctrlCss = p.rowDetail.expand ? 'row-detail-expanded' : 'row-detail-collapsed';
                if (p.rowDetail.ctrlStyle) {
                    switch (p.rowDetail.ctrlStyle) {
                        case  'sg':
                            ctrlCss = ctrlCss + '-sg';
                            break;
                        case  'pm':
                            ctrlCss = ctrlCss + '-pm';
                            break;
                    }
                }
                dataHtml.push('<span class="row-detail-expander ' + ctrlCss + '"></span>');
            }
            dataHtml.push('</td>');
        }
        if (p.showCheckbox) {
            var checked = '';
            dataHtml.push('<td class="center" data-role="checkbox"> <label class="pos-rel"><input type="checkbox" id="' + g.ID + '_checkbox_' + g._rowIndex + '" tag="bcgrid_checkbox" ' + checked + '/><span class="lbl"></span></label></td>');
        }
        if (p.showSerialNum) {
            var serial = 0;
            if ((p.pageSize + '').toLowerCase() == 'all') {
                serial = (g._rowIndex + 1);
            }
            else {
                serial = (g._rowIndex + 1) + (p.page - 1) * p.pageSize;
            }
            dataHtml.push('<td class="center" data-role="data">' + serial + '</td>');
        }
        return dataHtml.join('');
    };
    var _displayPage = function () {
        var g = this, p = this.options;
        if (!BCGrid.isEmptyObject(p.data) && p.enablePager) {
            var pageOpt = {
                pageSize: p.pageSize,                          //分页尺寸
                recordCount: p.data[p.total],
                pageSizeOptions: p.pageSizeOptions,          //范围
                currentPage: p.page,                             //当前页
                lang: p.lang,
                turnPageEvent: function (page, pageSize) {
                    p.page = page;
                    p.pageSize = pageSize;
                    g.loadData();
                }
            };
            pageOpt = $.extend(true, p.pagerOption || {}, pageOpt);
            if (BCGrid.isEmptyObject(p.pagerElement)) {
                p.pagerElement = $("<div></div>");
                p.pagerElement.insertAfter(g.grid);
            }
            if (p.pagerElement.length > 1) {
                pageOpt.turnPageEvent = function (page, pageSize) {
                    p.page = page;
                    p.pageSize = pageSize;
                    g.loadData(true);
                };
            }
            p.pagerElement.each(function () {
                g.pager = new Pager($(this), pageOpt);//执行分页
                g.pager.render();
            });

            //   g._initToolBtn();

        }
    };
    var _renderColumnDetailData = function (data) {
        var g = this, p = this.options;
        var detailOpt = p.rowDetail, dataRes = false;
        if (BCGrid.isFunction(detailOpt.content)) {
            dataRes = detailOpt.content.call(g, g._rowIndex, data);
        }
        else {
            dataRes = detailOpt.content;
        }
        if (BCGrid.isDefined(dataRes) && dataRes !== false) {
            var dataRes = '<td' + (BCGrid.isEmptyObject(detailOpt.align) == false ? ' class="' + detailOpt.align + '"' : '') + ' colspan="' + g._showColumnLength + '">' + dataRes + '</td>';
            dataRes = '<tr role="detail" data-forrowindex="' + g._rowIndex + '"' + (detailOpt.expand == false ? ' style="display:none;"' : '') + '>' + dataRes + '</tr>';
            return dataRes;
        }
        return false;
    };
    var _renderRowStyle = function (data) {
        var g = this, p = this.options;
        var rowStyleOpt = p.rowStyle, dataRes = false;
        if (BCGrid.isFunction(rowStyleOpt)) {
            dataRes = rowStyleOpt.call(g, g._rowIndex, data);
        }
        else {
            dataRes = rowStyleOpt;
        }
        if (BCGrid.isDefined(dataRes) && dataRes !== false) {
            if (BCGrid.isString(dataRes)) {
                return ' style="' + dataRes + '"';
            }
            var style = [];
            if (BCGrid.isDefined(dataRes.backgroudColor)) {
                style.push("background-color:" + dataRes.backgroudColor);
            }
            if (BCGrid.isDefined(dataRes.fontColor)) {
                style.push("color:" + dataRes.fontColor);
            }
            if (BCGrid.isDefined(dataRes.fontSize)) {
                style.push("font-size:" + dataRes.fontSize);
            }
            if (style.length > 0) {
                return ' style="' + style.join(";") + '"';
            }
            return null;
        }
        return false;
    };
    //单元格数据
    var _renderColumnData = function (column, data, colIndex, rowIndex, treeDepth, hasChild) {
        var g = this, p = this.options;
        var opt = column;
        var dataRes = '', noPadding = false;
        treeDepth = BCGrid.isDefined(treeDepth) ? treeDepth : 0;
        hasChild = BCGrid.isDefined(hasChild) ? hasChild : false;
        if (BCGrid.isString(opt.render)) {
            eval("opt.render=" + opt.render);
        }
        if (BCGrid.isFunction(opt.render)) {
            dataRes = opt.render.call(g, data, g._rowIndex);
            if (BCGrid.isObject(dataRes)) {
                if (BCGrid.isJqueryObject(dataRes)) {
                    dataRes = dataRes[0].outerHTML;
                }
                else {
                    dataRes = dataRes.outerHTML;
                }
            }
            if (!BCGrid.isDefined(dataRes)) {
                dataRes = "";
            }
        }
        else {
            switch (opt.type) {
                case 'grid':
                case 'table':
                    noPadding = true;
                    dataRes = _gridItem.call(g, rowIndex + 0, column, data, colIndex);
                    break;
                case 'dateTime':
                case 'date':
                    dataRes = _formatDate.call(g, data[column.name], opt.format);
                    break;
                case 'switch':
                case 'checkbox':
                    noPadding = true;
                    dataRes = _checkboxItem.call(g, rowIndex + 0, column, data, colIndex);
                    if (BCGrid.isUnDefined(opt.align)) {
                        opt.align = "center";
                    }
                    break;
                case 'textField':
                case 'inputField':
                    noPadding = true;
                    dataRes = _inputFieldItem.call(g, rowIndex + 0, column, data, colIndex);
                    if (BCGrid.isUnDefined(opt.align)) {
                        opt.align = "center";
                    }
                    break;
                case 'select':
                    noPadding = true;
                    dataRes = _selectItem.call(g, rowIndex + 0, column, data, colIndex);
                    if (BCGrid.isUnDefined(opt.align)) {
                        opt.align = "center";
                    }
                    break;
                default:
                    var val = BCGrid.isDefined(data[column.name]) ? data[column.name] + '' : '';
                    if (opt.maxLength && BCGrid.isNumber(opt.maxLength)) {
                        if (val.length > opt.maxLength) {
                            val = val.substr(0, opt.maxLength) + '...';
                        }
                    }
                    dataRes = _formatText.call(this, val, opt.format);
                    break;
            }
        }
        dataRes += "";
        //treeOpt
        if (p.tree && p.tree.displayID === column.id) {
            if (hasChild) {
                dataRes = ' <span class="tree-expander ' + (p.tree.expand ? 'tree-expander-expanded' : 'tree-expander-collapsed') + '"></span>' + dataRes;
            }
            if (treeDepth > 0) {
                var treeSpace = '';
                for (var i = 0; i < treeDepth; i++) {
                    treeSpace += '<span class="tree-indent"></span>';
                }
                if (!hasChild) treeSpace += '<span class="tree-indent"></span>';
                dataRes = treeSpace + dataRes;
            }

        }
        if (opt.enableEdit) {
            dataRes = '<span data-role="display">' + dataRes + '</span>';
        }
        dataRes = '<td data-role="' + opt.role + '" data-columnindex="' + colIndex + '">' + dataRes + '</td>';
        var $ret = $(dataRes);
        if (opt.align) {
            $ret.addClass(opt.align);
        }
        if (opt.vAlign) {
            $ret.addClass(opt.vAlign);
        }
        if (noPadding) {
            $ret.addClass("none-padding");
        }
        if (opt.hide) {
            $ret.hide();
        }
        if (opt.allowNewline) {
            $ret.addClass("allow-newline");
        }
        //rowspan
        if (!BCGrid.isEmptyObject(p.rowSpanKeys) && BCGrid.inArray(p.rowSpanKeys, opt.name)) {
            if(data['_spanCount'] > 0){
                $ret.attr("rowspan",data['_spanCount']+1);
            }
            else if(data['_isroot'] == false){
               return "";
            }
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
    var _gridItem = function (rowIndex, column, data, colIndex) {
        var g = this, p = g.options;
        if (BCGrid.isUnDefined(column.grid)) {
            return "";
        }
        column.grid.dataName = column.grid.dataName || "data";
        var tableData = BCGrid.isUnDefined(data[column.grid.dataName]) ? [] : data[column.grid.dataName];
        var subTabelDom = $("<div></div>");
        //var subGrid =
        var subOpt = {
            enableCsrf: false,
            lang: p.lang,
            localData: tableData,
            autoLoadData: true,
            showLoading: false,               //是否显示加载状态提示
            loadingTip: 'Loading',//加载提示信息
            loadingStyle: 3,//加载样式
            enablePager: false,
            columns: [],                          //数据源
            dataSource: 'local',                     //数据源：本地(local)或(server),本地是将读取p.data。不需要配置，取决于设置了data或是url
            cssClass: 'bc-table-sub',                    //类名
            showCheckbox: false,                         //是否显示复选框
            showSerialNum: false,    //是否显示序号
            showBorder: true, //是否显示边框
            showStripe: false,//是否显示条纹间隔效果
            showHover: false,//是否显示hover效果
            showHead: false,
            showTitle: false,
            noDataHtml: p.noDataHtml,
            enableSelectRow: false, //是否可选择行
            enableMultiSelectRow: false,//是否允许行多选
            onCheckClick: null,                       //选择事件(复选框)
            onCheckAllClick: null,                  //选择点击数据（全选/全不选）
            onError: null,                         //错误事件
            onCompleted: null,                          //加载完函数
            onLoadData: null,                       //加载数据前事件
            onLoadedData: null,                  //加载完数据事件
            onSelectedRow: null, //选择行事件
            onRowClick: null, //选择行事件
            onTreeExpandOrCollapse: null,//树展开/收缩事件
            onDataChange: null, //数据改变事件
            onDataSave: null,
            tree: null
        };
        var subOption = $.extend(true, {}, subOpt, column.grid);
        var subGrid = BCGrid.create(subTabelDom, subOption);
        return subTabelDom.prop('outerHTML');
    };
    var _checkboxItem = function (rowIndex, column, data, colIndex) {
        var p = this.options;
        var elopt = {name: column.name, onValue: 1, offValue: 0, onText: 'ON', offText: 'OFF'};
        elopt.onText = BCGrid.getLangText(p.lang, elopt.onText);
        elopt.offText = BCGrid.getLangText(p.lang, elopt.offText);
        if (BCGrid.isDefined(column.elOpt)) {
            elopt = $.extend({}, elopt, column.elOpt);
        }
        var $item = $('<label class="checkbox-switch"></label>');
        var $check = $('<input type="checkbox"  class="column-checkbox" data-colname="' + column.name + '" data-rowindex="' + rowIndex + '" data-colindex="' + colIndex + '" data-onvalue="' + elopt.onValue + '" data-offvalue="' + elopt.offValue + '" data-ontext="' + elopt.onText + '" data-offtext="' + elopt.offText + '" />');
        $check.attr('name', elopt.name);
        $check.attr('value', elopt.value);
        var emStr = '<em>';
        if (column.name && (BCGrid.isDefined(data[column.name]) ? data[column.name] : '') == elopt.onValue) {
            $check.attr('checked', 'checked');
            $item.addClass("checkbox-switch-on");
            emStr = emStr + elopt.onText;
        }
        else {
            emStr = emStr + elopt.offText;
        }
        emStr = emStr + '</em>';
        $item.append($check);
        $item.append(emStr);
        $item.append('<i></i>');
        return $item.prop('outerHTML');
    };
    var _selectItem = function (rowIndex, column, data, colIndex) {
        var opt = {name: column.name, itemsKey: 'items'};
        if (BCGrid.isDefined(column.elOpt)) {
            opt = $.extend(true, {}, opt, column.elOpt);
        }
        var $item = $('<select class="column-select"  data-colname="' + column.name + '" data-rowindex="' + rowIndex + '" data-colindex="' + colIndex + '" ></select>');
        $item.attr('name', opt.name);
        var items = BCGrid.isDefined(data[opt.itemsKey]) ? data[opt.itemsKey] : [];
        $.each(items, function (i, item) {
            //
            if (column.name && (BCGrid.isDefined(data[column.name]) ? data[column.name] : '') == item.value) {
                $item.append('<option value="' + item.value + '" selected="selected">' + item.text + '</option>');
            }
            else {
                $item.append('<option value="' + item.value + '">' + item.text + '</option>');
            }

        });
        return $item.prop('outerHTML');
    };
    var _inputFieldItem = function (rowIndex, column, data, colIndex) {
        var opt = {name: column.name};
        if (BCGrid.isDefined(column.elOpt)) {
            opt = $.extend({}, opt, column.elOpt);
        }
        var $item = $('<input class="column-text" data-colname="' + column.name + '" data-rowindex="' + rowIndex + '" data-colindex="' + colIndex + '" />');
        $item.attr('name', opt.name);
        $item.attr('value', BCGrid.isDefined(data[column.name]) ? data[column.name] : '');
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
            };
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
    var _setData = function (data) {
        var g = this, p = this.options;
        p.data[p.rows] = data;
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
    var _colResize = function () {
        var g = this, p = this.options;
        if(p.colResize && BCGrid.isObject(p.colResize)){
            BCGrid.loadJS("bc_plugin_colResizable", "plugin/colResizable.js", function () {
                var colResizeOpt = p.colResize;
                $("#"+g.ID+"").colResizable(colResizeOpt);
            });
        }
    };
    var _bindEvent = function () {
        var g = this, p = this.options;
        // var rowsData = p.dataSource == 'local' ? _localCurrentTempData : p.data[p.rows];
        var rowsData = g.getData();
        //全选
        $('input[type="checkbox"][tag="bcgrid_checkbox"]', g.gridHead).unbind();
        $('input[type="checkbox"][tag="bcgrid_checkbox"]', g.gridHead).on('click', function (e) {
            var isChecked = false;
            if ($(this).is(':checked')) {
                isChecked = true;
                $(":checkbox[tag='bcgrid_checkbox']", g.gridContent).prop('checked', true);
            }
            else {
                isChecked = false;
                $(":checkbox[tag='bcgrid_checkbox']", g.gridContent).prop('checked', false);
            }
            if (p.onCheckAllClick && BCGrid.isFunction(p.onCheckAllClick)) {
                p.onCheckAllClick.call(g, isChecked);
            }
        });
        //排序
        $('th[data-col]', g.gridHead).unbind();
        $('th[data-col]', g.gridHead).on('click', function () {
            var self = $(this);
            var columnIndex = parseInt(self.data("columnindex"));
            if (p.columns[columnIndex].enableSort) {
                var sortSpan = $("span.sort", self);
                var name = self.data('col') || '';
                var order = sortSpan.attr('order') || 'asc';
                if (BCGrid.isDefined(name)) {
                    //
                    $('span.sort', g.gridHead).removeAttr("order");
                    if (order == 'asc') {
                        sortSpan.attr('order', 'desc');
                    } else {
                        sortSpan.attr('order', 'asc');
                    }
                    p.sortName = name;
                    p.sortOrder = order;
                    g.loadData();
                }

            }
        });
        //checkbox
        $('input[type="checkbox"][tag="bcgrid_checkbox"]', g.gridContent).unbind();
        $('input[type="checkbox"][tag="bcgrid_checkbox"]', g.gridContent).on('click', function (e) {
            var isChecked = false, self = $(this);
            var tr = self.closest('tr');
            if (self.is(':checked')) {
                isChecked = true;
                tr.addClass("active");
            }
            else {
                tr.removeClass("active");
            }
            var rowIndex = parseInt(tr.data('rowindex'));
            if (p.onCheckClick && BCGrid.isFunction(p.onCheckClick)) {
                p.onCheckClick.call(g, rowIndex, isChecked, rowsData[rowIndex]);
            }
            //
            e.stopPropagation();
        });
        $('tr[role="row"]:not(.no_data)', g.gridContent).unbind();
        //行单击
        $('tr[role="row"]:not(.no_data)', g.gridContent).on("click", function (e) {
            clearTimeout(_timeFn);
            var timeSpan = (p.onRowDbClick && BCGrid.isFunction(p.onRowDbClick)) ? 200 : 0;
            var self = $(this);
            _timeFn = setTimeout(function () {
                if (_isEditTarget(e.target)) {
                    return;
                }
                var rowIndex = parseInt(self.data('rowindex'));
                if (p.enableSelectRow) {
                    var isSelected = false;
                    if (self.hasClass("selected")) {
                        isSelected = false;
                        self.removeClass("selected");
                    } else {
                        isSelected = true;
                        self.addClass("selected");
                        if (p.enableMultiSelectRow == false) {
                            self.siblings().removeClass("selected");
                        }
                    }
                    if (p.onSelectedRow && isSelected && BCGrid.isFunction(p.onSelectedRow)) {
                        //
                        p.onSelectedRow.call(g, rowIndex, rowsData[rowIndex]);
                    }
                }
                if (p.onRowClick && BCGrid.isFunction(p.onRowClick)) {
                    p.onRowClick.call(g, rowIndex, rowsData[rowIndex]);
                }
            }, timeSpan);
        });
        //行双击
        $('tr[role="row"]:not(.no_data)', g.gridContent).on("dblclick", function (e) {
            if (p.onRowDbClick && BCGrid.isFunction(p.onRowDbClick)) {
                clearTimeout(_timeFn);
                if (_isEditTarget(e.target)) {
                    return;
                }
                var self = $(this);
                var rowIndex = parseInt(self.data('rowindex'));
                p.onRowDbClick.call(g, rowIndex, rowsData[rowIndex]);
            }
        });
        //detail
        $('span.row-detail-expander', g.gridContent).unbind();
        if (p.rowDetail) {
            $('span.row-detail-expander', g.gridContent).on("click", function (e) {
                var self = $(this);
                var row = self.closest("tr");
                var rowIndex = row.data("rowindex");
                var isExpand = _toggleDetail.call(g, row);
                if (p.onRowDetailExpandOrCollapse && BCGrid.isFunction(p.onRowDetailExpandOrCollapse)) {
                    p.onRowDetailExpandOrCollapse.call(g, isExpand, rowIndex, rowsData[rowIndex]);
                }
                // e.stopPropagation();
            });

        }
        //tree
        $('span.tree-expander', g.gridContent).unbind();
        if (p.tree) {
            $('span.tree-expander', g.gridContent).on("click", function (e) {
                var self = $(this);
                var row = self.closest("tr");
                var rowIndex = row.data("rowindex");
                var isExpand = _toggleTree.call(g, row);
                if (p.onTreeExpandOrCollapse && BCGrid.isFunction(p.onTreeExpandOrCollapse)) {
                    p.onTreeExpandOrCollapse.call(g, isExpand, rowIndex, rowsData[rowIndex]);
                }
                //  e.stopPropagation();
            });

        }
        //

        _bindDataChangeEvent.call(g);
        _lastHandler.call(g);

    };
    var _bindDataChangeEvent = function () {
        var g = this, p = this.options;
        // var rowsData = p.dataSource == 'local' ? _localCurrentTempData : p.data[p.rows];
        var rowsData = g.getData();
        $('input.column-text[data-rowindex],select.column-select[data-rowindex]', g.gridContent).unbind();
        $('input.column-text[data-rowindex],select.column-select[data-rowindex]', g.gridContent).on("change", function () {
            var self = $(this);
            var name = self.attr("name");
            var colName = self.data("colname");
            var rowIndex = parseInt(self.data('rowindex'));
            var colIndex = parseInt(self.data('colindex'));
            var value = self.val();
            rowsData[rowIndex][colName] = value;
            //
            var changeTarget = '';
            if (self.is("select")) {
                changeTarget = "selectChange";
                if (p.onSelectChange && BCGrid.isFunction(p.onSelectChange)) {
                    p.onSelectChange.call(g, rowIndex, name, value, rowsData[rowIndex]);
                }
            }
            if (self.is("input")) {
                changeTarget = "textFieldChange";
                if (p.onTextFieldChange && BCGrid.isFunction(p.onTextFieldChange)) {
                    p.onTextFieldChange.call(g, rowIndex, name, value, rowsData[rowIndex]);
                }
            }
            //内容改变
            if (p.onDataChange && BCGrid.isFunction(p.onDataChange)) {
                p.onDataChange.call(g, name, value, rowIndex, rowsData[rowIndex], colIndex, changeTarget);
            }
        });
        $('input.column-checkbox[data-rowindex]', g.gridContent).unbind();
        $('input.column-checkbox[data-rowindex]', g.gridContent).on("click", function () {
            var self = $(this);
            var name = self.attr("name");
            var colName = self.data("colname");
            var rowIndex = parseInt(self.data('rowindex'));
            var colIndex = parseInt(self.data('colindex'));
            var value = "";
            var label = self.parent("label.checkbox-switch");
            if (self.is(":checked")) {
                value = self.data("onvalue");
                label.addClass("checkbox-switch-on");
                $("em", label).html(self.data("ontext"));
            }
            else {
                value = self.data("offvalue");
                label.removeClass("checkbox-switch-on");
                $("em", label).html(self.data("offtext"));
            }
            rowsData[rowIndex][colName] = value;
            if (p.onSwitchChange && BCGrid.isFunction(p.onSwitchChange)) {
                p.onSwitchChange.call(g, rowIndex, self.is(":checked"), name, value, rowsData[rowIndex]);
            }
            //内容改变
            if (p.onDataChange && BCGrid.isFunction(p.onDataChange)) {
                p.onDataChange.call(g, rowIndex, name, value, rowsData[rowIndex], colIndex, "switchChange");
            }
        });

    };
    var _toggleDetail = function (row) {
        var g = this, p = g.options, isExpand = false;
        var rowDetailOpt = p.rowDetail;
        var rowIndex = row.data("rowindex");
        var spanTg = $(".row-detail-expander", row);
        var collapsedCssBase = 'row-detail-collapsed';
        var expandedCssBase = 'row-detail-expanded';
        if (!BCGrid.isEmptyObject(rowDetailOpt.ctrlStyle) && (rowDetailOpt.ctrlStyle === "sg" || rowDetailOpt.ctrlStyle === "pm")) {
            collapsedCssBase = collapsedCssBase + "-" + rowDetailOpt.ctrlStyle;
            expandedCssBase = expandedCssBase + "-" + rowDetailOpt.ctrlStyle;
        }
        if (spanTg.hasClass(collapsedCssBase)) {
            spanTg.removeClass(collapsedCssBase).addClass(expandedCssBase);
            isExpand = true;
        }
        else {
            spanTg.removeClass(expandedCssBase).addClass(collapsedCssBase);
            isExpand = false;
        }
        var nextDetailRow = row.next('tr[data-forrowindex="' + rowIndex + '"]');
        isExpand ? nextDetailRow.show() : nextDetailRow.hide();
        return isExpand;
    };
    var _toggleTree = function (row) {
        var g = this, p = g.options, isExpand = false;
        var spanTg = $(".tree-expander", row);
        if (spanTg.hasClass("tree-expander-collapsed")) {
            spanTg.removeClass("tree-expander-collapsed").addClass("tree-expander-expanded");
            isExpand = true;
        }
        else {
            spanTg.removeClass("tree-expander-expanded").addClass("tree-expander-collapsed");
            isExpand = false;
        }
        _toggleTreeChild.call(g, row, isExpand);
        return isExpand;
    };
    var _toggleTreeChild = function (row, isExpand) {
        var g = this, p = g.options;
        var rowIndex = row.data("rowindex");
        var nextChildRowArr = row.nextAll('tr[data-parentrowindex="' + rowIndex + '"]');
        nextChildRowArr.each(function () {
            var self = $(this);
            var spanTg = $(".tree-expander", self);
            var hasChild = spanTg.hasClass("tree-expander");
            isExpand ? self.show() : self.hide();
            if (hasChild) {
                if (isExpand) {
                    if (spanTg.hasClass("tree-expander-collapsed")) {
                        _toggleTreeChild.call(g, self, false);
                    }
                    else {
                        _toggleTreeChild.call(g, self, true);
                    }
                } else {
                    _toggleTreeChild.call(g, self, false);
                }

            }
        });
    };
    var _error = function (message) {
        if (this.options.onError) {
            this.options.onError.call(this, message);
        }
        else {
            throw message;
        }
    };
    var _isEditTarget = function (target) {
        if (!BCGrid.isDefined(target)) return false;
        var $target = $(target);
        if ($target.is("span.tree-expander")) return true;
        if ($target.is("label.checkbox-switch")) return true;
        if ($target.is("label.checkbox-switch em")) return true;
        if ($target.is("label.checkbox-switch i")) return true;
        if ($target.is("span.row-detail-expander")) return true;
        if ($target.is("button")) return true;
        if ($target.is("input")) return true;
        if ($target.is("select")) return true;
        if ($target.is("textarea")) return true;
        if ($target.is("a")) return true;
        if ($target.is("a i")) return true;
        return false;
    };
    /**
     * 最后出来，完成所有执行后加载完后的处理
     * @private
     */
    var _lastHandler  =function () {
        _colResize.call(this);
    };
    /**page**/
    var Pager = function (ele, opt) {
        this.pageWrap = this.element = $(ele);
        this.pageCount = 0;
        this.toolButtons = [];
        this.defaults = {
            pageSize: 40,                          //分页尺寸
            recordCount: 0,
            lang: 'en',
            showFirst: true,
            showLast: true,
            showPrev: true,                             //
            showNext: true,                            //初始化数据
            showWhenever: true,                         //是否永久显示分页
            showPageSizeOpt: true,
            currentPage: 1,                                //当前页
            pageSizeOptions: [10, 20, 30, 40, 50],  //可选择设定的每页结果数
            firstText: 'First',                          //首页
            lastText: 'Last',                         //末页
            prevText: 'Previous',                          //上一页
            nextText: 'Next',                          //下一页
            turnPageEvent: null,
            ellipseText: "...",
            disabledCssClass: 'disabled',
            ellipseCssClass: 'ellipsis',
            firstCssClass: 'first-page',
            lastCssClass: 'last-page',
            prevCssClass: 'prev-page',
            nextCssClass: 'next-page',
            itemCssClass: '',
            itemCurrCssClass: 'current',
            toolCssClass: 'page-tool',
            infoCssClass: 'page-info',
            linkCssClass: 'page-link',
            optCssClass: 'page-size',
            wrapCssClass: 'bc-page',
            /* pageInfoTpl: '当前{currentPage}/{pageCount}页，每页{pageSize}条,共{recordCount}条记录',*/
            pageInfoTpl: 'Page {currentPage} of {pageCount},{pageSize} records per page,total {recordCount} records',
            buttons: []
        };
        this.options = $.extend({}, true, this.defaults, opt);
    };
    //pager
    Pager.prototype = {
        render: function () {
            this._init();
            return this;
        },
        //初始化
        _init: function () {
            var p = this.options;
            if (!this.pageWrap.hasClass(p.wrapCssClass)) {
                this.pageWrap.addClass(p.wrapCssClass);
            }
            if (isNaN(p.pageSize)) {
                this.pageCount = 1;
            }
            else {
                this.pageCount = Math.ceil(p.recordCount / p.pageSize);
            }
            if (this.pageCount == 0) {
                this.pageCount = 1;
            }
            this._builder();

        },
        _builder: function () {
            var g = this;
            var p = this.options;
            this.pageInfoWrap = $('<span> </span>');
            this.pageOptWrap = $('<span> </span>');
            this.pageToolWrap = $('<span></span>');
            this.pageLinkWrap = $('<span></span>');
            this.pageWrap.empty();
            this.pageInfoWrap.addClass(p.infoCssClass);
            this.pageOptWrap.addClass(p.optCssClass);
            this.pageLinkWrap.addClass(p.linkCssClass);
            this.pageWrap.append(this.pageInfoWrap);
            this.pageWrap.append(this.pageLinkWrap);

            // this.toolWrap.wrap('<div class=""><div class="btn-toolbar"></div></div>');
            // this.pageInfoWrap.wrap('<div class=""></div>');
            // this.pageBtnWrap.wrap(' <div class=""></div>');
            if (p.showPageSizeOpt) {
                this.pageWrap.append(this.pageOptWrap);
                this._getPageOpt();
            }
            this._getPageInfo();
            this._getPageContent();
            this._bindEvent();
            this._getPageTools();
        },
        _getPageInfo: function () {
            var g = this, p = this.options;
            var info = BCGrid.getLangText(p.lang, p.pageInfoTpl).replace(/\{currentPage\}/g, p.currentPage);
            info = info.replace(/\{pageCount\}/g, g.pageCount);
            info = info.replace(/\{recordCount\}/g, p.recordCount);
            info = info.replace(/\{pageSize\}/g, p.pageSize);
            this.pageInfoWrap.html(info);
        },
        _getPageContent: function () {
            var html = '';
            var g = this, p = this.options;
            if (p.showFirst) {
                html += '<a href="javascript:;" class="' + p.firstCssClass + '" >' + BCGrid.getLangText(p.lang, p.firstText) + '</a>';
            }
            if (p.showPrev) {
                html += '<a href="javascript:;" class="' + p.prevCssClass + '">' + BCGrid.getLangText(p.lang, p.prevText) + '</a>';
            }
            if (g.pageCount > 6) {
                html += '<a href="javascript:;" data-page="1" >1</a>';
                if (p.currentPage <= 2) {
                    html += '<a href="javascript:;" data-page="2">2</a>';
                    html += '<a href="javascript:;" data-page="3">3</a></li>';
                    html += '<span class="' + p.ellipseCssClass + '">' + p.ellipseText + '</span>';
                } else if (p.currentPage > 2 && p.currentPage <= g.pageCount - 2) {
                    html += '<span class="' + p.ellipseCssClass + '">' + p.ellipseText + '</span>';
                    html += '<a  href="javascript:;" data-page="' + (p.currentPage - 1) + '">' + (p.currentPage - 1) + '</a>';
                    html += '<a  href="javascript:;" data-page="' + p.currentPage + '">' + p.currentPage + '</a>';
                    html += '<a  href="javascript:;" data-page="' + (p.currentPage + 1) + '">' + (p.currentPage + 1) + '</a>';
                    html += '<span class="' + p.ellipseCssClass + '">' + p.ellipseText + '</span>';
                } else {
                    html += '<span class="' + p.ellipseCssClass + '">' + p.ellipseText + '</span>';
                    for (var i = g.pageCount - 2; i < g.pageCount; i++) {
                        html += '<a  href="javascript:;" data-page="' + i + '">' + i + '</a>';
                    }
                }
                html += '<a href="javascript:void(0);" data-page="' + g.pageCount + '">' + g.pageCount + '</a>  ';
            } else {
                for (var i = 1; i <= g.pageCount; i++) {
                    html += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>';
                }
            }
            if (p.showNext) {
                html += '<a href="javascript:;" class="' + p.nextCssClass + '" >' + BCGrid.getLangText(p.lang, p.nextText) + '</a>';
            }
            if (p.showLast) {
                html += '<a href="javascript:;" class="' + p.lastCssClass + '" >' + BCGrid.getLangText(p.lang, p.lastText) + '</a>';
            }
            this.pageLinkWrap.html(html);
            if (p.currentPage == 1) {
                $('.' + p.firstCssClass, g.pageLinkWrap).addClass(p.disabledCssClass);
                $('.' + p.prevCssClass, g.pageLinkWrap).addClass(p.disabledCssClass);
            }
            if (p.currentPage == g.pageCount) {
                $('.' + p.lastCssClass, g.pageLinkWrap).addClass(p.disabledCssClass);
                $('.' + p.nextCssClass, g.pageLinkWrap).addClass(p.disabledCssClass);
            }
            this.pageLinkWrap.find('a[data-page="' + p.currentPage + '"]').addClass(p.itemCurrCssClass).siblings().removeClass(p.itemCurrCssClass);
        },
        _getPageOpt: function () {
            var g = this, p = this.options;
            //select
            var sel = $('<select></select>');
            var str = '';
            if (p.pageSizeOptions.length > 0) {
                for (var i = 0; i < p.pageSizeOptions.length; i++) {
                    if (BCGrid.isNumber(p.pageSizeOptions[i])) {
                        str += '<option value="' + p.pageSizeOptions[i] + '">' + p.pageSizeOptions[i] + '</option>';
                    }
                    else if ((p.pageSizeOptions[i] + '').toLowerCase() == 'all') {
                        str += '<option value="all">All</option>';
                    }
                }
                sel.html(str);
                sel.val(p.pageSize);
                //go
                //var input = $('<input value="" placeholder="页码" title="跳转页码"/><a class="gobt">跳转</a>');
                this.pageOptWrap.html("");
                this.pageOptWrap.append(BCGrid.getLangText(p.lang, "Per page"));
                this.pageOptWrap.append(sel);
                this.pageOptWrap.append(BCGrid.getLangText(p.lang, "Records"));
                //this.pageOptWrap.append(input);
                //事件
                $('select', this.pageOptWrap).on('change', function () {
                    p.pageSize = $(this).val();
                    p.currentPage = 1;
                    g.render();
                    g.goPage();
                });
                /*   $('input', this.pageOptWrap).val(p.currentPage);
                 $('input', this.pageOptWrap).click(function () {
                 $(this).select();
                 }).keydown(function (e) {
                 if (e.keyCode == 13) {
                 var current = parseInt($(this).val()) || 1;
                 g.goPage(current);
                 }
                 });*/
                /*$('a', this.pageOptWrap).click(function () {
                 //   if($(this))
                 var current = parseInt($(this).val()) || 1;
                 g.goPage(current);
                 });*/
            }
        },
        _getPageTools: function () {
            var self = this, p = this.options;
            self.toolButtons = [];
            $.each(p.buttons, function (index, item) {
                self._addToolsButtonItem(item);
            });
        },
        _addToolsButtonItem: function (item) {

            // self.toolButtons.push(btn);
        },
        _bindEvent: function () {
            var g = this, p = this.options;
            g.pageLinkWrap.on('click', 'a', function (e) {
                if ($(this).hasClass(p.disabledCssClass) || $(this).hasClass(p.itemCurrCssClass)) {
                    return false;
                }
                if ($(this).hasClass(p.firstCssClass)) {
                    p.currentPage = 1;
                }
                else if ($(this).hasClass(p.prevCssClass)) {
                    p.currentPage = Math.max(1, p.currentPage - 1);
                }
                else if ($(this).hasClass(p.nextCssClass)) {
                    p.currentPage = Math.min(g.pageCount, p.currentPage + 1);
                }
                else if ($(this).hasClass(p.lastCssClass)) {
                    p.currentPage = g.pageCount;
                }
                else if ($(this).data('page')) {
                    p.currentPage = parseInt($(this).data('page'));
                }
                g.goPage();
            });
        },
        goPage: function (page) {
            var g = this, p = this.options;
            p.currentPage = page || p.currentPage;
            p.currentPage = Math.max(1, p.currentPage);
            p.currentPage = Math.min(p.currentPage, g.pageCount);
            g._getPageInfo();
            g._getPageContent();
            if (p.showPageSizeOpt) {
                g._getPageOpt();
            }
            if (BCGrid.isFunction(p.turnPageEvent)) {
                p.turnPageEvent.call(g, p.currentPage, p.pageSize);
            }
        },
        addToolButton: function (btnArr) {
            /*     var self = this;
             var p = this.options;
             $.each(btnArr, function (index, item) {
             p.buttons.push(item);
             self._addToolsButtonItem(item);
             });*/

        }

    };
    //
    return BCGrid;
}));

//
