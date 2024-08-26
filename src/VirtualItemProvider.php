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
        $name = json_decode($item->provider_data)->name;
        $item = VirtualItem::getAndAssign($name, $user);
        if ($item) {
            return $item->id;
        }
        $context->exceptionWith("xypp-store-virtual-item.api.no-available");
        return false;
    }
    function canPurchase(StoreItem $item, User $user): bool|string
    {
        $providerDef = json_decode($item->provider_data);
        if ($providerDef->rest) {
            $count = VirtualItem::where('name', $providerDef->name)->whereNull('assign_user_id')->count();
            $item->rest_cnt = $count;
            return $count > 0;
        }
        return VirtualItem::where('name', $providerDef->name)->whereNull('assign_user_id')->exists();
    }
    function serializeHistory(PurchaseHistory $item): array
    {
        $virtualItem = VirtualItem::where('id', $item->data)->first();
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