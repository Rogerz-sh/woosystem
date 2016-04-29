<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HuntReport extends Model
{
    use SoftDeletes;

    protected $table = 'hunt_report';
}
