<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BdFile extends Model
{
    use SoftDeletes;

    protected $table = 'bd_files';
}
