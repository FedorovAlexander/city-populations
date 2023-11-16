import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import config from '../assets/config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'cities';
  map!: mapboxgl.Map;

  constructor() {}

  ngOnInit() {
    this.createMap();
    this.initiateData();
    this.initiateMapStyle();
  }

  createMap() {
    this.map = new mapboxgl.Map({
      accessToken: config.MAPBOX_ACCESS_TOKEN,
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 5,
      center: [25.2849, 54.6894],
      pitch: 80,
    });

    this.map.on('error', (error) => {
      console.error('Map error:', error);
    });
  }

  initiateMapStyle() {
    this.map.setProjection('globe');

    this.map.on('style.load', () => {
      this.map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });

      this.map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      this.map.setFog({
        range: [1, 20],
        color: 'lightblue',
        'high-color': '#245bde',
        'space-color': '#000000',
        'star-intensity': 0.15,
      });
    });
  }

  initiateData() {
    this.map.on('load', () => {
      console.log('initiateData');

      this.map.addSource('cities', {
        type: 'geojson',
        data: '../assets/data/geonames-all-cities-with-a-population-1000@public.geojson',
      });

      this.map.addLayer({
        id: 'cities',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            0,
            0,
            100000,
            4,
            500000,
            8,
            1000000,
            10,
            5000000,
            14,
            10000000,
            18,
            50000000,
            22,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'population'],
            0,
            '#f1f075',
            100000,
            '#e55e5e',
            500000,
            '#cb2c3e',
            1000000,
            '#811c24',
            5000000,
            '#4a0c15',
            10000000,
            '#000000',
            50000000,
            '#000000',
          ],
          'circle-opacity': 0.8,
        },
      });

      //get feature of the source 'cities' and console.log it
      this.map.on('click', 'cities', (e) => {
        if (!e?.features) return;
        const population = e?.features[0].properties;
        console.log(population ? population['population'] : 'no population');
      });
    });
  }
}
