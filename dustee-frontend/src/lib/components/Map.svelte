<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Sensor } from '$utils/types/sensors';

	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

	let mapContainer;
	let map;

	const centerOfCzechRepublic = [49.8037633, 15.4749126];
	const tileLayerUrl = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tileLayerAttribution =
		'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

	export let sensors: { [key: string]: Sensor };

	onMount(async () => {
		const L = (await import('leaflet')).default;
		const GestureHandling = (await import('leaflet-gesture-handling')).default;
		const MarkerClusterGroup = (await import('leaflet.markercluster')).default;

		L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

		map = createMap(L);
		const markers = createMarkers(L);

		map.addLayer(markers);
	});

	function createMap(L) {
		const southWest = L.latLng(48.55, 12.09);
		const northEast = L.latLng(51.06, 18.87);
		const bounds = L.latLngBounds(southWest, northEast);
		const svgIcon = createSvgIcon(L);

		const map = L.map(mapContainer, {
			maxBounds: bounds,
			maxBoundsViscosity: 1.0,
			gestureHandling: true
		}).setView(centerOfCzechRepublic, 7);

		L.tileLayer(tileLayerUrl, {
			attribution: tileLayerAttribution,
			maxZoom: 18
		}).addTo(map);

		return map;
	}

	function createSvgIcon(L) {
		return L.divIcon({
			html: `
				<svg fill="rgb(0, 121, 107)" fill-opacity="0.6" height="48px" width="48px" version="1.1" 
					viewBox="0 0 184.751 184.751" xml:space="preserve">
					<path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z"/>
				</svg>`,
			className: '',
			iconSize: [48, 48],
			iconAnchor: [24, 24]
		});
	}

	function createMarkers(L) {
		const markers = L.markerClusterGroup({
			showCoverageOnHover: false,
			spiderfyDistanceMultiplier: 1.5
		});

		const sensorEntries = Object.entries(sensors).slice(1);
		for (const [sensorId, sensor] of sensorEntries) {
			const marker = L.marker([parseFloat(sensor.Latitude), parseFloat(sensor.Longitude)], {
				icon: createSvgIcon(L)
			});
			markers.addLayer(marker);
		}

		return markers;
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div id="map" bind:this={mapContainer} />

<style>
	#map {
		@apply h-[450px] md:h-[650px] w-full rounded-lg z-30;
	}

	:global .leaflet-layer {
		-webkit-filter: grayscale(100%);
		-moz-filter: grayscale(100%);
		-ms-filter: grayscale(100%);
		-o-filter: grayscale(100%);
		filter: grayscale(100%);
		filter: gray;
	}
</style>
