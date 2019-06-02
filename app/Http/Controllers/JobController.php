<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\Job;
use App\Company;
use App\JobDynamic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;


class JobController extends BaseController {

    public function getIndex () {
        return view('job.index')->with('navIndex', 3);
    }

    public function getList() {
        return view('job.index')->with('navIndex', 3);
    }

    public function getJsonJobListData () {
        $data = Job::join('company', 'jobs.company_id', '=', 'company.id')
            ->join('users', 'users.id', '=', 'jobs.created_by')
            ->leftJoin('job_types', 'jobs.type_id', '=', 'job_types.id')
            ->leftJoin('hunt_select', 'jobs.id', '=', 'hunt_select.job_id')
            ->select('jobs.id', 'jobs.name', 'users.nickname', 'jobs.type_id', 'job_types.name as type_name', 'job_types.parentid as type_parent', 'jobs.company_id', 'jobs.company_name', 'company.industry', 'jobs.salary', 'jobs.area', 'jobs.sellpoint', 'jobs.created_at', 'jobs.updated_at', 'jobs.created_by', 'hunt_select.user_names', 'hunt_select.user_ids', 'hunt_select.status')
            //->whereNotNull('hunt_select.status')
            ->orderBy('jobs.created_at', 'desc')->get();
        return response($data);
    }

    public function getCreate () {
        return view('job.create')->with('navIndex', 3);
    }

    public function getCompanyList() {
        $company = DB::table('company')->where('deleted_at', null)->select('id', 'name')->orderBy('created_at', 'desc')->get();
        return response($company);
    }

    public function postSaveNew () {
        $newJob = request()->input('job');
        $exist = DB::table('jobs')->where('deleted_at', null)->where('name', $newJob['name'])->where('company_id', $newJob['company_id'])->first();
        if ($exist) {
            return response('您选择的企业已经有相同的职位名称了');
        } else {
            $job = new Job();
            foreach ($newJob as $key => $value) {
                $job->$key = $value;
            }
            $job->created_by = Session::get('id');
            $job->save();
            return response($job->id);
        }
    }

    public function getEdit ($id) {
        return view('job.edit')->with('navIndex', 3)->with('id', $id);
    }

    public function getJobJsonData () {
        $id = request()->input('id');
        $job = Job::find($id);
        $aggregate = Job::select(DB::raw('jobs.id, jobs.name,
            (select count(hunt_report.id) from hunt_report where hunt_report.job_id = jobs.id and type = "report" and deleted_at is null) as report_count,
            (select count(hunt_face.id) from hunt_face where hunt_face.job_id = jobs.id and deleted_at is null) as face_count,
            (select count(hunt_report.id) from hunt_report where hunt_report.job_id = jobs.id and type = "offer" and deleted_at is null) as offer_count,
            (select count(hunt_success.id) from hunt_success where hunt_success.job_id = jobs.id and deleted_at is null) as success_count'))
            ->where('jobs.id', $id)->first();
        $job->aggregates = $aggregate;
        return response($job);
    }

    public function postSaveEdit() {
        $editJob = request()->input('job');
        $exist = DB::table('jobs')
            ->where('deleted_at', null)
            ->where('name', $editJob['name'])
            ->where('company_id', $editJob['company_id'])
            ->where('id', '<>', $editJob['id'])->first();
        if ($exist) {
            return response('您选择的企业已经有相同的职位名称了');
        } else {
            $job = Job::find($editJob['id']);
            foreach ($editJob as $key => $value) {
                $job->$key = $value;
            }
            $job->updated_by = Session::get('id');
            $job->save();
            return response($job->id);
        }
    }

    public function getDetail($id) {
        $job = Job::find($id);
        return view('job.detail')->with('navIndex', 3)->with('job', $job);
    }

    public function postDelete ($id) {
        $job = Job::find($id);
        $job->delete();
        return response($job->id);
    }

    //job dynamics operations
    public function getJsonJobDynamicData() {
        $job_id = request()->input('job_id');
        $dynamics = JobDynamic::where('job_id', $job_id)->get();
        return response($dynamics);
    }

    public function postAddJobDynamic() {
        $newDynamic = request()->input('dynamic');
        $dynamic = new JobDynamic();
        foreach ($newDynamic as $key => $value) {
            $dynamic->$key = $value;
        }
        $dynamic->created_by = Session::get('id');
        $dynamic->save();
        return response($dynamic->id);
    }

    public function postDelJobDynamic () {
        $id = request()->input('id');
        $dynamic = JobDynamic::find($id);
        $dynamic->delete();
        return response($dynamic->id);
    }

    public function getJsonTypesList() {
        $types = DB::table('job_types')->get();
        return response($types);
    }

    public function getJsonTypesData() {
        $id = request()->input('id');
        $type = DB::table('job_types')->where('id', $id)->get();
        return response($type);
    }
}
