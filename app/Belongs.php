<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Belongs extends Model
{
    //use SoftDeletes;
    protected $table = 'belongs';

}
