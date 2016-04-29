<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Bd;
use App\BdFile;
use App\BdRecord;
use App\Candidate;
use App\User;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class BdController extends BaseController {

    public function getIndex () {
        return view('bd.list')->with('navIndex', 4);
    }

    public function getList() {
        return view('bd.list')->with('navIndex', 4);
    }

    public function getJsonBdListData() {
        $uid = request()->input('user_id');
        if (isset($uid)) {
            $bd = Bd::where('user_id', $uid)->orderBy('created_at', 'desc')->get();
        } else {
            $bd = Bd::orderBy('created_at', 'desc')->get();
        }
        return response($bd);
    }

    public function getCreate() {
        return view('bd.create')->with('navIndex', 4);
    }

    public function getUserList() {
        $persons = User::where('id', '<>', Session::get('id'))->get();
        return response($persons);
    }

    public function postSaveInfo() {
        $newBd = request()->input('bd');
        $exist = Bd::where('company_id', $newBd['company_id'])->first();
        if ($exist) {
            return response('该企业已经在BD中，请不要重复操作');
        } else {
            $bd = new Bd();
            foreach ($newBd as $key => $value) {
                $bd->$key = $value;
            }
            $bd->user_id = Session::get('id');
            $bd->user_name = Session::get('nickname');
            $bd->created_by = Session::get('id');
            $bd->save();
            return response($bd->id);
        }
    }

    public function getEdit($id) {
        $bd = Bd::find($id);
        return view('bd.edit')->with('navIndex', 4)->with('bd', $bd);
    }

    public function getBdJsonData () {
        $id = request()->input('id');
        $bd = Bd::find($id);
        return response($bd);
    }

    public function postSaveEdit() {
        $newBd = request()->input('bd');
        $exist = Bd::where('company_id', $newBd['company_id'])
            ->where('id', '<>', $newBd['id'])->first();
        if ($exist) {
            return response('该企业已经在BD中，请不要重复操作');
        } else {
            $bd = Bd::find($newBd['id']);
            foreach ($newBd as $key => $value) {
                $bd->$key = $value;
            }
            $bd->updated_by = Session::get('id');
            $bd->save();
            return response($bd->id);
        }
    }

    public function getRecord($id) {
        $bd = Bd::find($id);
        return view('bd.record')->with('navIndex', 4)->with('bd', $bd);
    }

    public function getRecordList() {
        $bd_id = request()->input('bd_id');
        $records = DB::table('bd_records')->where('bd_id', $bd_id)->where('deleted_at', null)->get();
        return response($records);
    }

    public function postAddRecord() {
        $rec = request()->input('record');
        $record = new BdRecord();
        foreach ($rec as $key=>$value) {
            $record->$key = $value;
        }
        $record->save();
        return response($record);
    }

    public function getFileList() {
        $bd_id = request()->input('bd_id');
        $files = DB::table('bd_files')->where('bd_id', $bd_id)->where('deleted_at', null)->get();
        return response($files);
    }

    public function postAddFile() {
        $file = request()->input('file');
        $filePath = $file['path'];
        $newPath = str_replace('temp', 'real', $filePath);
        if (Storage::exists($filePath)) {
            Storage::move($filePath, $newPath);
            $bdFile = new BdFile();
            foreach ($file as $key=>$value) {
                $bdFile->$key = $value;
            }
            $bdFile->path = $newPath;
            $bdFile->created_by = Session::get('id');
            $bdFile->save();
            return response($bdFile->id);
        } else {
            return response(0);
        }
    }

    public function postDelete($id) {
        $bd = Bd::find($id);
        $bd->delete();
    }
}
