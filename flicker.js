/**
 * Created with JetBrains WebStorm.
 * User: Cris.dai
 * Date: 12-10-17
 * Time: 下午4:51
 * To change this template use File | Settings | File Templates.
 */

define(function (require) {
    'use strict';
    var jQuery = require('jquery');
    (function ($) {
        var FlickerAPI, //namespace
            defaults = {
                api_key: '14e9b89deffc8b144cc187f889e24c2e',
                api_url: 'api.flickr.com/services/rest/?',
                api_method: '',
                max: 10,
                params: [] //[{key, value}, {key, value}]
            },
            flicker_api = {
                api_methods: {
                    photosFind: 'flickr.photos.search'
                }
            },
            utility = {
                format: function (src) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    return src.replace(/\{(\d+)\}/g, function (m, i) {
                        return args[i];
                    });

                },
                getImageURL: function (options) {
                    var formatURL =  'http://farm{0}.staticflickr.com/{1}/{2}_{3}.jpg';
                    return utility.format(formatURL, options.farm, options.server, options.id, options.secret);
                },
                getRequestURL: function (options) {
                    var requestURL = 'http://{0}&method={1}&api_key={2}{3}&format=json&nojsoncallback=1',
                        format = utility.format,
                        params = $.map(options.params, function (elem, index) {
                            return format('&{0}={1}', elem.key, elem.value);
                        }).join('');
                    return format(requestURL, options.api_url, options.api_method, options.api_key, params);
                }
            };

        function getPhotosByTag(options, callback) {
            var api_methods = flicker_api.api_methods,
                findURL;
            options = $.extend(options, defaults);
            options.api_method = api_methods.photosFind;
            options.params = [{key: 'tags', value: options.tag},
                {key: 'per_page', value: options.max}
                ];
            //Initialize the find URL which will be used to make ajax request
            findURL = utility.getRequestURL(options);

            $.ajax({
                url: findURL,
                dataType: 'json',
                success: function (data) {
                    var photos = $.map(data.photos.photo, function (elem) {
                        return {
                            imageSrc: utility.getImageURL(elem)
                        };
                    });
                    callback(photos);
                }
            });
        }

        FlickerAPI = {
            getPhotosByTag : getPhotosByTag
        };

        $.FlickerAPI = FlickerAPI;

    }(jQuery));

    return jQuery;
});