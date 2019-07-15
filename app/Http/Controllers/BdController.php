<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Bd;
use App\BdCallIn;
use App\BdFile;
use App\BdRecord;
use App\Belongs;
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
        $power = Session::get('power');
        $bd = [];
        if (isset($uid)) {
            $bd = Bd::where('bd.user_id', $uid)
                ->select('bd.id', 'bd.name', 'bd.company_id', 'bd.company_name', 'bd.user_id', 'bd.user_name', 'bd.user_ids', 'bd.user_names', 'bd.date', 'bd.status', 'bd.type', 'bd.source', 'bd.belong', 'company.contact', 'company.industry', 'company.area', 'company.tel', 'bd.description', 'bd.file_path', 'bd.file_name', 'bd.file_coded')
                ->join('company', 'bd.company_id', '=', 'company.id')
                ->orderBy('bd.created_at', 'desc')->get();
        } else {
            if ($power < 10) {
                $belong = Belongs::where('user_id', Session::get('id'))->first();
                if ($belong) {
                    $path = Belongs::whereRaw('root_path like "' . $belong->root_path . '%"')->select('user_id')->get();
                    if (sizeof($path) > 0) {
                        $ids = '';
                        foreach ($path as $p) {
                            $ids = $ids.','.$p->user_id;
                        }
                        $ids = substr($ids, 1);
                        $bd = Bd::select('bd.id', 'bd.name', 'bd.company_id', 'bd.company_name', 'bd.user_id', 'bd.user_name', 'bd.user_ids', 'bd.user_names', 'bd.date', 'bd.status', 'bd.type', 'bd.source', 'bd.belong', 'company.contact', 'company.industry', 'company.area', 'company.tel', 'bd.description')
                            ->join('company', 'bd.company_id', '=', 'company.id')
                            ->whereRaw('bd.user_id in ('.$ids.')')
                            ->orderBy('bd.created_at', 'desc')->get();
                    }
                }
            } else {
                $bd = Bd::select('bd.id', 'bd.name', 'bd.company_id', 'bd.company_name', 'bd.user_id', 'bd.user_name', 'bd.user_ids', 'bd.user_names', 'bd.date', 'bd.status', 'bd.type', 'bd.source', 'bd.belong', 'company.contact', 'company.industry', 'company.area', 'company.tel', 'bd.description')
                    ->join('company', 'bd.company_id', '=', 'company.id')
                    ->orderBy('bd.created_at', 'desc')->get();
            }
        }
        return response($bd);
    }

    public function getCreate() {
        return view('bd.create')->with('navIndex', 4);
    }

    public function getUserList() {
        $persons = User::where('id', '<>', Session::get('id'))->where('status', '1')->get();
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

    public function getJsonCallInList() {
        $power = Session::get('power');
        if ($power >= 10 || $power == 2) {
            $call_in = BdCallIn::get();
        } else if ($power == 8 || $power == 9) {
            $user = User::find(Session::get('id'));
            if ($user->area_id == 1) {
                $area = '上海';
            } else if ($user->area_id == 2) {
                $area = '长沙';
            } else if ($user->area_id == 3) {
                $area = '武汉';
            } else {
                $area = '';
            }
            $call_in = BdCallIn::where('belong', $area)->get();
        } else {
            $call_in = [];
        }
        return response($call_in);
    }

    public function postSaveCallIn() {
        $new_call_in = request()->input('call_in');
        $exist = BdCallIn::where('company_name', $new_call_in['company_name'])->first();
        if ($exist) {
            return response('该企业已经录入，请不要重复操作');
        } else {
            $call_in = new BdCallIn();
            foreach ($new_call_in as $key => $value) {
                $call_in->$key = $value;
            }
            $call_in->created_by = Session::get('id');
            $call_in->save();
            return response($call_in->id);
        }
    }

    public function postEditCallIn() {
        $new_call_in = request()->input('call_in');
        $exist = BdCallIn::where('company_name', $new_call_in['company_name'])->where('id', '<>', $new_call_in['id'])->first();
        if ($exist) {
            return response('该企业已经录入，请不要重复操作');
        } else {
            $call_in = BdCallIn::find($new_call_in['id']);
            foreach ($new_call_in as $key => $value) {
                $call_in->$key = $value;
            }
            $call_in->updated_by = Session::get('id');
            $call_in->save();
            return response($call_in->id);
        }
    }

    public function postDeleteCallIn() {
        $id = request()->input('id');
        $call_in = BdCallIn::find($id);
        $call_in->delete();
        return response(1);
    }
}
