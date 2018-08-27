const PrintfulClient = require("../printful_config/printfulclient.js");
const states = require("us-state-codes");
const assert = require("assert");

const key = process.env.PRINTFUL_API_KEY;

//product type poster-enhanced-matte-paper-poster 18X24 ID: 1

const ok_callback = function(data, info) {
  console.log("SUCCESS");
  console.log(data);
  if (info.total_items) {
    console.log("Total items available: " + info.total_items);
  }
  //   res.json(info);
};

const error_callback = function(message, info) {
  console.log("ERROR " + message);
  console.log(info.response_raw);
};

const state_code_converter = function(state) {
  if (state.length > 2) {
    return states.getStateCodeByStateName(state);
  } else {
    return states.sanitizeStateCode(state);
  }
};

const pf = new PrintfulClient(key);

module.exports = function(app) {
  app.post("/printful-create-order", (req, res) => {
    pf.post("orders", {
      recipient: {
        name: req.body.name,
        address1: req.body.address,
        city: req.body.city,
        state_code: state_code_converter(req.body.state),
        country_code: "US",
        zip: req.body.zipcode
      },
      items: req.body.items
    })
      .success(order => {
        res.json(order);
      })
      .error(error_callback);
  });

  app.post("/printful-confirm-order/:id", (req, res) => {
    console.log("req.body in order confirm route", req.body);
    pf.post(`orders/${req.params.id}/confirm`)
      .success(success => {
        res.json({ status: success });
      })
      .error(error_callback);
  });
};
//Get information about the store
// pf.get('store').success(ok_callback).error(error_callback);

//Get file list
// pf.get("files")
//   .success(ok_callback)
//   .error(error_callback);

//Get product list
// pf.get('products').success(ok_callback).error(error_callback);

//Get variants for product 10
//pf.get('products/10').success(ok_callback).error(error_callback);

//Get information about Variant 1007
//pf.get('products/variant/1007').success(ok_callback).error(error_callback);

//Select 10 latest orders and get the total number of orders
//pf.get('orders',{limit: 10}).success(ok_callback).error(error_callback);

//Select order with ID 12345 (Replace with your order's ID)
//pf.get('orders/12345').success(ok_callback).error(error_callback);

//Select order with External ID 9900999 (Replace with your order's External ID)
//pf.get('orders/@9900999').success(ok_callback).error(error_callback);

//Confirm order with ID 12345 (Replace with your order's ID)
//pf.post('orders/12345/confirm').success(ok_callback).error(error_callback);

//Cancel order with ID 12345 (Replace with your order's ID)
//pf.delete('orders/23479').success(ok_callback).error(error_callback);

//Create an order

// pf.post('orders',
//     {
//         recipient:  {
//             name: 'John Doe',
//             address1: '19749 Dearborn St',
//             city: 'Chatsworth',
//             state_code: 'CA',
//             country_code: 'US',
//             zip: '91311'
//         },
//         items: [
//             {
//                 variant_id: 1, //Small poster
//                 name: 'Niagara Falls poster', //Display name
//                 retail_price: '19.99', //Retail price for packing slip
//                 quantity: 1,
//                 files: [
//                     {id: 69103565}
//                 ]
//             }
//         ]
//      }
// ).success(ok_callback).error(error_callback);

// response object =>
//     SUCCESS
// { id: 10289134,
//   external_id: null,
//   store: 874426,
//   status: 'draft',
//   error: null,
//   shipping: 'USPS_FIRST',
//   created: 1532979289,
//   updated: 1532979289,
//   recipient:
//    { name: 'John Doe',
//      company: null,
//      address1: '19749 Dearborn St',
//      address2: null,
//      city: 'Chatsworth',
//      state_code: 'CA',
//      state_name: 'California',
//      country_code: 'US',
//      country_name: 'United States',
//      zip: '91311',
//      phone: null,
//      email: null },
//   estimated_fulfillment: null,
//   notes: null,
//   activities:
//    [ { type: 'created',
//        time: 1532979289,
//        note: null,
//        message: 'Order created via API' } ],
//   items:
//    [ { id: 6624961,
//        external_id: null,
//        variant_id: 1,
//        quantity: 1,
//        price: '13.00',
//        retail_price: '19.99',
//        name: 'Niagara Falls poster',
//        product: [Object],
//        files: [Array],
//        options: [],
//        sku: null,
//        discontinued: false,
//        out_of_stock_eu: false,
//        out_of_stock: false } ],
//   is_sample: false,
//   needs_approval: false,
//   needs_approval_eu: false,
//   not_synced: false,
//   has_discontinued_items: false,
//   can_change_hold: true,
//   eu_route_required: false,
//   eu_routed: false,
//   costs:
//    { currency: 'USD',
//      subtotal: '13.00',
//      discount: '0.00',
//      shipping: '3.70',
//      digitization: '0.00',
//      additional_fee: '0.00',
//      fulfillment_fee: '0.00',
//      tax: '1.90',
//      vat: '0.00',
//      total: '18.60' },
//   retail_costs:
//    { currency: 'USD',
//      subtotal: '19.99',
//      discount: '0.00',
//      shipping: '3.70',
//      tax: '0.00',
//      vat: '0.00',
//      total: '23.69' },
//   shipments: [],
//   gift: null,
//   packing_slip: null,
//   dashboard_url: 'https://www.printful.com/dashboard?order_id=10289134' }

//Create an order and confirm immediately
/*
    pf.post('orders',
        {
            recipient:  {
                name: 'John Doe',
                address1: '19749 Dearborn St',
                city: 'Chatsworth',
                state_code: 'CA',
                country_code: 'US',
                zip: '91311'
            },
            items: [
                {
                    variant_id: 1, //Small poster
                    name: 'Niagara Falls poster', //Display name
                    retail_price: '19.99', //Retail price for packing slip
                    quantity: 1,
                    files: [
                        {url: 'http://example.com/files/posters/poster_1.jpg'}
                    ]
                }
            ]
        },
        {confirm: 1}
    ).success(ok_callback).error(error_callback);
*/

//Calculate shipping rates for an order
/*
    pf.post('shipping/rates',{
        recipient: {
            country_code: 'US',
            state_code: 'CA'
        },
        items: [
           {variant_id: 1,  quantity: 1}, //Small poster
           {variant_id: 1118, quantity: 2} //Alternative T-Shirt
        ]
    }).success(ok_callback).error(error_callback);
*/
