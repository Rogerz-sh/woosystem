<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Result;
use App\ResultUser;
use App\User;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class ResultController extends BaseController {

    public function getJsonResultList() {
        $result = Result::orderBy('date', 'desc')->get();
        return response($result);
    }

    public function getJsonResultUserList() {
        $result_id = request()->input('result_id');
        $users = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
            ->join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select('result_users.id as id', 'result_users.type_name', 'result_users.percent', 'result_users.user_result', 'users.nickname as user_name', 'groups.g_name as group_name', 'areas.a_name as area_name')
            ->where('result_id', $result_id)->get();
        return response($users);
    }

    public function getJsonResultData() {
        $result_id = request()->input('result_id');
        $result = Result::where('id', $result_id)->first();
        $users = ResultUser::where('result_id', $result_id)->get();
        $result->users = $users;
        return response($result);
    }

    public function getSearchJobWithCompany() {
        $filter = request()->input('filter');
        if (isset($filter) && isset($filter['filters'])) {
            $key = $filter['filters'][0]['value'];
        } else {
            $key = '';
        }
        if (strlen($key) < 2) {
            $jobs = [];
        } else {
            $jobs = DB::table('jobs')->join('company', 'jobs.company_id', '=', 'company.id')
                ->select('jobs.id as job_id', 'jobs.name as job_name', 'company.id as company_id', 'company.name as company_name')
                ->whereRaw('jobs.name like "%' . $key . '%" or company.name like "%' . $key . '%"')->get();
        }
        return response($jobs);
    }

    public function getJsonUserList() {
        $users = User::join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select('users.id as user_id', 'users.nickname as user_name', 'groups.g_name as group_name', 'areas.a_name as area_name')
            ->where('status', 1)->get();
        return response($users);
    }

    public function postSaveResult() {
        $data = request()->input('data');
        $users = request()->input('users');
        $result = new Result();
        foreach ($data as $key => $value) {
            $result->$key = $value;
        }
        $result->created_by = Session::get('id');
        $result->updated_by = Session::get('id');
        $result->save();
        foreach ($users as $user) {
            $result_user = new ResultUser();
            foreach ($user as $key => $value) {
                $result_user->$key = $value;
            }
            $result_user->result_id = $result->id;
            $result_user->created_by = Session::get('id');
            $result_user->updated_by = Session::get('id');
            $result_user->save();
        }
        return response($result->id);
    }

    public function postEditResult() {
        $data = request()->input('data');
        $users = request()->input('users');
        $result = Result::where('id', $data['id'])->first();
        foreach ($data as $key => $value) {
            $result->$key = $value;
        }
        $result->updated_by = Session::get('id');
        $result->save();
        ResultUser::where('result_id', $data['id'])->forceDelete();
        foreach ($users as $user) {
            $result_user = new ResultUser();
            foreach ($user as $key => $value) {
                $result_user->$key = $value;
            }
            $result_user->created_by = Session::get('id');
            $result_user->updated_by = Session::get('id');
            $result_user->save();
        }
        return response($result->id);
    }

    public function postDeleteResult() {
        $result_id = request()->input('result_id');
        Result::where('id', $result_id)->delete();
        ResultUser::where('result_id', $result_id)->delete();
        return response(1);
    }

}
