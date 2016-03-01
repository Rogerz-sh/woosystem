<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Hunt;
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
        $hunt = Hunt::all();
        return response($hunt);
    }

    public function getCreate() {
        return view('hunt.create')->with('navIndex', 5);
    }

    public function getJsonJobListData() {
        $job = DB::table('jobs')->select('id', 'name', 'company_id', 'company_name')->where('deleted_at', null)->get();
        return response($job);
    }

    public function postSaveInfo() {
        $newHunt = request()->input('hunt');
        $hunt = new Hunt();
        foreach ($newHunt as $key=>$value) {
            $hunt->$key = $value;
        }
        $hunt->created_by = Session::get('id');
        $hunt->save();
        return response($hunt->id);
    }

    public function getEdit($id) {
        $hunt = Hunt::find($id);
        return view('hunt.edit')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function postSaveEdit() {
        $newHunt = request()->input('hunt');
        $hunt = Hunt::find($newHunt['id']);
        foreach ($newHunt as $key=>$value) {
            $hunt->$key = $value;
        }
        $hunt->updated_by = Session::get('id');
        $hunt->save();
        return response($hunt->id);
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
        $hunt_id = request()->input('hunt_id');
        $filePath = request()->input('filePath');
        $fileDesc = request()->input('fileDesc');
        $newPath = str_replace('temp', 'real', $filePath);
        if (Storage::exists($filePath)) {
            Storage::move($filePath, $newPath);
            $file = new HuntFile();
            $file->hunt_id = $hunt_id;
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
