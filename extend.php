<?php

/*
 * This file is part of xypp/store-virtual-item.
 *
 * Copyright (c) 2024 小鱼飘飘.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Xypp\StoreVirtualItem;

use Flarum\Extend;
use Xypp\Store\Extend\StoreItemProvider;
use Xypp\StoreVirtualItem\Api\Controller\AddVirtualItemController;
use Xypp\StoreVirtualItem\Api\Controller\ListNamesController;
use Xypp\StoreVirtualItem\Api\Controller\ListVirtualItemController;
use Xypp\StoreVirtualItem\Api\Controller\RemoveVirtualItemController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),
    new Extend\Locales(__DIR__ . '/locale'),
    (new Extend\Routes('api'))
        ->get('/virtual-items-name', 'store.virtual-item.names', ListNamesController::class)
        ->get('/virtual-items', 'store.virtual-item.list', ListVirtualItemController::class)
        ->post('/virtual-items', 'store.virtual-item.add', AddVirtualItemController::class)
        ->delete('/virtual-items/{id}', 'store.virtual-item.remove', RemoveVirtualItemController::class)
        ->delete('/virtual-items', 'store.virtual-item.remove_batch', RemoveVirtualItemController::class),
    (new StoreItemProvider())
        ->provide(VirtualItemProvider::class),
];
