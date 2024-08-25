<?php

namespace Xypp\StoreVirtualItem\Api\Controller;
use Flarum\Http\RequestUtil;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Xypp\StoreVirtualItem\VirtualItem;

class ListNamesController implements RequestHandlerInterface
{

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();
        $itemCollection = VirtualItem::groupBy('name')->selectRaw('count(id) as count, name')->get();

        return new JsonResponse(array_map(function ($item) {
            return [
                'name' => $item['name'],
                'count' => $item['count']
            ];
        }, $itemCollection->toArray()));
    }
}