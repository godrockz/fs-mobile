/**
 * some color helper tools found mostly @ stackoverflow
 * <p/>
 * Created by Benjamin Jacob on 26.03.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services')
    .service('Colors', function () {

        var svc = {
            /**
             *
             * @source: http://snipplr.com/view/14590/hsv-to-rgb/
             * HSV to RGB color conversion
             *
             * H runs from 0 to 360 degrees
             * S and V run from 0 to 100
             *
             * Ported from the excellent java algorithm by Eugene Vishnevsky at:
             * http://www.cs.rit.edu/~ncs/color/t_convert.html
             *
             * @param h hue 0 - 360 degrees
             * @param s saturation 0 - 100 %
             * @params b brightness 0-100%
             *
             */
            hsb2rgb: function (h, s, v) {
                var r, g, b;
                var i;
                var f, p, q, t;

                // Make sure our arguments stay in-range
                h = Math.max(0, Math.min(360, h));
                s = Math.max(0, Math.min(100, s));
                v = Math.max(0, Math.min(100, v));

                // We accept saturation and value arguments from 0 to 100 because that's
                // how Photoshop represents those values. Internally, however, the
                // saturation and value are calculated from a range of 0 to 1. We make
                // That conversion here.
                s /= 100;
                v /= 100;

                if (s === 0) {
                    // Achromatic (grey)
                    r = g = b = v;
                    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
                }

                h /= 60; // sector 0 to 5
                i = Math.floor(h);
                f = h - i; // factorial part of h
                p = v * (1 - s);
                q = v * (1 - s * f);
                t = v * (1 - s * (1 - f));

                switch (i) {
                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;

                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;

                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;

                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;

                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;

                    default: // case 5:
                        r = v;
                        g = p;
                        b = q;
                }

                var rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
                return '#' + svc.pad(rgb[0].toString(16), 2, 0) + svc.pad(rgb[1].toString(16), 2, 0) + svc.pad(rgb[2].toString(16), 2, 0);
            },

            /**
             *
             * @param hex a hex string
             * @returns {{h: number, s: number, v: number}}
             */
            rgb2hsv: function (hex) {
                var num = parseInt(hex.slice(1), 16),
                /* jshint -W016 */
                    R = (num >> 16),
                    G = (num >> 8 & 0x00FF),
                    B = (num & 0x0000FF);
                var rr, gg, bb,
                    r = R / 255,
                    g = G / 255,
                    b = B / 255,
                    h, s,
                    v = Math.max(r, g, b),
                    diff = v - Math.min(r, g, b),
                    diffc = function (c) {
                        return (v - c) / 6 / diff + 1 / 2;
                    };

                if (diff === 0) {
                    h = s = 0;
                } else {
                    s = diff / v;
                    rr = diffc(r);
                    gg = diffc(g);
                    bb = diffc(b);

                    if (r === v) {
                        h = bb - gg;
                    } else if (g === v) {
                        h = (1 / 3) + rr - bb;
                    } else if (b === v) {
                        h = (2 / 3) + gg - rr;
                    }
                    if (h < 0) {
                        h += 1;
                    } else if (h > 1) {
                        h -= 1;
                    }
                }
                return {
                    h: Math.round(h * 360),
                    s: Math.round(s * 100),
                    v: Math.round(v * 100)
                };
            },

            pad: function (n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            },

            contrastColor: function(hex){
                var num = parseInt(hex.slice(1),16),
                /* jshint -W016 */
                    R = (num >> 16),
                    G = (num >> 8 & 0x00FF),
                    B = (num & 0x0000FF);

                var brightness;
                brightness = (R * 299) + (G * 587) + (B * 114);
                brightness = brightness / 255000;

                // values range from 0 to 1
                // anything greater than 0.5 should be bright enough for dark text
                if (brightness >= 0.5) {
                    return svc.shade(hex,-100);
                } else {
                    return svc.shade(hex,100);
                }
            },

            shade: function(hex, percent){
                /* jshint -W016 */
                var num = parseInt(hex.slice(1),16),
                    amt = Math.round(2.55 * percent),
                    R = (num >> 16) + amt,
                    G = (num >> 8 & 0x00FF) + amt,
                    B = (num & 0x0000FF) + amt;
                return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
            }
        };
        return svc;
    });
