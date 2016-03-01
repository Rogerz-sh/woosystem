@extends('layout.header')
@section('title', '新增企业')
@section('content')
    <div class="wrap bg-white padding-15 margin-top-20 margin-bottom-50 bordered border-color-orange" ng-controller="companyCreateController">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/candidate/">企业管理</a></li>
                    <li>新增企业</li>
                </ul>
            </div>
            <div class="row">
                <form id="form" name="companyForm" action="" class="form form-horizontal" onsubmit="return false" novalidate>
                    <blockquote>
                        <p>基本信息</p>
                    </blockquote>
                    <div id="basicContainer">
                        <div class="form-group">
                            <label class="control-label col-xs-2"><span class="red">*</span> 公司名称</label>
                            <div class="col-xs-10">
                                <input kendo-auto-complete k-options="kendoConfig.companyAutoComplete" type="text" ng-model="company.name" class="form-control size-full" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">所在地区</label>
                                <div class="col-xs-8">
                                    <div class="col-xs-6 no-padding-left">
                                        <select kendo-drop-down-list ng-model="company.location.p" name="location-province" k-data-source="locationData.p" k-data-text-field="'name'" k-data-value-field="'name'" k-change="locationData.change" class="form-control size-full">
                                            <option value="-1" disabled>-- 请选择 --</option>
                                        </select>
                                    </div>
                                    <div class="col-xs-6 no-padding-right">
                                        <select kendo-drop-down-list ng-model="company.location.c" name="location-city" k-data-source="locationData.c" k-data-text-field="'name'" k-data-value-field="'name'" class="form-control size-full">

                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">公司规模</label>
                                <div class="col-xs-8">
                                    <select kendo-drop-down-list ng-model="company.scale" class="form-control size-full">
                                        <option value="">-请选择-</option>
                                        <option value="50人以下">50人以下</option>
                                        <option value="50-99人">50-99人</option>
                                        <option value="100-499人">100-499人</option>
                                        <option value="500人以上">500人以上</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">所属行业</label>
                                <div class="col-xs-8">
                                    <input type="text" ng-model="company.industry" class="form-control" value="" />
                                </div>
                            </div>
                            <div class="col-xs-6 no-padding error-box">
                                <label class="control-label col-xs-4">公司性质</label>
                                <div class="col-xs-8">
                                    <input type="text" ng-model="company.type" class="form-control" value="" />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-xs-2">企业简介</label>
                            <div class="col-xs-10">
                                <textarea ng-model="company.introduce" id="" cols="30" rows="10" class="form-control"></textarea>
                            </div>
                        </div>
                    </div>
                    <blockquote>
                        <p>联系人信息</p>
                    </blockquote>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 联系人</label>
                            <div class="col-xs-8">
                                <input type="text" ng-model="company.contact" class="form-control" value="" required />
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 联系电话</label>
                            <div class="col-xs-8">
                                <input type="text" ng-model="company.tel" class="form-control" value="" required />
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">电子邮箱</label>
                            <div class="col-xs-8">
                                <input type="text" ng-model="company.email" class="form-control" value="" />
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">QQ/其它</label>
                            <div class="col-xs-8">
                                <input type="text" ng-model="company.other" class="form-control" value="" />
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">备注信息</label>
                        <div class="col-xs-10">
                            <textarea ng-model="company.description" id="" cols="30" rows="10" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-10 col-xs-offset-2">
                            <button type="submit" ng-click="saveInfo()" class="btn btn-primary size-mini" ng-disabled="companyForm.$invalid">提交</button>
                            <a href="/company/list" class="btn btn-default size-mini">返回</a>
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
<script src="/scripts/angular/controllers/company.js"></script>
@stop