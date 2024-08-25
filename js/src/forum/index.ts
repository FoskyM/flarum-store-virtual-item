import app from 'flarum/forum/app';
import { initStore } from './storeBox';

app.initializers.add('xypp/store-virtual-item', () => {
  initStore();
});
