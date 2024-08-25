<?php

namespace Xypp\StoreVirtualItem;
use Flarum\User\User;
use Xypp\Store\AbstractStoreProvider;
use Xypp\Store\Context\ExpireContext;
use Xypp\Store\Context\PurchaseContext;
use Xypp\Store\Context\UseContext;
use Xypp\Store\PurchaseHistory;
use Xypp\Store\StoreItem;

class VirtualItemProvider extends AbstractStoreProvider
{
    public $name = 'virtual-item';

    function expire(PurchaseHistory $item, ExpireContext $context): bool
    {
        if ($item->expired_at === null || $item->expired_at->isFuture()) {
            // User manually expire the item
            return true;
        }
        $context->setExpire(null);
        return false;
    }
    function purchase(StoreItem $item, User $user, PurchaseHistory|null $old = null, PurchaseContext $context): array|bool|string
    {
        $name = $item->provider_data;
        $item = VirtualItem::getAndAssign($name, $user);
        if ($item) {
            return $item->id;
        }
        $context->exceptionWith("xypp-store-virtual-item.api.no-available");
        return false;
    }
    function canPurchase(StoreItem $item, User $user): bool|string
    {
        return VirtualItem::where('name', $item->provider_data)->whereNull('assign_user_id')->exists();
    }
    function serializeHistory(PurchaseHistory $item): array
    {
        $virtualItem = VirtualItem::where('assign_history_id', $item->id)->first();
        if (!$virtualItem) {
            /**
             * @var StoreItem $storeItem 
             */
            $storeItem = $item->store_item()->first();
            $virtualItem = VirtualItem::lockForUpdate()->where('assign_user_id', $item->user_id)->where("name", $storeItem->provider_data)->first();
            $virtualItem->assign_history_id = $item->id;
            $virtualItem->save();
        }
        return [
            'id' => $virtualItem->id,
            'name' => $virtualItem->name,
            'content' => $virtualItem->content,
            'key' => $virtualItem->key,
            'created_at' => $virtualItem->created_at
        ];
    }
    function useItem(PurchaseHistory $item, User $user, string $data, UseContext $context): bool
    {
        $context->noConsume();
        return true;
    }
}