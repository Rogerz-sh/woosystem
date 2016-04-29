<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\HuntSelect;
use App\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use App\HuntRecord;
use App\HuntFile;

class HuntController extends BaseController {

    public function getIndex () {
        return view('hunt.list')->with('navIndex', 5);
    }

    public function getList() {
        return view('hunt.list')->with('navIndex', 5);
    }

    public function getJsonHuntListData() {
        if (Session::get('power') == 9) {
            $hunt = Hunt::orderBy('created_at', 'desc')->get();
        } else {
            $hunt = Hunt::where('user_id', Session::get('id'))->get();
        }
        return response($hunt);
    }

    public function getCreate() {
        return view('hunt.create')->with('navIndex', 5);
    }

    public function getJsonJobListData() {
        $job = DB::table('jobs')->select('id', 'name', 'company_id', 'company_name')->where('deleted_at', null)
            ->orderBy('created_at', 'desc')->get();
        return response($job);
    }

    public function getJsonCandidateListData() {
        $filter = request()->input('filter');
        if ($filter) {
            $key = $filter['filters'][0]['value'];
            $job = DB::table('person')
                ->select('id', 'name', 'real_id', 'job', 'company', 'sex', 'age')
                ->orWhereRaw('name like ? or job like ? or company like ?', ['%'.$key.'%', '%'.$key.'%', '%'.$key.'%'])
                ->where('deleted_at', null)
                ->orderBy('created_at', 'desc')->get();
            return response($job);
        } else {
            $job = DB::table('person')->select('id', 'name', 'real_id', 'job', 'company', 'sex',
                'age')->where('deleted_at', null)->orderBy('created_at', 'desc')->get();
            return response($job);
        }
    }

    public function postSaveNew() {
        $newHunt = request()->input('hunt');
        $exist = DB::table('hunt')->where('deleted_at', null)->where('job_id', $newHunt['job_id'])->where('person_id', $newHunt['person_id'])->first();
        if ($exist) {
            return response('该岗位已经推荐过该候选人，请不要重复操作');
        } else {
            $hunt = new Hunt();
            foreach ($newHunt as $key => $value) {
                $hunt->$key = $value;
            }
            $hunt->user_id = Session::get('id');
            $hunt->user_name = Session::get('nickname');
            $hunt->created_by = Session::get('id');
            $hunt->save();
            return response($hunt->id);
        }
    }

