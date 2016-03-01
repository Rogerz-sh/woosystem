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
        $data = Job::all();
        return response($data);
    }

    public function getCreate () {
        return view('job.create')->with('navIndex', 3);
    }

    public function getCompanyList() {
        $company = DB::table('company')->select('id', 'name')->get();
        return response($company);
    }

    public function postSaveNew () {
        $newJob = request()->input('job');
        $job = new Job();
        foreach ($newJob as $key=>$value) {
            $job->$key = $value;
        }
        $job->created_by = Session::get('id');
        $job->save();
        return response($job->id);
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
        $job = Job::find($editJob['id']);
        foreach ($editJob as $key=>$value) {
            $job->$key = $value;
        }
        $job->updated_by = Session::get('id');
        $job->save();
        return response($job->id);
    }

    public function getDetail($id) {
        $job = Job::find($id);
        return view('job.detail')->with('navIndex', 3)->with('job', $job);
    }

//    public function postDelete ($id) {
//        $job = VirtualJob::find($id);
//        $job->delete();
//        return response($job->id);
//    }
}
