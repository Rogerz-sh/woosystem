<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Hunt;
use App\Result;
use App\ResultUser;
use App\User;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class ResultController extends BaseController {

    public function getJsonResultList() {
        $result = Result::select(DB::raw('id, name, amount, job_id, job_name, company_id, company_name, date, status, ext, comment,
        (select name from users where users.id = results.operator) as operator,
        (select a_name from areas where areas.id = results.area) as area_name,
        (select name from users where users.id = results.created_by) as creator'))
            ->orderBy('date', 'desc')->get();
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
        $creator = User::where('id', $result->created_by)->first();
        $result->users = $users;
        $result->creator = $creator;
        return response($result);
    }

    public function getJsonJobPersonList() {
        $job_id = request()->input('job_id');
        $hunts = Hunt::join('hunt_success', 'hunt.id', '=', 'hunt_success.hunt_id')
            ->select('hunt.person_id', 'hunt.person_name', 'hunt_success.date')
            ->where('hunt_success.deleted_at', null)
            ->where('hunt.job_id', $job_id)->get();
        return response($hunts);
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
        $result->status = 0;
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

    public function postAuditResult() {
        $result_id = request()->input('result_id');
        Result::where('id', $result_id)->update(['status'=>1]);
        ResultUser::where('result_id', $result_id)->update(['status'=>1]);
        return response(1);
    }

    public function getJsonResultUser() {
        $user_id = Session::get('id');
        $results = ResultUser::join('results', 'result_users.result_id', '=', 'results.id')
            ->select(DB::raw('job_id, job_name, company_id, company_name, amount, name, results.date,
                            (select name from users where users.id = results.operator) as operator,
                            (select a_name from areas where areas.id = results.area) as area_name,
                            sum(percent) as total_percent, sum(user_result) as total_result'))
            ->where('user_id', $user_id)->where('result_users.status', 1)->groupBy('result_id')->orderBy('results.date', 'desc')->get();
//        $results = DB::raw('select job_id, job_name, company_id, company_name, amount, name, results.date,
//                            (select name from users where users.id = results.operator) as operator,
//                            (select a_name from areas where areas.id = results.area) as area_name,
//                            sum(percent) as total_percent, sum(user_result) as total_result from result_users join results on result_users.result_id = results.id where user_id = '.$user_id.' group by result_id')->get();
        return response($results);
    }

    public function getJsonResultSearch() {
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $area = request()->input('area');
        $group = request()->input('group');
        $user = request()->input('user');
        $results = ResultUser::join('results', 'result_users.result_id', '=', 'results.id')
            ->join('users', 'result_users.user_id', '=', 'users.id')
            ->join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select(DB::raw('results.job_id, results.job_name, results.company_id, results.company_name, results.amount, results.name, results.date,
                            (select name from users where users.id = results.operator) as operator,
                            (select a_name from areas where areas.id = results.area) as area_name,
                            sum(percent) as total_percent, sum(user_result) as total_result'))
            ->where('result_users.status', 1)->where('results.date', '>=', $sdate)->where('results.date', '<=', $edate);

        if ($user) {
            $results = $results->where('users.id', $user)->groupBy('result_id')->orderBy('results.date', 'desc')->get();
        } else if ($group) {
            $results = $results->where('groups.id', $group)->groupBy('result_id')->orderBy('results.date', 'desc')->get();
        } else if ($area) {
            $results = $results->where('areas.id', $area)->groupBy('result_id')->orderBy('results.date', 'desc')->get();
        } else {
            $results = $results->groupBy('result_id')->orderBy('results.date', 'desc')->get();
        }
        return response($results);
    }

    public function getJsonResultRank() {
        $m_sdate = request()->input('m_sdate');
        $m_edate = request()->input('m_edate');
        $s_sdate = request()->input('s_sdate');
        $s_edate = request()->input('s_edate');
        $h_sdate = request()->input('h_sdate');
        $h_edate = request()->input('h_edate');
        $y_sdate = request()->input('y_sdate');
        $y_edate = request()->input('y_edate');
        /*
        select sum(user_result) as total_result, max(user_id) as user_id, max(users.nickname) as nickname
        from result_users join users on result_users.user_id = users.id
        where result_users.date >= '2018-03-01 00:00:00'
        and result_users.date <= '2018-03-31 23:59:59'
        and result_users.deleted_at is null
        group by user_id
        order by total_result desc
        */
        $result_month = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
            ->join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select(DB::raw('sum(user_result) as total_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
            ->where('result_users.status', 1)->where('result_users.date', '>=', $m_sdate)->where('result_users.date', '<=', $m_edate)
            ->groupBy('result_users.user_id')->orderBy('total_result', 'desc')->get();
        $result_season = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
            ->join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select(DB::raw('sum(user_result) as total_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
            ->where('result_users.status', 1)->where('result_users.date', '>=', $s_sdate)->where('result_users.date', '<=', $s_edate)
            ->groupBy('result_users.user_id')->orderBy('total_result', 'desc')->get();
        $result_halfyear = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
            ->join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select(DB::raw('sum(user_result) as total_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
            ->where('result_users.status', 1)->where('result_users.date', '>=', $h_sdate)->where('result_users.date', '<=', $h_edate)
            ->groupBy('result_users.user_id')->orderBy('total_result', 'desc')->get();
        $result_fullyear = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
            ->join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select(DB::raw('sum(user_result) as total_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
            ->where('result_users.status', 1)->where('result_users.date', '>=', $y_sdate)->where('result_users.date', '<=', $y_edate)
            ->groupBy('result_users.user_id')->orderBy('total_result', 'desc')->get();
        return response(["month"=>$result_month, "season"=>$result_season, "halfyear"=>$result_halfyear, "fullyear"=>$result_fullyear]);
    }

}
