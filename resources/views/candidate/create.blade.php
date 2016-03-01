@extends('layout.header')
@section('title', '新增侯选人')
@section('content')
    <div class="wrap bg-white padding-15 margin-top-20 margin-bottom-50 bordered border-color-orange" ng-controller="candidateController">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/candidate/">人选管理</a></li>
                    <li>新增侯选人</li>
                </ul>
            </div>
            <div class="row">
                <form id="form" name="personForm" action="" class="form form-horizontal" onsubmit="return false">
                    <blockquote>
                        <p>基本信息</p>
                    </blockquote>
                    <div id="basicContainer">
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 姓名</label>
                                <div class="col-xs-8">
                                    <input type="text" ng-model="person.name" class="form-control" required />
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 编号</label>
                                <div class="col-xs-8">
                                    <div class="input-group">
                                        <input type="text" ng-model="person.real_id" readonly class="form-control" required />
                                        <span class="input-group-btn"><button class="btn btn-default" ng-click="operator.getId()" ng-disabled="person.real_id">生成ID</button></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 当前职位</label>
                                <div class="col-xs-8">
                                    <input type="text" ng-model="person.job" class="form-control" required />
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 性别</label>
                                <div class="col-xs-8">
                                    <div class="col-xs-4 no-padding">
                                        <label class="form-control-static">
                                            <input type="radio" ng-model="person.sex" value="男">
                                            <span class="text">男</span>
                                        </label>
                                    </div>
                                    <div class="col-xs-4 no-padding">
                                        <label class="form-control-static">
                                            <input type="radio" ng-model="person.sex" value="女">
                                            <span class="text">女</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 年龄</label>
                                <div class="col-xs-8">
                                    <div class="input-group">
                                        <input kendo-numeric-text-box k-options="kendoConfig.numericTextBox" type="text" ng-model="person.age" class="form-control" numeric>
                                        <span class="input-group-addon">岁</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 工作年限</label>
                                <div class="col-xs-8">
                                    <div class="input-group">
                                        <input kendo-numeric-text-box k-options="kendoConfig.numericTextBox" type="text" ng-model="person.year" class="form-control" required>
                                        <span class="input-group-addon">年</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">电子邮箱</label>
                                <div class="col-xs-8">
                                    <input type="text" ng-model="person.email" class="form-control" value="" />
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 联系电话</label>
                                <div class="col-xs-8">
                                    <input type="text" ng-model="person.tel" class="form-control" value="" required />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4"><span class="red">*</span> 学历</label>
                                <div class="col-xs-8">
                                    <select kendo-drop-down-list ng-model="person.degree" class="form-control size-full">
                                        <option value="">-请选择-</option>
                                        <option value="高中">高中</option>
                                        <option value="大专">大专</option>
                                        <option value="本科">本科</option>
                                        <option value="研究生">研究生</option>
                                        <option value="硕士">硕士</option>
                                        <option value="博士">博士</option>
                                        <option value="博士后">博士后</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">婚姻状态</label>
                                <div class="col-xs-8">
                                    <div class="col-xs-4 no-padding">
                                        <label class="form-control-static">
                                            <input type="radio" ng-model="person.marry" value="单身">
                                            <span class="text">单身</span>
                                        </label>
                                    </div>
                                    <div class="col-xs-4 no-padding">
                                        <label class="form-control-static">
                                            <input type="radio" ng-model="person.marry" value="已婚">
                                            <span class="text">已婚</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">居住地</label>
                                <div class="col-xs-8">
                                    <div class="col-xs-6 no-padding-left">
                                        <select kendo-drop-down-list ng-model="person.location.p" name="location-province" k-data-source="locationData.p" k-data-text-field="'name'" k-data-value-field="'name'" k-change="locationData.change" class="form-control size-full">
                                            <option value="-1" disabled>-- 请选择 --</option>
                                        </select>
                                    </div>
                                    <div class="col-xs-6 no-padding-right">
                                        <select kendo-drop-down-list ng-model="person.location.c" name="location-city" k-data-source="locationData.c" k-data-text-field="'name'" k-data-value-field="'name'" class="form-control size-full">

                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">户籍所在地</label>
                                <div class="col-xs-8">
                                    <div class="col-xs-6 no-padding-left">
                                        <select kendo-drop-down-list ng-model="person.belong.p" name="belong-province" k-data-source="belongData.p" k-data-text-field="'name'" k-data-value-field="'name'" k-change="belongData.change" class="form-control size-full">
                                            <option value="-1" disabled>-- 请选择 --</option>
                                        </select>
                                    </div>
                                    <div class="col-xs-6 no-padding-right">
                                        <select kendo-drop-down-list ng-model="person.belong.c" name="belong-city" k-data-source="belongData.c" k-data-text-field="'name'" k-data-value-field="'name'" class="form-control size-full">

                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <blockquote>
                        <p>工作经历 <small class="red inline-block">(必填)</small></p>
                    </blockquote>
                    <div id="companyContainer">
                        <div class="company-group pos-rel" ng-repeat="company in person.companys track by $index">
                            <a class="btn btn-danger btn-sm pos-abs pointer z-index-10" title="删除" ng-click="operator.delWorkGroup($index)"><i class="fa fa-trash-o"></i></a>
                            <div class="form-group">
                                <label class="control-label col-xs-2"><span class="red">*</span> 公司名称</label>
                                <div class="col-xs-10">
                                    <input kendo-auto-complete k-options="kendoConfig.companyAutoComplete" type="text" ng-model="company.company_name" class="form-control size-full" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 任职时间</label>
                                    <div class="col-xs-8">
                                        <div class="col-xs-5 no-padding">
                                            <input kendo-date-picker k-options="kendoConfig.monthPicker" type="text" ng-model="company.start_time" class="form-control size-full" required>
                                        </div>
                                        <div class="col-xs-2 text-center form-control-static">至</div>
                                        <div class="col-xs-5 no-padding">
                                            <input kendo-date-picker k-options="kendoConfig.monthPicker" type="text" ng-model="company.end_time" class="form-control size-full" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4">岗位年薪</label>
                                    <div class="col-xs-8">
                                        <select kendo-drop-down-list ng-model="company.salary" class="form-control size-full">
                                            <option value="">保密</option>
                                            <option value="">10万以内</option>
                                            <option value="">10-20万</option>
                                            <option value="">20-30万</option>
                                            <option value="">30-40万</option>
                                            <option value="">40-50万</option>
                                            <option value="">50万以上</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 职位名称</label>
                                    <div class="col-xs-8">
                                        <input type="text" ng-model="company.job" class="form-control" value="" required/>
                                    </div>
                                </div>
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 所属部门</label>
                                    <div class="col-xs-8">
                                        <input type="text" ng-model="company.depart" class="form-control" value="" required />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4">汇报对象</label>
                                    <div class="col-xs-8">
                                        <input type="text" ng-model="company.master" class="form-control" value="" />
                                    </div>
                                </div>
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4">下属人数</label>
                                    <div class="col-xs-8">
                                        <input type="text" ng-model="company.slave" class="form-control" value="" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-xs-2">职责及业绩</label>
                                <div class="col-xs-10">
                                    <textarea ng-model="company.description" rows="6" class="form-control"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 col-xs-offset-2 margin-top-10">
                            <a class="btn btn-success btn-sm size-small" ng-click="operator.addWorkGroup()"><i class="fa fa-plus"></i> 添加工作经历</a>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <blockquote>
                        <p>教育经历 <small class="red inline-block">(必填)</small></p>
                    </blockquote>
                    <div id="schoolContainer">
                        <div class="school-group pos-rel" ng-repeat="school in person.schools track by $index">
                            <a class="btn btn-danger btn-sm pos-abs pointer z-index-10" title="删除" ng-click="operator.delSchoolGroup($index)"><i class="fa fa-trash-o"></i></a>
                            <div class="form-group">
                                <label class="control-label col-xs-2"><span class="red">*</span> 院校名称</label>
                                <div class="col-xs-10">
                                    <input kendo-auto-complete k-options="kendoConfig.schoolAutoComplete" type="text" ng-model="school.school_name" class="form-control size-full" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 就读时间</label>
                                    <div class="col-xs-8">
                                        <div class="col-xs-5 no-padding">
                                            <input kendo-date-picker k-options="kendoConfig.monthPicker" type="text" ng-model="school.start_time" class="form-control size-full date" required>
                                        </div>
                                        <div class="col-xs-2 text-center form-control-static">至</div>
                                        <div class="col-xs-5 no-padding">
                                            <input kendo-date-picker k-options="kendoConfig.monthPicker" type="text" ng-model="school.end_time" class="form-control size-full date" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 学历</label>
                                    <div class="col-xs-8">
                                        <select kendo-drop-down-list ng-model="school.degree" class="form-control size-full" required>
                                            <option value="">-请选择-</option>
                                            <option value="中专">中专</option>
                                            <option value="大专">大专</option>
                                            <option value="本科">本科</option>
                                            <option value="研究生">研究生</option>
                                            <option value="硕士">硕士</option>
                                            <option value="博士">博士</option>
                                            <option value="博士后">博士后</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 专业名称</label>
                                    <div class="col-xs-8">
                                        <input type="text" ng-model="school.profession" class="form-control" value="" required />
                                    </div>
                                </div>
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4">是否统招</label>
                                    <div class="col-xs-8">
                                        <div class="col-xs-4 no-padding">
                                            <label class="form-control-static">
                                                <input type="radio" ng-model="school.is_usual" value="是">
                                                <span class="text">是</span>
                                            </label>
                                        </div>
                                        <div class="col-xs-4 no-padding">
                                            <label class="form-control-static">
                                                <input type="radio" ng-model="school.is_usual" value="否">
                                                <span class="text">否</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 col-xs-offset-2 margin-top-10">
                            <a class="btn btn-success btn-sm size-small" ng-click="operator.addSchoolGroup()"><i class="fa fa-plus"></i> 添加教育经历</a>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <blockquote>
                        <p>项目经历</p>
                    </blockquote>
                    <div id="trainingContainer">
                        <div class="training-group pos-rel" ng-repeat="training in person.trainings track by $index">
                            <a class="btn btn-danger btn-sm pos-abs pointer z-index-10" title="删除" ng-click="operator.delTrainingGroup($index)"><i class="fa fa-trash-o"></i></a>
                            <div class="form-group">
                                <label class="control-label col-xs-2"><span class="red">*</span> 项目名称</label>
                                <div class="col-xs-10">
                                    <input type="text" ng-model="training.train_name" class="form-control size-full" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 项目时间</label>
                                    <div class="col-xs-8">
                                        <div class="col-xs-5 no-padding">
                                            <input kendo-date-picker k-options="kendoConfig.monthPicker" type="text" ng-model="training.start_time" class="form-control size-full date" required>
                                        </div>
                                        <div class="col-xs-2 text-center form-control-static">至</div>
                                        <div class="col-xs-5 no-padding">
                                            <input kendo-date-picker k-options="kendoConfig.monthPicker" type="text" ng-model="training.end_time" class="form-control size-full date" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 no-padding error-box">
                                    <label class="control-label col-xs-4"><span class="red">*</span> 所在公司</label>
                                    <div class="col-xs-8">
                                        <input type="text" ng-model="training.company_name" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-xs-2">项目描述及职责</label>
                                <div class="col-xs-10">
                                    <textarea ng-model="training.description" rows="6" class="form-control"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-8 col-xs-offset-2 margin-top-10">
                            <a class="btn btn-success btn-sm size-small" ng-click="operator.addTrainingGroup()"><i class="fa fa-plus"></i> 添加项目经历</a>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <blockquote>
                        <p>附加信息</p>
                    </blockquote>
                    <div class="form-group">
                        <label class="control-label col-xs-2">个人关键词</label>
                        <div class="col-xs-10">
                            <input type="text" ng-model="person.keywords" class="form-control size-full">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">自我评价</label>
                        <div class="col-xs-10">
                            <textarea ng-model="person.appraise" rows="6" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-10 col-xs-offset-2">
                            <button class="btn btn-success col-xs-2" ng-disabled="personForm.$invalid || person.companys.length==0 || person.schools.length==0" ng-click="operator.savePersonData()">保存</button>
                            <button class="btn btn-danger col-xs-2 margin-left-20">取消</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop
@section('body-script')
{{--<script src="/scripts/plugins/form.js"></script>--}}
{{--<script src="/scripts/candidate/create.js"></script>--}}
<script src="/scripts/angular/services/getModel.js"></script>
<script src="/scripts/angular/controllers/candidate.js"></script>
@stop