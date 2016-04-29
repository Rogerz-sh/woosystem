@extends('layout.header')
@section('title', '新增职位')
@section('content')
    <div class="wrap bg-white padding-15  margin-top-20 margin-bottom-50 bordered border-color-orange" ng-controller="jobCreateController">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/job/list">职位管理</a></li>
                    <li>新增职位</li>
                </ul>
            </div>
            <div class="row">
                <form name="form" class="form form-horizontal" onsubmit="return false" novalidate>
                    <blockquote>
                        <p>职位基本信息</p>
                    </blockquote>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 职位名称</label>
                        <div class="col-xs-10">
                            <input type="text" ng-model="job.name" class="form-control" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 所属企业</label>
                        <div class="col-xs-10">
                            <select kendo-drop-down-list k-options="kendoConfig.companyDropDownList" ng-model="job.company_id" class="form-control size-full"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">所在地区</label>
                            <div class="col-xs-8">
                                <div class="col-xs-6 no-padding-left">
                                    <select kendo-drop-down-list ng-model="job.location.p" name="location-province" k-data-source="locationData.p" k-data-text-field="'name'" k-data-value-field="'name'" k-change="locationData.change" class="form-control size-full">
                                    </select>
                                </div>
                                <div class="col-xs-6 no-padding-right">
                                    <select kendo-drop-down-list ng-model="job.location.c" name="location-city" k-data-source="locationData.c" k-data-text-field="'name'" k-data-value-field="'name'" class="form-control size-full">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">年薪范围</label>
                            <div class="col-xs-8">
                                <div class="col-xs-5 no-padding">
                                    <div class="input-group">
                                        <input type="text" ng-model="job.salarys.s" class="form-control" numeric>
                                        <span class="input-group-addon">万</span>
                                    </div>
                                </div>
                                <div class="col-xs-2 text-center form-control-static">至</div>
                                <div class="col-xs-5 no-padding">
                                    <div class="input-group">
                                        <input type="text" ng-model="job.salarys.e" class="form-control" numeric>
                                        <span class="input-group-addon">万</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">工作年限</label>
                            <div class="col-xs-8">
                                <div class="col-xs-5 no-padding">
                                    <div class="input-group">
                                        <input type="text" ng-model="job.years.s" class="form-control" numeric>
                                        <span class="input-group-addon">年</span>
                                    </div>
                                </div>
                                <div class="col-xs-2 text-center form-control-static">至</div>
                                <div class="col-xs-5 no-padding">
                                    <div class="input-group">
                                        <input type="text" ng-model="job.years.e" class="form-control" numeric>
                                        <span class="input-group-addon">年</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">年龄要求</label>
                            <div class="col-xs-8">
                                <div class="col-xs-5 no-padding">
                                    <div class="input-group">
                                        <input type="text" ng-model="job.ages.s" class="form-control" numeric>
                                        <span class="input-group-addon">岁</span>
                                    </div>
                                </div>
                                <div class="col-xs-2 text-center form-control-static">至</div>
                                <div class="col-xs-5 no-padding">
                                    <div class="input-group">
                                        <input type="text" ng-model="job.ages.e" class="form-control" numeric>
                                        <span class="input-group-addon">岁</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">学历要求</label>
                            <div class="col-xs-8">
                                <select kendo-drop-down-list ng-model="job.degree" class="form-control size-full">
                                    <option value="不限">不限</option>
                                    <option value="大专">大专</option>
                                    <option value="本科">本科</option>
                                    <option value="硕士">硕士</option>
                                    <option value="博士">博士</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">性别要求</label>
                            <div class="col-xs-8">
                                <div class="col-xs-4 no-padding">
                                    <label class="form-control-static">
                                        <input type="radio" ng-model="job.sex" value="不限" checked>
                                        <span class="text">不限</span>
                                    </label>
                                </div>
                                <div class="col-xs-4 no-padding">
                                    <label class="form-control-static">
                                        <input type="radio" ng-model="job.sex" value="男">
                                        <span class="text">男</span>
                                    </label>
                                </div>
                                <div class="col-xs-4 no-padding">
                                    <label class="form-control-static">
                                        <input type="radio" ng-model="job.sex" value="女">
                                        <span class="text">女</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">招聘人数</label>
                            <div class="col-xs-8">
                                <div class="input-group">
                                    <input type="text" ng-model="job.number" class="form-control" numeric placeholder="不填表示若干">
                                    <span class="input-group-addon">人</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">岗位类别</label>
                            <div class="col-xs-8">
                                <select kendo-drop-down-list class="form-control size-full" ng-model="job.type">
                                    <option value="">请选择</option>
                                    <option value="1">职能岗位</option>
                                    <option value="2">技术岗位</option>
                                    <option value="3">管理岗位</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group hidden">
                        <label class="control-label col-xs-2">岗位职责</label>
                        <div class="col-xs-10">
                            <textarea ng-model="job.duty" rows="6" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 职责及要求</label>
                        <div class="col-xs-10">
                            <textarea ng-model="job.request" rows="12" class="form-control" required></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-10 col-xs-offset-2">
                            <button class="btn btn-success col-xs-2" ng-click="saveInfo()" ng-disabled="form.$invalid">保存</button>
                            <button class="btn btn-danger col-xs-2 margin-left-20">取消</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop
@section('body-script')
    <script src="/scripts/angular/services/getModel.js"></script>
    <script src="/scripts/angular/controllers/job.js"></script>
@stop