    public function getEdit($id) {
        $hunt = Hunt::find($id);
        return view('hunt.edit')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function getHuntJsonData () {
        $id = request()->input('id');
        $hunt = Hunt::find($id);
        return response($hunt);
    }

    public function postSaveEdit() {
        $newHunt = request()->input('hunt');
        $exist = DB::table('hunt')->where('deleted_at', null)
            ->where('job_id', $newHunt['job_id'])->where('person_id', $newHunt['person_id'])
            ->where('id', '<>', $newHunt['id'])->first();
        if ($exist) {
            return response('该岗位已经推荐过该候选人，请不要重复操作');
        } else {
            $hunt = Hunt::find($newHunt['id']);
            foreach ($newHunt as $key => $value) {
                $hunt->$key = $value;
            }
            $hunt->updated_by = Session::get('id');
            $hunt->save();
            return response($hunt->id);
        }
    }

    public function getRecord($id) {
        $hunt = Hunt::find($id);
        return view('hunt.record')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function getRecordList() {
        $hunt_id = request()->input('hunt_id');
        $records = DB::table('hunt_records')->where('hunt_id', $hunt_id)->where('deleted_at', null)->get();
        return response($records);
    }

    public function postAddRecord() {
        $rec = request()->input('record');
        $record = new HuntRecord();
        foreach ($rec as $key=>$value) {
            $record->$key = $value;
        }
        $record->save();
        return response($record);
    }

    public function getFileList() {
        $hunt_id = request()->input('hunt_id');
        $files = DB::table('hunt_files')->where('hunt_id', $hunt_id)->where('deleted_at', null)->get();
        return response($files);
    }

    public function postAddFile() {
        $file = request()->input('file');
        $filePath = $file['path'];
        $newPath = str_replace('temp', 'real', $filePath);
        if (Storage::exists($filePath)) {
            Storage::move($filePath, $newPath);
            $huntFile = new HuntFile();
            foreach ($file as $key=>$value) {
                $huntFile->$key = $value;
            }
            $huntFile->path = $newPath;
            $huntFile->created_by = Session::get('id');
            $huntFile->save();
            return response($huntFile->id);
        } else {
            return response(0);
        }
    }

    public function getPersonHuntList() {
        $id = request()->input('person_id');
        $list = Hunt::where('person_id', $id)->get();
        return response($list);
    }

    public function getJobHuntList() {
        $id = request()->input('job_id');
        $list = DB::table('hunt')
        ->join('person', 'hunt.person_id', '=', 'person.id')
        ->where('hunt.deleted_at', null)
        ->where('job_id', $id)
//        ->select('hunt.id', 'person.real_id', 'person.name', 'person.age', 'person.sex', 'person.job_name', 'person.year')
        ->get();
        return response($list);
    }

    public function postDelete($id) {
        $hunt = Hunt::find($id);
        $hunt->delete();
    }

    public function postSaveReport() {
        $rpt = request()->input('report');
        $oldRpt = HuntReport::where('hunt_id', $rpt['hunt_id'])->where('type', $rpt['type'])->first();
        if ($oldRpt) {
            foreach ($rpt as $key => $value) {
                $oldRpt->$key = $value;
            }
            $oldRpt->save();
            return response($oldRpt->id);
        } else {
            $newRpt = new HuntReport();
            foreach ($rpt as $key => $value) {
                $newRpt->$key = $value;
            }
            $newRpt->save();
            return response($newRpt->id);
        }
    }

    public function getHuntReportJsonData() {
        $hunt_id = request()->input('hunt_id');
        $type = request()->input('type');
        $rpt = HuntReport::where('hunt_id', $hunt_id)->where('type', $type)->orderBy('created_at', 'desc')->first();
        return response($rpt);
    }

    public function postSaveFace() {
        $face = request()->input('face');
        $newFace = new HuntFace();
        foreach ($face as $key => $value) {
            $newFace->$key = $value;
        }
        $newFace->save();
        return response($newFace->id);
    }

    public function getFaceList() {
        $hunt_id = request()->input('hunt_id');
        $face = HuntFace::where('hunt_id', $hunt_id)->get();
        return response($face);
    }

    //职位分配相关操作
    public function getJsonHuntSelectListData() {
        if (Session::get('power') == 9) {
            $hs = HuntSelect::all();
        } else {
            $hs = HuntSelect::whereRaw('locate(? + ",", concat(user_ids, ",")) > 0', [Session::get('id')])->get();
        }
        return response($hs);
    }

    public function getJsonHuntSelectJobData() {
        $job_id = request()->input('job_id');
        $hunt = Hunt::where('job_id', $job_id)->get();
        return response($hunt);
    }

    public function getHuntSelectJsonData () {
        $id = request()->input('id');
        $hs = HuntSelect::find($id);
        return response($hs);
    }

    public function getUserList() {
        $user = User::all();
        return response($user);
    }

    public function postSaveSelectNew() {
        $newHs = request()->input('hs');

        $exist = DB::table('hunt_select')->where('deleted_at', null)->where('job_id', $newHs['job_id'])->first();
        if ($exist) {
            return response('该岗位已经分配过了，请不要重复分配');
        } else {
            $hs = new HuntSelect();
            foreach ($newHs as $key => $value) {
                $hs->$key = $value;
            }
            $hs->save();
            return response($hs->id);
        }
    }

    public function postSaveSelectEdit() {
        $newHs = request()->input('hs');
        $exist = DB::table('hunt_select')->where('deleted_at', null)
            ->where('job_id', $newHs['job_id'])
            ->where('id', '<>', $newHs['id'])->first();
        if ($exist) {
            return response('该岗位已经分配过了，请不要重复分配');
        } else {
            $hs = HuntSelect::find($newHs['id']);
            foreach ($newHs as $key => $value) {
                $hs->$key = $value;
            }
            $hs->save();
            return response($hs->id);
        }
    }
}
