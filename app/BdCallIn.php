<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BdCallIn extends Model
{
    use SoftDeletes;

    protected $table = 'call_in';
}
