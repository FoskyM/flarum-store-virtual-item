<?php

namespace Xypp\StoreVirtualItem;
use Flarum\Database\AbstractModel;
use Flarum\User\User;

/**
 * @property int $id 
 * @property int $assign_history_id
 * @property string $name
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property string $content
 * @property string $key
 */
class VirtualItem extends AbstractModel
{
    protected $table = 'virtual_item';
    protected $dates = ['created_at', 'updated_at'];

    public function assign_user()
    {
        return $this->belongsTo('Flarum\User\User', 'assign_user_id');
    }

    public static function getAndAssign(string $name, User $user): ?self
    {
        $item = self::lockForUpdate()->where('name', $name)->whereNull('assign_user_id')->first();
        if ($item) {
            $item->assign_user_id = $user->id;
            $item->save();
            return $item;
        }
        return null;
    }
}