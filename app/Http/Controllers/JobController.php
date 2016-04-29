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
        $data = Job::orderBy('created_at', 'desc')->get();
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
}
