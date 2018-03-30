<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResultUser extends Model
{
    use SoftDeletes;

    protected $table = 'result_users';
}
