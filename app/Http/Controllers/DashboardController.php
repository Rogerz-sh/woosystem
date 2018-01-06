<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\HuntFace;
use App\HuntReport;
use App\Job;
use App\HuntSuccess;
use App\Invoice;
use App\ResultTarget;
use App\ResultUser;
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
        $hunt_success = HuntSuccess::where('created_by', $user_id)->whereRaw('datediff(now(), protected) >= -7 and datediff(now(), protected) <= 0')->get();
        $invoice = Invoice::where('request_user', $user_id)->where('status', '未付')->whereRaw('datediff(now(), estimate_date) >= -7 and datediff(now(), estimate_date) <= 30')->get();
        return response([$hunt_success, $invoice]);
    }
}
