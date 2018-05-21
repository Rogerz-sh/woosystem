<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobDynamic extends Model
{
    use SoftDeletes;

    protected $table = 'job_dynamic';
}
