<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HuntFace extends Model
{
    use SoftDeletes;

    protected $table = 'hunt_face';
}
