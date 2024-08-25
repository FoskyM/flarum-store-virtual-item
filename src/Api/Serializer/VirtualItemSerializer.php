<?php

namespace Xypp\StoreVirtualItem\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Foundation\ValidationException;
use Xypp\Store\Api\Serializer\PurchaseHistorySerializer;
use Xypp\StoreVirtualItem\VirtualItem;

class VirtualItemSerializer extends AbstractSerializer
{
    protected $type = 'virtual-items';
    public function getDefaultAttributes($virtualItem)
    {
        if (!$virtualItem instanceof VirtualItem) {
            throw new ValidationException(["message" => "\$model is not instance of InvitedCode"]);
        }
        return [
            "id" => $virtualItem->id,
            "name" => $virtualItem->name,
            "content" => $virtualItem->content,
            "key" => $virtualItem->key,
            "created_at" => $virtualItem->created_at,
            "updated_at" => $virtualItem->updated_at,
            "assign_user_id" => $virtualItem->assign_user_id
        ];
    }
}