import Extend from 'flarum/common/extenders';
import VirtualItem from './models/VirtualItem';
export default [
    new Extend.Store()
        .add('virtual-items', VirtualItem)
];