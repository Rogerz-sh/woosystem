<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Routing\Controller as BaseController;
use App\Menu;
use App\User;

class AccountController extends BaseController {
    public function postLogin () {
        $name = request()->input('name');
        $password = request()->input('password');

        $user = User::where('name', $name)->where('password', md5($password))->where('status', 1)->first();

        if ($user) {
            Session::set('id', $user->id);
            Session::set('name', $user->name);
            Session::set('nickname', $user->nickname);
            Session::set('power', $user->power);

            return response(['status'=>1, 'err_code'=>'-1', 'err_msg'=>'']);
        } else {
            return response(['status'=>0, 'err_code'=>'not found', 'err_msg'=>'用户名或密码不正确']);
        }
    }

    public function getLogout() {
        Session::flush();
        return redirect('/user/login');
    }

    public function postRegister() {
        $name = request()->input('name');
        $nickname = request()->input('nickname');
        $email = request()->input('email');
        $password = request()->input('password');

        $ret = ['status'=>1, 'err_code'=>'-1', 'err_msg'=>''];

        if (!isset($name) || !isset($nickname) || !isset($email) || !isset($password)) {
            $ret['status'] = 0;
            $ret['err_code'] = 'params missed';
            $ret['err_msg'] = '参数缺失';
        } else {
            $count = User::where('email', '=', $email)->count();

            if ($count === 0) {
                $user = new User();
                $user->name = $name;
                $user->nickname = $nickname;
                $user->email = $email;
                $user->password = md5($password);
                $user->save();
            } else {
                $ret['status'] = 0;
                $ret['err_code'] = 'email exist';
                $ret['err_msg'] = '邮箱已经被注册';
            }
        }
        return response($ret);
    }
}

class MenuData {

    public static function jsonMenu() {
        $menus = Menu::where('depth', 1)->where('status', 1)->where('belong', 'user')->get();
        $submenus = Menu::where('depth', 2)->where('status', 1)->where('belong', 'user')->get();

        function getSubs($subs, $mid) {
            $submenu = array();
            foreach ($subs as $sub) {
                if ($sub->parent_id == $mid) {
                    array_push($submenu, $sub);
                }
            }
            return $submenu;
        }

        $subList = array();

        foreach ($menus as $menu) {
            $subList[$menu->id] = getSubs($submenus, $menu->id);
        }

        return ['menus' => $menus, 'submenus' => $subList];
    }

}