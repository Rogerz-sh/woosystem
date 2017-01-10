<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Candidate;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\HuntSelect;
use App\HuntSuccess;
use App\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use App\HuntRecord;
use App\HuntFile;

class PerformanceController extends BaseController {

    public function getJsonHuntListData() {
        if (Session::get('power') == 9) {
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
        $result = DB::table('users')
            ->select(DB::raw('users.id, users.name, users.nickname,
            (select count(id) from person where person.created_by = users.id and person.created_at >= "'.$sdate.'" and person.created_at <= "'.$edate.'" and deleted_at is null) as person_count,
            (select count(distinct hunt_id) from hunt_face where hunt_face.created_by = users.id and hunt_face.date >= "'.$sdate.'" and hunt_face.date <= "'.$edate.'" and deleted_at is null) as face_count,
            (select count(id) from hunt_report where hunt_report.created_by = users.id and type = "report" and hunt_report.updated_at >= "'.$sdate.'" and hunt_report.updated_at <= "'.$edate.'" and deleted_at is null) as report_count,
            (select count(id) from hunt_report where hunt_report.created_by = users.id and type = "offer" and hunt_report.updated_at >= "'.$sdate.'" and hunt_report.updated_at <= "'.$edate.'" and deleted_at is null) as offer_count,
            (select count(id) from hunt_success where hunt_success.created_by = users.id and hunt_success.updated_at >= "'.$sdate.'" and hunt_success.updated_at <= "'.$edate.'" and deleted_at is null) as success_count
            '))
            ->where('users.deleted_at', null)
            ->where('users.status', '1')
//            ->where('id', Session::get('id'))
            ->get();

        return response($result);
    }

    public function getJsonDetailList() {
        $id = request()->input('id');
        $field = request()->input('field');
        $sdate = request()->input('sdate').' 00:00:00';
        $edate = request()->input('edate').' 23:59:59';
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
                ->where('updated_at', '>=', $sdate)
                ->where('updated_at', '<=', $edate)
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
                ->where('updated_at', '>=', $sdate)
                ->where('updated_at', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'success_count') {
            $result = HuntSuccess::where('created_by', $id)
                ->where('updated_at', '>=', $sdate)
                ->where('updated_at', '<=', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        return response([]);
    }

    public function getJsonTargetList() {
        if (Session::get('power') != '9') {
            $targets = DB::table('month_target')->join('users', 'month_target.user_id', '=', 'users.id')
                ->select('month', 'user_id', 'nickname', 'person_target', 'report_target', 'face_target', 'offer_target', 'success_target')
                ->where('user_id', Session::get('id'))->get();
        } else {
            $targets = DB::table('month_target')->join('users', 'month_target.user_id', '=', 'users.id')
                ->select('month', 'user_id', 'nickname', 'person_target', 'report_target', 'face_target', 'offer_target', 'success_target')->get();
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
        $target = DB::table('month_target')->where('user_id', Session::get('id'))->where('month', $month['month'])->first();
        if ($target) {
            DB::table('month_target')->where('user_id', Session::get('id'))->where('month', $month['month'])->update(['person_target'=>$month['person'], 'report_target'=>$month['report'], 'face_target'=>$month['face'], 'offer_target'=>$month['offer'], 'success_target'=>$month['success']]);
        } else {
            DB::table('month_target')->insert(['user_id'=>Session::get('id'), 'month'=>$month['month'], 'person_target'=>$month['person'], 'report_target'=>$month['report'], 'face_target'=>$month['face'], 'offer_target'=>$month['offer'], 'success_target'=>$month['success']]);
        }

        $days = request()->input('days');
        $sqls = array();
        for ($i = 0; $i < sizeof($days); $i++) {
            $day = $days[$i];
            $sql = ['user_id'=>Session::get('id'), 'date'=>$day['date'], 'month'=>$month['month'], 'person_target'=>$day['tp'], 'report_target'=>$day['tr'], 'face_target'=>$day['tf'], 'offer_target'=>$day['tf'], 'success_target'=>$day['ts']];
            array_push($sqls, $sql);
        }
        DB::table('day_target')->where('user_id', Session::get('id'))->where('month', $month['month'])->delete();
        DB::table('day_target')->insert($sqls);
        return response(sizeof($sqls));
    }
}
