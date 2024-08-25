import Model from 'flarum/common/Model';

export default class VirtualItem extends Model {
  name = Model.attribute<string>('name');
  content = Model.attribute<string>('content');
  key = Model.attribute<string>('key');
  assign_user_id = Model.attribute<number>('assign_user_id');
}