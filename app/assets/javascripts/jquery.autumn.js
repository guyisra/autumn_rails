/*! autumn - v0.0.1 - 2014-07-02
* https://github.com/guyisra/autumn
* Copyright (c) 2014 Guy Israeli; Licensed MIT */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
  'use strict';
    // Create the defaults once
    var pluginName = "autumn",
        defaults = {
          container: "map",
          scrollWheenZoom: false,
          center: [51.1788, -1.8262], //stonehenge, that's why
          maxZoom: 10,
          tiles_url: "http://{s}.tiles.mapbox.com/v3/<MAP ID>/{z}/{x}/{y}.png",
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        },
        map,
        layer =  new L.layerGroup(); // TODO this better...

    // The actual plugin constructor
    function Autumn ( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Autumn.prototype = {
        init: function () {
            map = L.map(this.element.id,this.options).setView(this.options.center, 17);
            this._map = map;
            L.tileLayer(this.options.tiles_url, { attribution: this.options.attribution, maxZoom: this.options.maxZoom
                                                      }).addTo(map);
        },
        addMarker: function ( latLng, name) {
          L.marker(latLng).addTo(map);
        },
        deleteMarkers: function(layerGroup){
          if (layerGroup){
            map.removeLayer(layerGroup)
          }
          else{
            map.removeLayer(layer);
            layer = new L.LayerGroup();
          }
        }
    };


    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.autumn_map = function(){
      return $(this).data("plugin_autumn")._map;
    }

    $.fn.autumn = function (method, options ) {
      var _ = this;
      var a = $(this).data("plugin_autumn");

        if (typeof(method) === 'object'){
          options = method;
        }
        if (method === undefined || $.type(method) != "string"){
          method = 'null';
        }

        switch(method){
          case 'null':
            return _.each(function() {
                if ( !$.data( this, "plugin_autumn" ) ) {
                    $.data( this, "plugin_autumn", new Autumn( this, options ) );
                }
            });
          case 'addMarker':
            var markers; // marker: {latLng, }
            if (!$.isArray(options.markers[0])){ //single markers
              if (typeof(options.markers[0]) == "string"){
                markers = [JSON.parse(options.markers)];
              }
              else{
                markers = [options.markers];
              }
            }
            else{
              markers = options.markers; //many markers
            }
            $.each(markers, function(index){
              L.marker(this).addTo(layer);
            });
            layer.addTo(map)
            return this;
          case 'deleteMarkers':
            a.deleteMarkers();
            return this;
      }

    };


})( jQuery, window, document );
