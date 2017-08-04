<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyReason extends Model
{
    use SoftDeletes;

    protected $table = 'daily_reason';
}
