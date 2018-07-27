var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * JpPrice Model
 * ==========
 */
var JpPrice = new keystone.List('JpPrice', {
    track: true,
    noedit: true
    // map: {name: ''}
});

JpPrice.add({
  jpPrice: { type: Types.Number, required: true, index: true, initial: true },
  currency: { type: Types.Text, index: true, initial: true, required: true, default: 'NGN' },
  symbol: { type: Types.Text, index: true, initial: true },
  description: { type: Types.Text, index: true, initial: true },
});

/**
 * Registration
 */
JpPrice.defaultSort = '-createdAt';
JpPrice.defaultColumns = 'jpPrice, description, createdAt';
JpPrice.register();
