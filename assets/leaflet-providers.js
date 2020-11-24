(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['leaflet'], factory);
	} else if (typeof modules === 'object' && module.exports) {
		// define a Common JS module that relies on 'leaflet'
		module.exports = factory(require('leaflet'));
	} else {
		// Assume Leaflet is loaded into global object L already
		factory(L);
	}
}(this, function (L) {
	'use strict';

	L.TileLayer.Provider = L.TileLayer.extend({
		initialize: function (arg, options) {
			var providers = L.TileLayer.Provider.providers;

			var parts = arg.split('.');

			var providerName = parts[0];
			var variantName = parts[1];

			if (!providers[providerName]) {
				throw 'No such provider (' + providerName + ')';
			}

			var provider = {
				url: providers[providerName].url,
				options: providers[providerName].options
			};

			// overwrite values in provider from variant.
			if (variantName && 'variants' in providers[providerName]) {
				if (!(variantName in providers[providerName].variants)) {
					throw 'No such variant of ' + providerName + ' (' + variantName + ')';
				}
				var variant = providers[providerName].variants[variantName];
				var variantOptions;
				if (typeof variant === 'string') {
					variantOptions = {
						variant: variant
					};
				} else {
					variantOptions = variant.options;
				}
				provider = {
					url: variant.url || provider.url,
					options: L.Util.extend({}, provider.options, variantOptions)
				};
			}

			// If retina option is set
			if (provider.options.retina) {
				// Check retina screen
				if (options.detectRetina && L.Browser.retina) {
					// The retina option will be active now
					// But we need to prevent Leaflet retina mode
					options.detectRetina = false;
				} else {
					// No retina, remove option
					provider.options.retina = '';
				}
			}

			// replace attribution placeholders with their values from toplevel provider attribution,
			// recursively
			var attributionReplacer = function (attr) {
				if (attr.indexOf('{attribution.') === -1) {
					return attr;
				}
				return attr.replace(/\{attribution.(\w*)\}/,
					function (match, attributionName) {
						return attributionReplacer(providers[attributionName].options.attribution);
					}
				);
			};
			provider.options.attribution = attributionReplacer(provider.options.attribution);

			// Compute final options combining provider options with any user overrides
			var layerOpts = L.Util.extend({}, provider.options, options);
			L.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
		}
	});

	/**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */
	
	var iconPackage = ' 📦 '
	var iconMap = ' 🗺️ '
	var iconHouse = ' 🏠 '
	var iconRocket = ' 🚀 '
	var iconCopyright = ' ©️ '
	var iconScroll = ' 📜 '
	var iconTool = ' 🔧 '
	var iconHand = ' 🖐️ '
	var iconHeart = ' ❤️ '

	var leafletLink = 'href="https://leafletjs.com" title="Leaflet, bibliothèque JavaScript libre de cartographie en ligne" target="_blank"'
	var osmLink = 'href="https://www.openstreetmap.org" title="données par &copy les contributeurs & contributrices OpenStreetMap" target="_blank"'
	var copyLink = 'href="https://www.openstreetmap.org/copyright" title="Droits d’auteur et licence OpenStreetMap" target="_blank"'
	var fixLink = 'href="https://www.openstreetmap.org/fixthemap" title="Améliorer la cartographie OpenStreetMap" target="_blank"'
	var joinLink = 'href="https://join.osmfoundation.org/" title="Adhérer à la fondation OpenStreetMap" target="_blank"'
	var donateLink = 'href="https://donate.openstreetmap.org/" title="Faire un don" target="_blank"'
	var odblLink = 'href="https://opendatacommons.org/licenses/odbl/1.0/" title="Open Database License (ODbL) v1.0" target="_blank"'
	var ccbysa2Link = 'href="https://creativecommons.org/licenses/by-sa/2.0/deed.fr" title="Licence Creative Commons - Attribution - Partage dans les Mêmes Conditions 2.0" target="_blank"'
	var ccby3Link = 'href="https://creativecommons.org/licenses/by/3.0/deed.fr" title="Licence Creative Commons - Attribution 3.0" target="_blank"'
	var ccby4Link = 'href="https://creativecommons.org/licenses/by/4.0/deed.fr" title="Licence Creative Commons - Attribution 4.0 International" target="_blank"'
	var cc0Link = 'href="https://creativecommons.org/publicdomain/zero/1.0/deed.fr" title="Licence CC0 1.0 universel - Transfert dans le Domaine Public" target="_blank"'
	var osmfrLink = 'href="https://www.openstreetmap.fr/mentions-legales/"" title="OpenStreetMap France - mentions légales" target="_blank"'
	var humanitarianLink = 'href="https://www.hotosm.org/updates/2013-09-29_a_new_window_on_openstreetmap_data" title="Couche humanitaire par Yohan Boniface et HOT" target="_blank"'
	var bzhLink = 'href="http://www.openstreetmap.bzh/" title="OpenStreetMap en breton" target="_blank"'
	var osmseLink = 'href="https://openstreetmap.se/om" title="OpenStreetMap Sverige (Suède)" target="_blank"'
	var stamenLink = 'href="https://maps.stamen.com/" title="Stamen Design" target="_blank"'
	var cartodbLink = 'href="https://carto.com/legal/" title="Carto" target="_blank"'
	var cyclosmLink = 'href="https://www.cyclosm.org" title="CyclOSM" target="_blank"'
	
	var copyrightOSM = 
		' <nobr><a ' + copyLink + '>' + iconCopyright + '<b>' + 
		'<p class="long">les contributeurs & contributrices</p>' +
		'<p class="med">les contributeurs</p>' +
		'<p class="short">contributeurs</p>' +
		' OpenStreetMap</b></a></nobr> '
	var data = function (link, attribution) {
		return ' <nobr>' + 
			'<p class="long"><a ' + link + '>' + iconPackage + '</a><b>données</b> par </p>' +
			'<p class="med"><a ' + link + '>' + iconPackage + '</a><b>données</b> </p>' +
			'<p class="short"><a ' + link + '>' + iconPackage + '</a></p>' +
			attribution + '</nobr> ';
	};
	var tiles = function (link, name) {
		return ' <nobr><a ' + link + '>' + iconMap + '</a>' + 
			'<p class="long"><b>fond de carte</b> par </p>' +
			'<p class="med"><b>fond de carte</b> </p>' + 
			'<a ' + link + '><b>' + name + '</b></a></nobr> ';
	};
	var hosting = function (link, name) {
		return ' <nobr><a ' + link + '>' + iconHouse + '</a>' + 
			'<p class="long">hébergé par </p>' +
			'<p class="med">hébergé </p>' +
			'<a ' + link + '><b>' + name + '</b></a></nobr> ';
	};
	var license = function (link, under, type, name) {
		return ' <nobr>' + under + '<a ' + link + '>' +
			'<p class="short">' + iconScroll + '</p>' +
			'<p class="mini">' + iconScroll + '</p>' +
			type + name + '</a></nobr> ';
	};

	var licenceLibre = 
		'<p class="long">licence libre </p>' +
		'<p class="med">licence </p>'
	var licencePublic = 
		'<p class="long">licence domaine public </p>' +
		'<p class="med">licence </p>'
	var nonCommercial = 
		'<p class="long">libre pour un usage non-commercial</p>' +
		'<p class="med">usage non-commercial</p>' +
		'<p class="short">non-commercial</p>'
	var under = 
		'<p class="long"> sous </p>' +
		'<p class="med"> sous </p>'
	var odbl = license(odblLink, under, licenceLibre, 'ODbL')
	var ccbysa2 = license(ccbysa2Link, under, licenceLibre, 'CC BY-SA')
	var ccby3 = license(ccby3Link, under, licenceLibre, 'CC BY')
	var ccby4 = license(ccby4Link, under, licenceLibre, 'CC BY')
	var cc0 = license(cc0Link, under, licencePublic, 'CC0')
	
	var osmfrTiles =
		'<p class="long">OpenStreetMap France</p>' +
		'<p class="med">OSM France</p>' +
		'<p class="short">OSM France</p>' +
		'<p class="mini">OSM-FR</p>'
	var osmfrHosting =
		'<p class="long">OSM France</p>' +
		'<p class="med">OSM France</p>' +
		'<p class="short">OSM-FR</p>' +
		'<p class="mini">OSM-FR</p>'
	var osmbzh = 
		'<p class="long">OpenStreetMap e brezhoneg</p>' +
		'<p class="med">OSM e brezhoneg</p>' +
		'<p class="short">OSM e brezhoneg</p>' +
		'<p class="mini">OSM-bzh</p>'
	var humanitarianName =
		'<p class="long"><nobr>Yohan Boniface</nobr> & <nobr>Humanitarian OpenStreetMap Team</nobr></p>' +
		'<p class="med"><nobr>Y. Boniface</nobr> & <nobr>Humanitarian OpenStreetMap Team</nobr></p>' +
		'<p class="short"><nobr>Y. Boniface</nobr> & HOT</p>' +
		'<p class="mini"><nobr>Y.Bon.</nobr> & HOT</p>'
	var osmse = 
		'<p class="long">OpenStreetMap Sverige (Suède)</p>' +
		'<p class="med">OpenStreetMap Sverige (Suède)</p>' +
		'<p class="short">OSM Sverige (Suède)</p>' +
		'<p class="mini">OSM Suède</p>'
 	var cyclosmName =
		'<p class="long">les contributeurs CyclOSM</p>' +
		'<p class="med">contributeurs CyclOSM</p>' +
		'<p class="short">contributeurs CyclOSM</p>' +
		'<p class="mini">CyclOSM</p>'

	var fixthemap = ' <nobr><a ' + fixLink + '>' + 
		'<p class="long">' + iconTool + 'améliorer la carte</p>' +
		'<p class="med">' + iconTool + 'améliorer</p>' +
		'<p class="short">' + iconTool + '</p>' +
		'</a></nobr> '
	var joinOSMF = '<a ' + joinLink + '>' +
		'<p class="long">' + iconHand + '</p>' +
		'</a>'
	var donateOSMF = '<a ' + donateLink + '>' +
		'<p class="med">' + iconHeart + '</p>' +
		'<p class="mini">' + iconHeart + '</p>' +
		'</a>'
	
	// separation between data attribution and tiles attribution
	var attribSep = '<br>'
	// separation between tiles attribution and leaflet attribution
	var attribSep2 = ''

	var attributionLeaflet =
		' <nobr>' + attribSep2 + '<a ' + leafletLink + '>' + iconRocket + '</a>' +
		'<p class="long"><b>affichage</b> de cartes par <a ' + leafletLink + '><b>Leaflet</b></a>, bibliothèque logicielle libre</p>' +
		'<p class="med"><b>affichage</b> de cartes par <a ' + leafletLink + '><b>Leaflet</b></a></p>' +
		'<p class="short"><a ' + leafletLink + '><b>Leaflet</b></a></p>' +
		'</nobr> '
	
	var attributionOSMFR = tiles(osmfrLink, osmfrTiles) + ccbysa2
	var attributionOSMBZH = tiles(bzhLink, osmbzh) + ccbysa2
	var attributionOSMHOT = tiles(humanitarianLink, humanitarianName) + cc0
	var attributionOSMSE = tiles(osmseLink, osmse) + ccbysa2
	var attributionStamen = tiles(stamenLink, 'Stamen Design') + ccby3
	var attributionCarto = tiles(cartodbLink, 'Carto') + license(cartodbLink, '', nonCommercial, '')
	var attributionCyclosm = tiles(cyclosmLink, cyclosmName) + ccbysa2

	var hostingOSMFR = hosting(osmfrLink, osmfrHosting)

	L.TileLayer.Provider.providers = {
		OpenStreetMap: {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: 
					data(osmLink, copyrightOSM) + odbl + 
					fixthemap + donateOSMF + joinOSMF + 
					attribSep,
			},
			variants: {
				France: {
					url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
					options: {
						maxZoom: 20,
						attribution: 
							'{attribution.OpenStreetMap}' +
							attributionOSMFR +
							attributionLeaflet,
					},
				},
				humanitaire: {
					url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}' +
							attributionOSMHOT + hostingOSMFR +
							attributionLeaflet,
					},
				},
				breton: {
					url: 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}' +
							attributionOSMBZH + hostingOSMFR +
							attributionLeaflet,
						//bounds: [[46.2, -5.5], [50, 0.7]]
					},
				},
				CyclOSM: {
					url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}' +
							attributionCyclosm + hostingOSMFR +
							attributionLeaflet,
					},
				},
