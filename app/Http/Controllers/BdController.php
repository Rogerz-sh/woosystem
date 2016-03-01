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
        $bd = Bd::all();
        return response($bd);
    }

    public function getCreate() {
        return view('bd.create')->with('navIndex', 4);
    }

    public function postSaveInfo() {
        $newBd = request()->input('bd');
        $bd = new Bd();
        foreach ($newBd as $key=>$value) {
            $bd->$key = $value;
        }
        $bd->created_by = Session::get('id');
        $bd->save();
        return response($bd->id);
    }

    public function getEdit($id) {
        $bd = Bd::find($id);
        return view('bd.edit')->with('navIndex', 4)->with('bd', $bd);
    }

    public function postSaveEdit() {
        $newBd = request()->input('bd');
        $bd = Bd::find($newBd['id']);
        foreach ($newBd as $key=>$value) {
            $bd->$key = $value;
        }
        $bd->updated_by = Session::get('id');
        $bd->save();
        return response($bd->id);
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
        $bd_id = request()->input('bd_id');
        $filePath = request()->input('filePath');
        $fileDesc = request()->input('fileDesc');
        $newPath = str_replace('temp', 'real', $filePath);
        if (Storage::exists($filePath)) {
            Storage::move($filePath, $newPath);
            $file = new BdFile();
            $file->bd_id = $bd_id;
            $file->path = $newPath;
            $file->desc = $fileDesc;
            $file->created_by = Session::get('id');
            $file->save();
            return response($file->id);
        } else {
            return response(0);
        }
    }

    public function getDownloadFile() {
        $path = request()->input('path');
        $content = Storage::get($path);
        $name = request()->input('name');

//        header('Content-Type:image/gif'); //指定下载文件类型
        header('Content-Disposition: attachment; filename="'.$name.'"'); //指定下载文件的描述
        header('Content-Length:'.filesize($name)); //指定下载文件的大小

        readfile($name);
    }
}
