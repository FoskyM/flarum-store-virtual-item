<?php

namespace Xypp\StoreVirtualItem\Api\Controller;
use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Xypp\StoreVirtualItem\Api\Serializer\VirtualItemSerializer;
use Xypp\StoreVirtualItem\VirtualItem;

class ListVirtualItemController extends AbstractListController
{

    public $serializer = VirtualItemSerializer::class;

    protected function data(ServerRequestInterface $request, $document)
    {
        RequestUtil::getActor($request)->assertAdmin();
        $offset = Arr::get($request->getQueryParams(), 'offset', 0);
        $name = Arr::get($request->getQueryParams(), 'name');
        $key = Arr::get($request->getQueryParams(), 'key');

        $query = VirtualItem::query();
        if ($name) {
            $query->where('name', $name);
        }
        if ($key) {
            $query->where('key', $key);
        }
        return $query->skip($offset)->take(50)->get();
    }

}