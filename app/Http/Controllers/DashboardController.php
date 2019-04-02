<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Bd;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\Job;
use App\MonthTarget;
use App\User;
use App\HuntSuccess;
use App\Invoice;
use App\ResultTarget;
use App\ResultUser;
use App\Belongs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class DashboardController extends BaseController {

    public function getIndex() {
        return view('user.dashboard')->with('navIndex', 0);
    }

    public function getRecentJobList() {
        $data = Job::join('company', 'jobs.company_id', '=', 'company.id')
            ->leftJoin('job_types', 'jobs.type_id', '=', 'job_types.id')
            ->leftJoin('hunt_select', 'jobs.id', '=', 'hunt_select.job_id')
            ->select('jobs.id', 'jobs.name', 'jobs.type_id', 'job_types.name as type_name', 'job_types.parentid as type_parent', 'jobs.company_id', 'jobs.company_name', 'company.industry', 'jobs.salary', 'jobs.area', 'jobs.sellpoint', 'jobs.created_at', 'jobs.updated_at', 'jobs.created_by', 'hunt_select.user_names', 'hunt_select.user_ids', 'hunt_select.status')
            ->whereRaw('datediff(now(), jobs.created_at) < 30')
            ->orderBy('jobs.created_at', 'desc')->get();
        return response($data);
    }

    public function getPersonalResultTarget() {
        $year = request()->input('year');
        $user = Session::get('id');
        $rt = ResultTarget::where('user_id', $user)->where('year', $year)->get();
        $rc = ResultUser::select(DB::raw('max(user_id) as user_id, date_format(max(date), "%Y-%m") as month, sum(user_result) as count'))
            ->where('user_id', $user)->whereRaw('date_format(date, "%Y") = '.$year.'')
            ->groupBy(DB::raw('date_format(date, "%Y-%m")'))->get();
        return response(["rt"=>$rt, "rc"=>$rc]);
    }

    public function getTeamResultTarget() {
        $year = request()->input('year');
        $user_id = Session::get('id');
        $power = Session::get('power');
        $users = User::select('id', 'group_id', 'area_id')->where('status', 1);
        if ($power < 10) {
            $belong = Belongs::where('user_id', $user_id)->first();
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
                    $users = $users->where('id', $user_id);
                }
            } else {
                $users = $users->where('id', $user_id);
            }
        }
        $users = $users->get();
        $uids = array();
        foreach($users as $u) {
            if (!($u->id == $user_id && ($power == 3 || $power == 7))) array_push($uids, $u->id);
        }
        if (sizeof($uids) > 0) {
            $uids = join(',', $uids);
            $rt = ResultTarget::select(DB::raw('sum(target) as target, max(area) as area, max(year) as year'))->where('year', $year)->whereRaw('user_id in (' . $uids . ')')->groupBy('area')->get();
            $rc = ResultUser::select(DB::raw('max(user_id) as user_id, date_format(max(date), "%Y-%m") as month, sum(user_result) as count'))
                ->whereRaw('date_format(date, "%Y") = ' . $year . '')->whereRaw('user_id in (' . $uids . ')')
                ->groupBy(DB::raw('date_format(date, "%Y-%m")'))->get();
        } else {
            $rt = [];
            $rc = [];
        }
        return response(["rt"=>$rt, "rc"=>$rc, "ids"=>$uids]);
    }

    public function getRecentFaceList() {
        $face = HuntFace::where('created_by', Session::get('id'))
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($face);
    }

    public function getRecentOfferList() {
        $offer = HuntReport::where('created_by', Session::get('id'))
            ->where('type', 'offer')
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getRecentSuccessList() {
        $offer = HuntSuccess::where('created_by', Session::get('id'))
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getRecentHuntList() {
        $hs = DB::table('hunt_count')->whereRaw('locate(concat(",", ?, ","), concat(",", user_ids, ",")) > 0 and datediff(now(), updated_at) < 30', [Session::get('id')])->orderBy('updated_at', 'desc')->get();

        return response($hs);
    }

    public function getRecentHuntPerson() {
        $hunt = DB::table('hunt_person_status')
            ->join('person', 'hunt_person_status.person_id', '=', 'person.id')
            ->select('hunt_person_status.id', 'person.id as person_id', 'person.name', 'hunt_person_status.company_name', 'hunt_person_status.job_name', 'person.sex', 'person.age', 'person.degree', 'person.tel', 'hunt_person_status.user_name', 'hunt_person_status.updated_at', 'hunt_person_status.reported', 'hunt_person_status.faced', 'hunt_person_status.offered', 'hunt_person_status.succeed')
            ->where('hunt_person_status.user_id', Session::get('id'))
            ->whereRaw('datediff(now(), hunt_person_status.updated_at) < 30')
            ->where('hunt_person_status.deleted_at', null)
            ->orderBy('hunt_person_status.updated_at', 'desc')->get();
        return response($hunt);
    }

    public function getNoticeJsonList() {
        $user_id = Session::get('id');
        $hunt_success = HuntSuccess::where('created_by', $user_id)->whereRaw('datediff(now(), protected) >= -30 and datediff(now(), protected) <= 0')->get();
        $invoice = Invoice::where('request_user', $user_id)->where('status', '未付')->whereRaw('datediff(now(), estimate_date) >= -10')->get();
        return response([$hunt_success, $invoice]);
    }

    public function getKpiJsonData() {
        $user = Session::get('id');
        $power = Session::get('power');
        $month = request()->input('month');
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';

        $users = User::select('id', 'group_id', 'area_id')->where('status', 1);
        if ($power < 10) {
            $belong = Belongs::where('user_id', $user)->first();
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
                    $users = $users->where('id', $user);
                }
            } else {
                $users = $users->where('id', $user);
            }
        }
        $users = $users->get();
        $uids = array();
        foreach($users as $u) {
            array_push($uids, $u->id);
        }
        if (sizeof($uids) > 0) {
            $uids = join(',', $uids);
            $team_target = MonthTarget::select(DB::raw('sum(bd_target) as bd_target, sum(person_target) as person_target, sum(report_target) as report_target, sum(face_target) as face_target, sum(offer_target) as offer_target, sum(success_target) as success_target, max(month) as month'))
                ->where('month', $month)->whereRaw('user_id in (' . $uids . ')')->groupBy('month')->first();
            $team_result = User::select(DB::raw('(select count(bd.id) from bd where user_id in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as bd_count,
                (select count(jobs.id) from jobs where created_by in ('.$uids.') and deleted_at is null and created_at >= "'.$sdate.'" and created_at <= "'.$edate.'") as job_count,
                (select count(bd.id) from bd where user_id in ('.$uids.') and status = "签约合作" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as bds_count,
                (select count(distinct(hunt.job_id)) from hunt where user_id in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as hunt_count,
                (select count(hunt.person_id) from hunt where user_id in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as person_count,
                (select count(hunt_report.id) from hunt_report where created_by in ('.$uids.') and type = "report" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as report_count,
                (select count(hunt_face.id) from hunt_face where created_by in ('.$uids.') and type = "一面" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'" and (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0) as face_count,
                (select count(hunt_face.id) from hunt_face where created_by in ('.$uids.') and type <> "一面" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'" and (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0) as faces_count,
                (select count(hunt_report.id) from hunt_report where created_by in ('.$uids.') and type = "offer" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as offer_count,
                (select count(hunt_success.id) from hunt_success where created_by in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as success_count'))
                ->whereRaw('users.id in ('.$uids.')')->first();
        } else {
            $team_target = '';
            $team_result = '';
        }

        $person_target = MonthTarget::where('user_id', $user)->where('month', $month)->first();
        $person_result = User::select(DB::raw('(select count(bd.id) from bd where user_id = users.id and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as bd_count,
            (select count(jobs.id) from jobs where created_by = users.id and deleted_at is null and created_at >= "'.$sdate.'" and created_at <= "'.$edate.'") as job_count,
            (select count(bd.id) from bd where user_id = users.id and status = "签约合作" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as bds_count,
            (select count(distinct(hunt.job_id)) from hunt where user_id = users.id and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as hunt_count,
            (select count(hunt.person_id) from hunt where user_id = users.id and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as person_count,
            (select count(hunt_report.id) from hunt_report where created_by = users.id and type = "report" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as report_count,
            (select count(hunt_face.id) from hunt_face where created_by = users.id and type = "一面" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'" and (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0) as face_count,
            (select count(hunt_face.id) from hunt_face where created_by = users.id and type <> "一面" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'" and (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0) as faces_count,
            (select count(hunt_report.id) from hunt_report where created_by = users.id and type = "offer" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as offer_count,
            (select count(hunt_success.id) from hunt_success where created_by = users.id and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as success_count'))
            ->where('users.id', $user)->first();

        return response(["person_target"=>$person_target, "team_target"=>$team_target, "person_result"=>$person_result, "team_result"=>$team_result]);
    }

    public function getRecentHuntData() {
        $user = Session::get('id');
        $power = Session::get('power');
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';

        $users = User::select('id', 'group_id', 'area_id')->where('status', 1);
        if ($power < 10) {
            $belong = Belongs::where('user_id', $user)->first();
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
                    $users = $users->where('id', $user);
                }
            } else {
                $users = $users->where('id', $user);
            }
        }
        $users = $users->get();
        $uids = array();
        foreach($users as $u) {
            array_push($uids, $u->id);
        }
        $person_hunts = Hunt::join('person', 'person.id', '=', 'hunt.person_id')
            ->select('hunt.id', 'person.name', 'person.sex', 'person.tel', 'person.job', 'person.company', 'hunt.job_name', 'hunt.company_name', 'hunt.description', 'hunt.created_at')
            ->where('hunt.created_by', $user)
            ->where('hunt.created_at', '>=', $sdate)
            ->where('hunt.created_at', '<=', $edate)
            ->orderBy('hunt.created_at', 'desc')
            ->get();
        if (sizeof($uids) > 0) {
            $uids = join(',', $uids);
            $team_hunts = Hunt::join('person', 'person.id', '=', 'hunt.person_id')
                ->select('hunt.id', 'person.name', 'person.sex', 'person.tel', 'person.job', 'person.company', 'hunt.job_name', 'hunt.company_name', 'hunt.description', 'hunt.created_at')
                ->whereRaw('hunt.created_by in (' . $uids . ')')
                ->where('hunt.created_at', '>=', $sdate)
                ->where('hunt.created_at', '<=', $edate)
                ->orderBy('hunt.created_at', 'desc')
                ->get();
        } else {
            $team_hunts = [];
        }
        return response(["person"=>$person_hunts, "team"=>$team_hunts]);
    }

    public function getKpiViewData() {
        $user = Session::get('id');
        $power = Session::get('power');
        $field = request()->input('field');
        $target = request()->input('target');
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';

        if ($target == 'person') {
            $uids = $user;
        } else {
            $users = User::select('id', 'group_id', 'area_id')->where('status', 1);
            if ($power < 10) {
                $belong = Belongs::where('user_id', $user)->first();
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
                        $users = $users->where('id', $user);
                    }
                } else {
                    $users = $users->where('id', $user);
                }
            }
            $users = $users->get();
            $uids = array();
            foreach($users as $u) {
                array_push($uids, $u->id);
            }
            $uids = join(',', $uids);
        }

//        if (sizeof($uids) > 0) {
//            $uids = join(',', $uids);
//            $team_result = User::select(DB::raw('(select count(bd.id) from bd where user_id in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as bd_count,
//                (select count(jobs.id) from jobs where created_by in ('.$uids.') and deleted_at is null and created_at >= "'.$sdate.'" and created_at <= "'.$edate.'") as job_count,
//                (select count(bd.id) from bd where user_id in ('.$uids.') and status = "签约合作" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as bds_count,
//                (select count(distinct(hunt.job_id)) from hunt where user_id in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as hunt_count,
//                (select count(hunt.person_id) from hunt where user_id in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as person_count,
//                (select count(hunt_report.id) from hunt_report where created_by in ('.$uids.') and type = "report" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as report_count,
//                (select count(hunt_face.id) from hunt_face where created_by in ('.$uids.') and type = "一面" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'" and (select count(hunt_records.id) from hunt_records where hunt_records.hunt_id = hunt_face.hunt_id) > 0) as face_count,
//                (select count(hunt_report.id) from hunt_report where created_by in ('.$uids.') and type = "offer" and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as offer_count,
//                (select count(hunt_success.id) from hunt_success where created_by in ('.$uids.') and deleted_at is null and date >= "'.$sdate.'" and date <= "'.$edate.'") as success_count'))
//                ->whereRaw('users.id in ('.$uids.')')->first();
//        }

        if ($field == 'bd') {
            $result = Bd::select(DB::raw('company_name, user_name, date, created_at'))
                ->whereRaw('user_id in ('.$uids.')')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'job') {
            $result = Job::select(DB::raw('name as job_name, company_name, (select nickname from users where users.id = jobs.created_by) as user_name, created_at'))
                ->whereRaw('created_by in ('.$uids.')')
                ->where('created_at', '>=', $sdate)
                ->where('created_at', '<=', $edate)
                ->get();
        } else if ($field == 'bds') {
            $result = Bd::select(DB::raw('name as job_name, company_name, (select nickname from users where users.id = jobs.created_by) as user_name, created_at'))
                ->whereRaw('user_id in ('.$uids.')')
                ->where('status', '签约合作')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'hunt') {
            $result = Hunt::select(DB::raw('max(job_name) as job_name, max(company_name) as company_name, min(date) as date, min(created_at) as created_at'))
                ->whereRaw('user_id in ('.$uids.')')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->groupBy('job_id')
                ->get();
        } else if ($field == 'person') {
            $result = Hunt::select(DB::raw('job_name, company_name, person_name, (select nickname from users where users.id = hunt.user_id) as user_name, date, created_at'))
                ->whereRaw('user_id in ('.$uids.')')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'report') {
            $result = HuntReport::select(DB::raw('job_name, company_name, person_name, (select nickname from users where users.id = hunt_report.created_by) as user_name, date, created_at'))
                ->whereRaw('created_by in ('.$uids.')')
                ->where('type', 'report')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'face') {
            $result = HuntFace::select(DB::raw('job_name, (select company_name from jobs where jobs.id = hunt_face.job_id) as company_name, person_name, (select nickname from users where users.id = hunt_face.created_by) as user_name, date, created_at'))
                ->whereRaw('created_by in ('.$uids.')')
                ->where('type', '一面')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'faces') {
            $result = HuntFace::select(DB::raw('job_name, (select company_name from jobs where jobs.id = hunt_face.job_id) as company_name, person_name, (select nickname from users where users.id = hunt_face.created_by) as user_name, date, created_at'))
                ->whereRaw('created_by in ('.$uids.')')
                ->where('type', '<>', '一面')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'offer') {
            $result = HuntReport::select(DB::raw('job_name, company_name, person_name, (select nickname from users where users.id = hunt_report.created_by) as user_name, date, created_at'))
                ->whereRaw('created_by in ('.$uids.')')
                ->where('type', 'offer')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else if ($field == 'success') {
            $result = HuntSuccess::select(DB::raw('job_name, company_name, person_name, (select nickname from users where users.id = hunt_success.created_by) as user_name, date, created_at'))
                ->whereRaw('created_by in ('.$uids.')')
                ->where('date', '>=', $sdate)
                ->where('date', '<=', $edate)
                ->get();
        } else {
            $result = [];
        }

        return response($result);
    }

}
