<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Areas;
use App\Bd;
use App\Candidate;
use App\DailyReason;
use App\DailyReport;
use App\Groups;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\HuntResult;
use App\Belongs;
use App\HuntSuccess;
use App\Job;
use App\User;
use App\ResultUser;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use App\HuntRecord;
use App\HuntFile;

class PerformanceController extends BaseController {

    public function getJsonHuntListData() {
        if (Session::get('power') >= 9) {
            $hunt = Hunt::join('person', 'hunt.person_id', '=', 'person.id')
                ->select('hunt.id', 'hunt.job_name', 'hunt.company_name', 'hunt.person_name', 'hunt.name as HID', 'person.id as person_id', 'person.name as name', 'person.type', 'person.tel', 'person.email', 'person.sex', 'hunt.date', 'hunt.status')
                ->orderBy('hunt.created_at', 'desc')->get();
        } else {
            $hunt = Hunt::join('person', 'hunt.person_id', '=', 'person.id')
                ->select('hunt.id', 'hunt.job_name', 'hunt.company_name', 'hunt.person_name', 'hunt.name as HID', 'person.id as person_id', 'person.name as name', 'person.type', 'person.tel', 'person.email', 'person.sex', 'hunt.date', 'hunt.status')
                ->where('hunt.user_id', Session::get('id'))
                ->orderBy('hunt.created_at', 'desc')->get();
        }
        return response($hunt);
    }

