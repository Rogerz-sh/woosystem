<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Http\Requests\Request;
use App\User;
use Illuminate\Routing\Controller as BaseController;
use App\Message;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class FileController extends BaseController {

    public function postUpload() {
        $file = request()->file('file');
        $filename = date('Y-m-d-H-i-s');
        $extension = $file->getClientOriginalExtension();
        $path = 'upload/temp/'.date('Y').'/'.date('m');
        $saveName = $filename.'.'.$extension;
        $file->move($path, $saveName);

        return response('"/'.$path.'/'.$saveName.'"');
    }

    public function postUploadResume() {
        $file = request()->file('file');
        $filename = date('Y-m-d-H-i-s');
        $extension = $file->getClientOriginalExtension();
        $saveName = $filename.'.'.$extension;

        $user = Session::get('name');
        if (!isset($user)) {
            $user = 'guest';
        }
        $path = 'upload/resume/'.$user.'/'.date('Y').'/'.date('m');
        $file->move($path, $saveName);

        return response('"/'.$path.'/'.$saveName.'"');
    }

    public function postUploadUserSnap() {
        $file = request()->file('file');
        $sid = Session::get('id');
        $filename = 'head_pic_'.$sid;
        $extension = $file->getClientOriginalExtension();
        $saveName = $filename.'.'.$extension;
        $path = 'upload/user_snap';
        $file->move($path, $saveName);
        $user = User::find($sid);
        $user->picpath = '/'.$path.'/'.$saveName;
        $user->save();
        return response('"/'.$path.'/'.$saveName.'"');
    }

    public function getDownloadFile() {
        $path = substr(request()->input('path'), 1);
        $name = request()->input('name');
        $coded = request()->input('coded');

        if ($coded == 0) {
            return response()->download($path);
        } else {
            return response()->download($path, $name);
        }
    }
}
