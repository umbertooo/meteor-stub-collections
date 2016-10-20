widgets = new Mongo.Collection('widgets');
const schema = { schemaKey: { type: String, optional: true }};
widgets.attachSchema(new SimpleSchema(schema));
