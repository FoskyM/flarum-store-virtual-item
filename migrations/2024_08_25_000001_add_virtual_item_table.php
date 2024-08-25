<?php

use Illuminate\Database\Schema\Blueprint;

use Flarum\Database\Migration;

return Migration::createTable(
    'virtual_item',
    function (Blueprint $table) {
        $table->increments('id');
        $table->timestamps();
        $table->string('name');
        $table->string('key');
        $table->text('content')->nullable();
        $table->integer('assign_user_id')->unsigned()->nullable()->default(null);
        $table->integer('assign_history_id')->unsigned()->nullable()->default(null);
        $table->foreign('assign_user_id')->references('id')->on('users')->onDelete('SET NULL');
        $table->foreign('assign_history_id')->references('id')->on('purchase_history')->onDelete('SET NULL');
        $table->unique(['key']);
    }
);