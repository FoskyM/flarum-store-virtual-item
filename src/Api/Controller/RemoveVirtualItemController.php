<?php

namespace Xypp\StoreVirtualItem\Api\Controller;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Locale\Translator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Xypp\StoreVirtualItem\Api\Serializer\VirtualItemSerializer;
use Xypp\StoreVirtualItem\VirtualItem;
class RemoveVirtualItemController extends AbstractDeleteController
{
    public $serializer = VirtualItemSerializer::class;

    protected function delete(ServerRequestInterface $request)
    {
        RequestUtil::getActor($request)->assertAdmin();
        $id = Arr::get($request->getQueryParams(), 'id');
        if (!$id) {
            $id = Arr::get($request->getParsedBody(), 'ids');
        }
        if (!$id) {
            throw new ValidationException(["msg" => "id is empty"]);
        }
        if (!is_array($id)) {
            $id = [$id];
        }
        VirtualItem::whereIn('id', $id)->delete();
    }
}