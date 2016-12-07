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
            (select count(id) from person where person.created_by = users.id and person.created_at > "'.$sdate.'" and person.created_at < "'.$edate.'" and deleted_at is null) as person_count,
            (select count(id) from hunt_face where hunt_face.created_by = users.id and hunt_face.updated_at > "'.$sdate.'" and hunt_face.updated_at < "'.$edate.'" and deleted_at is null) as face_count,
            (select count(id) from hunt_report where hunt_report.created_by = users.id and type = "report" and hunt_report.updated_at > "'.$sdate.'" and hunt_report.updated_at < "'.$edate.'" and deleted_at is null) as report_count,
            (select count(id) from hunt_report where hunt_report.created_by = users.id and type = "offer" and hunt_report.updated_at > "'.$sdate.'" and hunt_report.updated_at < "'.$edate.'" and deleted_at is null) as offer_count,
            (select count(id) from hunt_success where hunt_success.created_by = users.id and hunt_success.updated_at > "'.$sdate.'" and hunt_success.updated_at < "'.$edate.'" and deleted_at is null) as success_count
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
        $sdate = request()->input('sdate');
        $edate = request()->input('edate');
        if ($field == 'person_count') {
            $result = Candidate::where('created_by', $id)
                ->where('created_at', '>', $sdate)
                ->where('created_at', '<', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'report_count') {
            $result = HuntReport::where('created_by', $id)
                ->where('type', 'report')
                ->where('updated_at', '>', $sdate)
                ->where('updated_at', '<', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'face_count') {
            $result = HuntFace::where('created_by', $id)
                ->where('updated_at', '>', $sdate)
                ->where('updated_at', '<', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'offer_count') {
            $result = HuntReport::where('created_by', $id)
                ->where('type', 'offer')
                ->where('updated_at', '>', $sdate)
                ->where('updated_at', '<', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        if ($field == 'success_count') {
            $result = HuntSuccess::where('created_by', $id)
                ->where('updated_at', '>', $sdate)
                ->where('updated_at', '<', $edate)
                ->orderBy('updated_at', 'desc')->get();
            return response($result);
        }
        return response([]);
    }
}
