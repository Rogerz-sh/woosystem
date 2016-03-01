<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Http\Requests\Request;
use Illuminate\Routing\Controller as BaseController;
use App\Message;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class FileController extends BaseController {

    public function postUpload() {
        $file = request()->file('file');
        $name = $file->getClientOriginalName();
        $path = 'upload/temp/'.date('Y');
        $file->move($path, $name);

        return response('"/'.$path.'/'.$name.'"');
    }
}