/*
				occitan: {
					url: 'https://tile.openstreetmap.bzh/oc/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}' +
							attributionOSMBZH + hostingOSMFR +
							attributionLeaflet,
						//bounds: [[46.2, -5.5], [50, 0.7]]
					},
				},
				basque: {
					url: 'https://tile.openstreetmap.bzh/eu/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}' +
							attributionOSMBZH + hostingOSMFR +
							attributionLeaflet,
						//bounds: [[46.2, -5.5], [50, 0.7]]
					},
				},
*/
			},
		},
		Hydda: {
			url: 'https://{s}.tile.openstreetmap.se/hydda/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 18,
				attribution: 
					'{attribution.OpenStreetMap}' +
					attributionOSMSE +
					attributionLeaflet,
			},
			variants: {
				Full: 'full',
			},
		},
		Stamen: {
			url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}.{ext}',
			options: {
				attribution:
					'{attribution.OpenStreetMap}' +
					attributionStamen +
					attributionLeaflet,
				subdomains: 'abcd',
				minZoom: 0,
				maxZoom: 20,
				ext: 'png',
			},
			variants: {
				// Toner: 'toner',
				Watercolor: {
					options: {
						variant: 'watercolor',
						minZoom: 1,
						maxZoom: 16,
						ext: 'jpg',
					},
				},
			},
		},
		Carto: {
			url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}.png',
			options: {
				attribution: 
					'{attribution.OpenStreetMap}' +
					attributionCarto +
					attributionLeaflet,
				subdomains: 'abcd',
				maxZoom: 19,
			},
			variants: {
				Positron: 'light_all',
				DarkMatter: 'dark_all'
			}
		}
	};

	L.tileLayer.provider = function (provider, options) {
		return new L.TileLayer.Provider(provider, options);
	};

	return L;
}));