    public function getJsonPerformanceListData() {
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $area = request()->input('area');
        $group = request()->input('group');
        $user = request()->input('user');
        $power = Session::get('power');
        $sid = Session::get('id');
        $users = User::select('id', 'group_id', 'area_id')->where('status', 1);
        if ($power < 10 && $sid != 85) {
            $belong = Belongs::where('user_id', $sid)->first();
            if ($belong) {
                $path = Belongs::whereRaw('root_path like "' . $belong->root_path . '%"')->select('user_id')->get();
                if (sizeof($path) > 0) {
                    $ids = '';
                    foreach ($path as $p) {
                        $ids = $ids . ',' . $p->user_id;
                    }
                    $ids = substr($ids, 1);
                    $users = $users->whereRaw('id in (' . $ids . ')');
                } else {
                    $users = $users->where('id', $sid);
                }
            } else {
                $users = $users->where('id', $sid);
            }
        }
        if ($user) {
            $users = $users->where('id', $user)->get();
        } else if ($group) {
            $users = $users->where('group_id', $group)->get();
        } else if ($area) {
            $users = $users->where('area_id', $area)->get();
        } else {
            $users = $users->get();
        }
        $uids = array();
//        $gids = array();
//        $aids = array();
        foreach($users as $u) {
            array_push($uids, $u->id);
//            if (!in_array($u->group_id, $gids)) {
//                array_push($gids, $u->group_id);
//            }
//            if (!in_array($u->area_id, $aids)) {
//                array_push($aids, $u->area_id);
//            }
        }
        $uids = join(',', $uids);

        $users = User::select(DB::raw('id as user_id, nickname, group_name, area_name'))
            ->whereRaw('status = 1 and id in (' . $uids . ')')->get();
        $bd = Bd::select(DB::raw('count(id) as count, max(user_id) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('user_id in (' . $uids . ')')
            ->groupBy(DB::raw('user_id, date_format(date, "%Y-%m")'))->get();
        $person = Candidate::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(created_at), "%Y-%m") as month'))
            ->where('created_at', '>=', $sdate)->where('created_at', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(created_at, "%Y-%m")'))->get();
        $report = HuntReport::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('type', 'report')->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $face = HuntFace::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)->where('type', '一面')
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $offer = HuntReport::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('type', 'offer')->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $success = HuntSuccess::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $result = ResultUser::select(DB::raw('sum(user_result) as count, max(user_id) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('user_id in (' . $uids . ')')
            ->groupBy(DB::raw('user_id, date_format(date, "%Y-%m")'))->get();
        return response(["users"=>$users, "bd"=>$bd, "person"=>$person, "report"=>$report, "face"=>$face, "offer"=>$offer, "success"=>$success, "result"=>$result]);
    }

    public function getJsonPerformanceRanks() {
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $target = request()->input('target');

        if ($target == 'users') {
            $results = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('sum(user_result) as rank_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('result_users.status', 1)->where('result_users.date', '>=', $sdate)->where('result_users.date', '<=', $edate)
                ->groupBy('result_users.user_id')->orderBy('rank_result', 'desc')->get();

            $results_percent = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('sum(if(user_result<0, -user_order, user_order)) as rank_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('result_users.status', 1)->where('result_users.date', '>=', $sdate)->where('result_users.date', '<=', $edate)->where('result_users.deleted_at', null)
                ->groupBy('result_users.user_id')->orderBy('rank_result', 'desc')->get();

            $bd = Bd::join('users', 'bd.user_id', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(bd.id) as rank_result, max(user_id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('bd.status', '签约合作')->where('bd.date', '>=', $sdate)->where('bd.date', '<=', $edate)
                ->groupBy('bd.user_id')->orderBy('rank_result', 'desc')->get();

            $job = Job::join('users', 'jobs.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(jobs.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('jobs.created_at', '>=', $sdate)->where('jobs.created_at', '<=', $edate)
                ->groupBy('jobs.created_by')->orderBy('rank_result', 'desc')->get();

            $report = HuntReport::join('users', 'hunt_report.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_report.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_report.type', 'report')->where('hunt_report.date', '>=', $sdate)->where('hunt_report.date', '<=', $edate)
                ->groupBy('hunt_report.created_by')->orderBy('rank_result', 'desc')->get();

            $face = HuntFace::join('users', 'hunt_face.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_face.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_face.type', '一面')
                ->whereRaw('(hunt_face.date < "2017-08-01 00:00:00" or (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0)')
                ->where('hunt_face.date', '>=', $sdate)->where('hunt_face.date', '<=', $edate)
                ->groupBy('hunt_face.created_by')->orderBy('rank_result', 'desc')->get();

            $offer = HuntReport::join('users', 'hunt_report.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_report.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_report.type', 'offer')->where('hunt_report.date', '>=', $sdate)->where('hunt_report.date', '<=', $edate)
                ->groupBy('hunt_report.created_by')->orderBy('rank_result', 'desc')->get();

            $success = HuntSuccess::join('users', 'hunt_success.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_success.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_success.date', '>=', $sdate)->where('hunt_success.date', '<=', $edate)
                ->groupBy('hunt_success.created_by')->orderBy('rank_result', 'desc')->get();
        } else {
            $results = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('sum(user_result) as rank_result, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('result_users.status', 1)->where('result_users.date', '>=', $sdate)->where('result_users.date', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $results_percent = ResultUser::join('users', 'result_users.user_id', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('sum(if(user_result<0, -user_order, user_order)) as rank_result, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('result_users.status', 1)->where('result_users.date', '>=', $sdate)->where('result_users.date', '<=', $edate)->whereNull('result_users.deleted_at')
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $bd = Bd::join('users', 'bd.user_id', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(bd.id) as rank_result, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('bd.status', '签约合作')->where('bd.date', '>=', $sdate)->where('bd.date', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $job = Job::join('users', 'jobs.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(jobs.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('jobs.created_at', '>=', $sdate)->where('jobs.created_at', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $report = HuntReport::join('users', 'hunt_report.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_report.id) as rank_result, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_report.type', 'report')->where('hunt_report.date', '>=', $sdate)->where('hunt_report.date', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $face = HuntFace::join('users', 'hunt_face.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_face.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_face.type', '一面')
                ->whereRaw('(hunt_face.date < "2017-08-01 00:00:00" or (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0)')
                ->where('hunt_face.date', '>=', $sdate)->where('hunt_face.date', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $offer = HuntReport::join('users', 'hunt_report.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_report.id) as rank_result, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_report.type', 'offer')->where('hunt_report.date', '>=', $sdate)->where('hunt_report.date', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();

            $success = HuntSuccess::join('users', 'hunt_success.created_by', '=', 'users.id')
                ->join('groups', 'users.group_id', '=', 'groups.id')
                ->join('areas', 'users.area_id', '=', 'areas.id')
                ->select(DB::raw('count(hunt_success.id) as rank_result, max(users.id) as user_id, max(users.nickname) as nickname, max(groups.g_name) as group_name, max(areas.a_name) as area_name'))
                ->where('hunt_success.date', '>=', $sdate)->where('hunt_success.date', '<=', $edate)
                ->groupBy('users.group_id')->orderBy('rank_result', 'desc')->get();
        }
        return response(["result"=>$results, "result_percent"=>$results_percent, "bd"=>$bd, "job"=>$job, "report"=>$report, "face"=>$face, "offer"=>$offer, "success"=>$success]);
    }

    public function getJsonPerformanceData() {
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $user_id = Session::get('id');

        $targets = DB::table('month_target')
            ->join('users', 'users.id', '=', 'month_target.user_id')
            ->select('month_target.user_id', 'users.nickname', 'month_target.month', 'month_target.bd_target', 'month_target.person_target', 'month_target.report_target', 'month_target.face_target', 'month_target.offer_target', 'month_target.success_target', 'month_target.result_target')
            ->whereRaw('month >= date_format("'.$sdate.'", "%Y-%m") and month <= date_format("'.$edate.'", "%Y-%m") and user_id = '. $user_id .'')->get();
        $bd = Bd::select(DB::raw('count(id) as count, max(user_id) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->where('user_id', $user_id)
            ->groupBy(DB::raw('user_id, date_format(date, "%Y-%m")'))->get();
        $person = Candidate::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(created_at), "%Y-%m") as month'))
            ->where('created_at', '>=', $sdate)->where('created_at', '<=', $edate)
            ->where('created_by', $user_id)
            ->groupBy(DB::raw('created_by, date_format(created_at, "%Y-%m")'))->get();
        $report = HuntReport::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('type', 'report')->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->where('created_by', $user_id)
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $face = HuntFace::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->where('created_by', $user_id)
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $offer = HuntReport::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('type', 'offer')->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->where('created_by', $user_id)
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $success = HuntSuccess::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->where('created_by', $user_id)
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $result = ResultUser::select(DB::raw('sum(user_result) as count, max(user_id) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->where('user_id', $user_id)
            ->groupBy(DB::raw('user_id, date_format(date, "%Y-%m")'))->get();
        return response(["target"=>$targets, "bd"=>$bd, "person"=>$person, "report"=>$report, "face"=>$face, "offer"=>$offer, "success"=>$success, "result"=>$result]);
    }

    public function getJsonTargetData() {
        $month = request()->input('month');
        $result = DB::table('month_target')->where('user_id', Session::get('id'))->where('month', $month)->get();
        return response($result);
    }

    public function getJsonDetailList() {
        $id = request()->input('id');
        $field = request()->input('field');
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        if ($field == 'bd_count') {
            $result = Bd::where('user_id', $id)
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'person_count') {
            $result = Candidate::where('created_by', $id)
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'report_count') {
            $result = HuntReport::where('created_by', $id)
                ->where('type', 'report')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'face_count') {
            $result = HuntFace::where('created_by', $id)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'offer_count') {
            $result = HuntReport::where('created_by', $id)
                ->where('type', 'offer')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'success_count') {
            $result = HuntSuccess::where('created_by', $id)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'result_count') {
            $result = HuntResult::where('created_by', $id)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        return response([]);
    }

    public function getJsonTargetList() {
        if (Session::get('power') < '9') {
            $targets = DB::table('month_target')->join('users', 'month_target.user_id', '=', 'users.id')
                ->select('month', 'user_id', 'nickname', 'bd_target', 'person_target', 'report_target', 'face_target', 'offer_target', 'success_target', 'result_target')
                ->where('user_id', Session::get('id'))->get();
        } else {
            $targets = DB::table('month_target')->join('users', 'month_target.user_id', '=', 'users.id')
                ->select('month', 'user_id', 'nickname', 'bd_target', 'person_target', 'report_target', 'face_target', 'offer_target', 'success_target', 'result_target')->get();
        }
        return response($targets);
    }

    public function getJsonMonthTarget() {
        $month = request()->input('month');
        $target = DB::table('month_target')->where('user_id', Session::get('id'))->where('month', $month)->get();
        return response($target);
    }

    public function postSaveTarget() {
        $month = request()->input('month');
        $id = Session::get('id');
        $target = DB::table('month_target')->where('user_id', $id)->where('month', $month['month'])->first();
        if ($target) {
            DB::table('month_target')->where('user_id', $id)->where('month', $month['month'])->update(['bd_target'=>$month['bd'], 'person_target'=>$month['person'], 'report_target'=>$month['report'], 'face_target'=>$month['face'], 'offer_target'=>$month['offer'], 'success_target'=>$month['success'], 'result_target'=>$month['result']]);
        } else {
            DB::table('month_target')->insert(['user_id'=>$id, 'month'=>$month['month'], 'bd_target'=>$month['bd'], 'person_target'=>$month['person'], 'report_target'=>$month['report'], 'face_target'=>$month['face'], 'offer_target'=>$month['offer'], 'success_target'=>$month['success'], 'result_target'=>$month['result']]);
        }

//        $days = request()->input('days');
//        $sqls = array();
//        for ($i = 0; $i < sizeof($days); $i++) {
//            $day = $days[$i];
//            $sql = ['user_id'=>$id, 'date'=>$day['date'], 'month'=>$month['month'], 'person_target'=>$day['tp'], 'report_target'=>$day['tr'], 'face_target'=>$day['tf'], 'offer_target'=>$day['to'], 'success_target'=>$day['ts']];
//            array_push($sqls, $sql);
//        }
//        DB::table('day_target')->where('user_id', $id)->where('month', $month['month'])->delete();
//        DB::table('day_target')->insert($sqls);
        return response(1);
    }

    public function getJsonPerformanceChartData() {
        $type = request()->input('type');
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $area = request()->input('area');
        $group = request()->input('group');
        $user = request()->input('user');
        $format = $type == 'day' ? '%Y-%m-%d' : '%Y-%m';
        if ($area || $group || $user) {
            if ($user) {
                $searchStr = 'created_by = '.$user;
            } else {
                if ($group) {
                    $searchStr = 'created_by in (select id from users where users.group_id = '.$group.' )';
                } else {
                    $searchStr = 'created_by in (select id from users where users.area_id = '.$area.' )';
                }
            }
            $person = Candidate::select(DB::raw('count(id) as count, DATE_FORMAT(created_at,"' . $format . '") as date'))
                ->whereRaw($searchStr)
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(created_at,"' . $format . '")'))->get();
            $report = HuntReport::select(DB::raw('count(id) as count, DATE_FORMAT(date,"' . $format . '") as date'))
                ->whereRaw($searchStr)
                ->where('type', 'report')
                ->where('is_confirm', 1)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"' . $format . '")'))->get();
            $face = HuntFace::select(DB::raw('count(id) as count, DATE_FORMAT(date,"' . $format . '") as date'))
                ->whereRaw($searchStr.' and (hunt_face.date < "2017-08-01 00:00:00" or (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0)')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"' . $format . '")'))->get();
            $offer = HuntReport::select(DB::raw('count(id) as count, DATE_FORMAT(date,"' . $format . '") as date'))
                ->whereRaw($searchStr)
                ->where('type', 'offer')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"' . $format . '")'))->get();
            $success = HuntSuccess::select(DB::raw('count(id) as count, DATE_FORMAT(date,"' . $format . '") as date'))
                ->whereRaw($searchStr)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"' . $format . '")'))->get();
        } else {
            $person = Candidate::select(DB::raw('count(id) as count, DATE_FORMAT(created_at,"'.$format.'") as date'))
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(created_at,"'.$format.'")'))->get();
            $report = HuntReport::select(DB::raw('count(id) as count, DATE_FORMAT(date,"'.$format.'") as date'))
                ->where('type', 'report')
                ->where('is_confirm', 1)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"'.$format.'")'))->get();
            $face = HuntFace::select(DB::raw('count(id) as count, DATE_FORMAT(date,"'.$format.'") as date'))
                ->whereRaw('(hunt_face.date < "2017-08-01 00:00:00" or (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0)')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"'.$format.'")'))->get();
            $offer = HuntReport::select(DB::raw('count(id) as count, DATE_FORMAT(date,"'.$format.'") as date'))
                ->where('type', 'offer')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"'.$format.'")'))->get();
            $success = HuntSuccess::select(DB::raw('count(id) as count, DATE_FORMAT(date,"'.$format.'") as date'))
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy(DB::raw('DATE_FORMAT(date,"'.$format.'")'))->get();
        }
        $result = ["person"=>$person, "report"=>$report, "face"=>$face, "offer"=>$offer, "success"=>$success];
        return response($result);
    }

    public function getJsonPerformanceRateData() {
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $area = request()->input('area');
        $group = request()->input('group');
        $user = request()->input('user');
        $format = '%Y-%m-%d';

        if ($area || $group || $user) {
            if ($user) {
                $searchStr = 'created_by = '.$user;
            } else {
                if ($group) {
                    $searchStr = 'created_by in (select id from users where users.group_id = '.$group.' )';
                } else {
                    $searchStr = 'created_by in (select id from users where users.area_id = '.$area.' )';
                }
            }
            $person = Candidate::select(DB::raw('count(id) as count'))
                ->whereRaw($searchStr)
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)->get();
            $report = HuntReport::select(DB::raw('count(id) as count'))
                ->whereRaw($searchStr)
                ->where('type', 'report')
                ->where('is_confirm', 1)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
            $face = HuntFace::select(DB::raw('count(id) as count'))
                ->whereRaw($searchStr)
                ->whereRaw('(hunt_face.date < "2017-08-01 00:00:00" or (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0)')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
            $offer = HuntReport::select(DB::raw('count(id) as count'))
                ->whereRaw($searchStr)
                ->where('type', 'offer')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
            $success = HuntSuccess::select(DB::raw('count(id) as count'))
                ->whereRaw($searchStr)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
        } else {
            $person = Candidate::select(DB::raw('count(id) as count'))
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)->get();
            $report = HuntReport::select(DB::raw('count(id) as count'))
                ->where('type', 'report')
                ->where('is_confirm', 1)
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
            $face = HuntFace::select(DB::raw('count(id) as count'))
                ->whereRaw('(hunt_face.date < "2017-08-01 00:00:00" or (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0)')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
            $offer = HuntReport::select(DB::raw('count(id) as count'))
                ->where('type', 'offer')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
            $success = HuntSuccess::select(DB::raw('count(id) as count'))
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)->get();
        }

        $result = ["person"=>$person[0]["count"], "report"=>$report[0]["count"], "face"=>$face[0]["count"], "offer"=>$offer[0]["count"], "success"=>$success[0]["count"]];
        return response($result);
    }

    public function getJsonAreaList() {
        $area = Areas::select('id', 'a_name')->get();
        return response($area);
    }

    public function getJsonGroupList() {
        $group = Groups::select('id', 'g_name', 'area_id', 'area_name')->get();
        return response($group);
    }

    public function getJsonUserList() {
        $user = User::select('id', 'nickname', 'area_id', 'group_id')->where('status', '1')->orderBy('id', 'desc')->get();
        return response($user);
    }

    public function getDailyReportList() {
        $power = Session::get('power');
        if ($power >= 9) {
            $user = request()->input('user');
            $sdate = request()->input('sdate').' 00:00:00';
            $edate = request()->input('edate').' 23:59:59';
            $report = DailyReport::select(DB::raw('daily_report.id,
                daily_report.user_id, daily_report.date,
                daily_report.job_id, daily_report.job_name, daily_report.company_id, daily_report.company_name,
                daily_report.target, users.nickname, users.group,
                (select count(id) from hunt_report where hunt_report.created_by = daily_report.user_id and date_format(hunt_report.date, "%Y-%m-%d") = daily_report.date and hunt_report.job_id = daily_report.job_id and hunt_report.deleted_at is null) as complete,
                (select count(id) from person where person.created_by = daily_report.user_id and date_format(person.created_at, "%Y-%m-%d") = daily_report.date and deleted_at is null) as person_count,
                (select count(distinct hunt_id) from hunt_face where hunt_face.created_by = daily_report.user_id and date_format(hunt_face.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as face_count,
                (select count(id) from hunt_report where hunt_report.created_by = daily_report.user_id and type = "report" and date_format(hunt_report.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as report_count,
                (select count(id) from hunt_report where hunt_report.created_by = daily_report.user_id and type = "offer" and date_format(hunt_report.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as offer_count,
                (select count(id) from hunt_success where hunt_success.created_by = daily_report.user_id and date_format(hunt_success.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as success_count'))
                ->join('users', 'users.id', '=', 'daily_report.user_id')
                ->where('daily_report.date', '>=', $sdate)
                ->where('daily_report.date', '<=', $edate);
            if ($user != '') {
                if ($user == '-1' || $user == '-2') {
                    $group = $user == '-1' ? '项目一部' : '项目二部';
                    $report->where('users.group', $group);
                } else {
                    $report->where('daily_report.user_id', $user);
                }
            }
            $report->orderBy('daily_report.date', 'desc');
            $report = $report->get();
        } else {
            $report = DailyReport::select(DB::raw('daily_report.id,
                daily_report.user_id, daily_report.date,
                daily_report.job_id, daily_report.job_name, daily_report.company_id, daily_report.company_name,
                daily_report.target, users.nickname, users.group,
                (select count(id) from hunt_report where hunt_report.created_by = daily_report.user_id and date_format(hunt_report.date, "%Y-%m-%d") = daily_report.date and hunt_report.job_id = daily_report.job_id and hunt_report.deleted_at is null) as complete,
                (select count(id) from person where person.created_by = daily_report.user_id and date_format(person.created_at, "%Y-%m-%d") = daily_report.date and deleted_at is null) as person_count,
                (select count(distinct hunt_id) from hunt_face where hunt_face.created_by = daily_report.user_id and date_format(hunt_face.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as face_count,
                (select count(id) from hunt_report where hunt_report.created_by = daily_report.user_id and type = "report" and date_format(hunt_report.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as report_count,
                (select count(id) from hunt_report where hunt_report.created_by = daily_report.user_id and type = "offer" and date_format(hunt_report.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as offer_count,
                (select count(id) from hunt_success where hunt_success.created_by = daily_report.user_id and date_format(hunt_success.date, "%Y-%m-%d") = daily_report.date and deleted_at is null) as success_count'))
                ->join('users', 'users.id', '=', 'daily_report.user_id')->where('daily_report.user_id', Session::get('id'))->orderBy('daily_report.date', 'desc')->get();
        }
        return response($report);
    }

    public function getDailyReport() {
        $user_id = request()->input('user_id');
        $date = request()->input('date');
        $nextDate = request()->input('nextDate');

        $report1 = DailyReport::select(DB::raw('daily_report.id,
                daily_report.user_id, daily_report.date,
                daily_report.job_id, daily_report.job_name, daily_report.company_id, daily_report.company_name,
                daily_report.target, users.nickname, users.group'))
            ->join('users', 'users.id', '=', 'daily_report.user_id')
            ->where('daily_report.date', '>=', $date.' 00:00:00')
            ->where('daily_report.date', '<=', $date.' 23:59:59')
            ->where('daily_report.user_id', $user_id)->get();

        $report2 = DailyReport::select(DB::raw('daily_report.id,
                daily_report.user_id, daily_report.date,
                daily_report.job_id, daily_report.job_name, daily_report.company_id, daily_report.company_name,
                daily_report.target, users.nickname, users.group'))
            ->join('users', 'users.id', '=', 'daily_report.user_id')
            ->where('daily_report.date', '>=', $nextDate.' 00:00:00')
            ->where('daily_report.date', '<=', $nextDate.' 23:59:59')
            ->where('daily_report.user_id', $user_id)->get();

        $sdate = $date.' 00:00:00';
        $edate = $date.' 23:59:59';
        $reason = DailyReason::select('reason')
            ->where('deleted_at', null)
            ->where('date', $sdate)->get();
        $person = Candidate::where('created_by', $user_id)
            ->where('created_at', '>=', $sdate)
            ->where('created_at', '<=', $edate)->get();
        $report = HuntReport::where('created_by', $user_id)
            ->where('type', 'report')
            ->where('date', '>=', $sdate)
            ->where('date', '<=', $edate)->get();
        $face = HuntFace::where('created_by', $user_id)
            ->where('date', '>=', $sdate)
            ->where('date', '<=', $edate)->get();
        $offer = HuntReport::where('created_by', $user_id)
            ->where('type', 'offer')
            ->where('date', '>=', $sdate)
            ->where('date', '<=', $edate)->get();
        $success = HuntSuccess::where('created_by', $user_id)
            ->where('date', '>=', $sdate)
            ->where('date', '<=', $edate)->get();

        return response(['today'=>$report1, 'tomorrow'=>$report2, "person"=>$person, "report"=>$report, "face"=>$face, "offer"=>$offer, "success"=>$success, "reason"=>$reason]);
    }

    public function postSaveDailyReport() {
        $rpt = request()->input('report');
        if (isset($rpt['id'])) {
            $report = DailyReport::find($rpt['id']);
            foreach ($rpt as $key => $value) {
                $report->$key = $value;
            }
            $report->save();
        } else {
            $oldRpt = DailyReport::where('type', 'report')->where('user_id', Session::get('id'))->where('date', $rpt['date'])->where('job_id', $rpt['job_id'])->first();
            if ($oldRpt) {
                return response(-1);
            } else {
                $report = new DailyReport();
                foreach ($rpt as $key => $value) {
                    $report->$key = $value;
                }
                $report->user_id = Session::get('id');
                $report->save();
            }
        }
        return response($report->id);

    }

    public function postSaveDailyReason() {
        $reason = request()->input("reason");
        $date = request()->input("date").' 00:00:00';
        $oldRst = DailyReason::where('date', $date)->where('created_by', Session::get('id'))->first();
        if ($oldRst) {
            $oldRst->reason = $reason;
            $oldRst->updated_by = Session::get('id');
            $oldRst->save();
            return response($oldRst->id);
        } else {
            $newRst = new DailyReason();
            $newRst->reason = $reason;
            $newRst->date = $date;
            $newRst->created_by = Session::get('id');
            $newRst->save();
            return response($newRst->id);
        }
    }

    public function postDeleteDailyReport() {
        $id = request()->input('id');
        $report = DailyReport::find($id);
        $report->forceDelete();
        return response($report->id);
    }

    public function getJsonHuntSelectListData() {
        $hs = DB::table('hunt_count')->whereRaw('locate(concat(",", ?, ","), concat(",", user_ids, ",")) > 0 and status="进行中"', [Session::get('id')])->orderBy('updated_at', 'desc')->get();
        return response($hs);
    }

    public function getJsonPerformanceSearch() {
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
        $area = request()->input('area');
        $group = request()->input('group');
        $user = request()->input('user');
        $power = Session::get('power');
        $sid = Session::get('id');
        $users = User::select('id', 'group_id', 'area_id')->where('status', 1);
        if ($power < 10 && $sid != 85) {
            $belong = Belongs::where('user_id', $sid)->first();
            if ($belong) {
                $path = Belongs::whereRaw('root_path like "' . $belong->root_path . '%"')->select('user_id')->get();
                if (sizeof($path) > 0) {
                    $ids = '';
                    foreach ($path as $p) {
                        $ids = $ids . ',' . $p->user_id;
                    }
                    $ids = substr($ids, 1);
                    $users = $users->whereRaw('id in (' . $ids . ')');
                } else {
                    $users = $users->where('id', $sid);
                }
            } else {
                $users = $users->where('id', $sid);
            }
        }
        if ($user) {
            $users = $users->where('id', $user)->get();
        } else if ($group) {
            $users = $users->where('group_id', $group)->get();
        } else if ($area) {
            $users = $users->where('area_id', $area)->get();
        } else {
            $users = $users->get();
        }
        $uids = array();
//        $gids = array();
//        $aids = array();
        foreach($users as $u) {
            array_push($uids, $u->id);
//            if (!in_array($u->group_id, $gids)) {
//                array_push($gids, $u->group_id);
//            }
//            if (!in_array($u->area_id, $aids)) {
//                array_push($aids, $u->area_id);
//            }
        }
        $uids = join(',', $uids);

        $targets = DB::table('month_target')
            ->join('users', 'users.id', '=', 'month_target.user_id')
            ->select('month_target.user_id', 'users.nickname', 'month_target.month', 'month_target.bd_target', 'month_target.person_target', 'month_target.report_target', 'month_target.face_target', 'month_target.offer_target', 'month_target.success_target', 'month_target.result_target')
            ->whereRaw('month >= date_format("'.$sdate.'", "%Y-%m") and month <= date_format("'.$edate.'", "%Y-%m") and user_id in (' . $uids . ')')->get();
        $bd = Bd::select(DB::raw('count(id) as count, max(user_id) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('user_id in (' . $uids . ')')
            ->groupBy(DB::raw('user_id, date_format(date, "%Y-%m")'))->get();
        $person = Candidate::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(created_at), "%Y-%m") as month'))
            ->where('created_at', '>=', $sdate)->where('created_at', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(created_at, "%Y-%m")'))->get();
        $report = HuntReport::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('type', 'report')->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $face = HuntFace::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)->where('type', '一面')
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $offer = HuntReport::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('type', 'offer')->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $success = HuntSuccess::select(DB::raw('count(id) as count, max(created_by) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('created_by in (' . $uids . ')')
            ->groupBy(DB::raw('created_by, date_format(date, "%Y-%m")'))->get();
        $result = ResultUser::select(DB::raw('sum(user_result) as count, max(user_id) as user_id, date_format(max(date), "%Y-%m") as month'))
            ->where('date', '>=', $sdate)->where('date', '<=', $edate)
            ->whereRaw('user_id in (' . $uids . ')')
            ->groupBy(DB::raw('user_id, date_format(date, "%Y-%m")'))->get();
        return response(["target"=>$targets, "bd"=>$bd, "person"=>$person, "report"=>$report, "face"=>$face, "offer"=>$offer, "success"=>$success, "result"=>$result]);
    }

    public function getJsonAreaGroupUserData() {
        $power = Session::get('power');
        if ($power >= 10 || Session::get('id') == 85) {
            $area = Areas::select('id', 'a_name')->get();
            $group = Groups::select('id', 'g_name', 'area_id', 'area_name')->get();
            $user = User::select('id', 'nickname', 'area_id', 'group_id')->where('status', '1')->orderBy('id', 'desc')->get();
        } else {
            $users = User::select('id', 'nickname', 'group_id', 'group_name', 'area_id', 'area_name')->where('status', 1);
            $belong = Belongs::where('user_id', Session::get('id'))->first();
            if ($belong) {
                $path = Belongs::whereRaw('root_path like "' . $belong->root_path . '%"')->select('user_id')->get();
                if (sizeof($path) > 0) {
                    $ids = '';
                    foreach ($path as $p) {
                        $ids = $ids . ',' . $p->user_id;
                    }
                    $ids = substr($ids, 1);
                    $users = $users->whereRaw('id in (' . $ids . ')')->get();
                } else {
                    $users = $users->where('id', Session::get('id'))->get();
                }
            } else {
                $users = $users->where('id', Session::get('id'))->get();
            }
            $user = array(); $group = array(); $area = array(); $gids = array(); $aids = array();
            foreach($users as $u) {
                array_push($user, $u);
                if (!in_array($u->group_id, $gids)) {
                    array_push($gids, $u->group_id);
                    array_push($group, ["id"=>$u->group_id, "g_name"=>$u->group_name, "area_id"=>$u->area_id, "area_name"=>$u->area_name]);
                }
                if (!in_array($u->area_id, $aids)) {
                    array_push($aids, $u->area_id);
                    array_push($area, ["id"=>$u->area_id, "a_name"=>$u->area_name]);
                }
            }
        }
        return response(["users"=>$user, "groups"=>$group, "areas"=>$area]);
    }
}
