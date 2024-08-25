<?php

namespace Xypp\StoreVirtualItem\Api\Controller;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Psr\Http\Server\RequestHandlerInterface;
use Xypp\StoreVirtualItem\Api\Serializer\VirtualItemSerializer;
use Xypp\StoreVirtualItem\VirtualItem;
class AddVirtualItemController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $attributes = $request->getParsedBody();

        $name = Arr::get($attributes, 'name');
        if (!$name) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => 'name is empty'
            ]);
        }

        $data = Arr::get($attributes, 'data', []);

        if (!is_array($data)) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => 'data is not array'
            ]);
        }
        foreach ($data as $key => $value) {
            $item = new VirtualItem();
            $item->name = $name;
            $item->content = $value['content'];
            $item->key = $value['key'];
            $item->save();
        }
        return new JsonResponse([
            "success" => true
        ]);
    }
}