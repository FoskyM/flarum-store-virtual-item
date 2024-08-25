import app from 'flarum/admin/app';
import adminPage from './components/adminPage';

app.initializers.add('xypp/store-virtual-item', () => {
  app.extensionData
    .for('xypp-store-virtual-item')
    .registerPage(adminPage);
});
