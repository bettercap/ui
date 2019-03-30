import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { OmniBarService } from '../../services/omnibar.service';
import { Event } from '../../models/event';

declare var ol: any;

@Component({
    selector: 'ui-position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit, OnDestroy {
    running: boolean = false;
    map: any;
    prevMarker: any;
    subscriptions: any = [];

    constructor(public api: ApiService, public omnibar: OmniBarService) { 
        this.update();
    }

    ngOnInit() {
        this.subscriptions = [
            this.api.onNewData.subscribe(session => {
                this.update();
            })
        ];

        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([this.api.session.gps.Longitude, this.api.session.gps.Latitude]),
                zoom: 18
            })
        });

        this.addMarker(this.api.session.gps.Latitude, this.api.session.gps.Longitude)
    }

    ngOnDestroy() {
        for( let i = 0; i < this.subscriptions.length; i++ ){
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
    }

    private addMarker(lat, lng) { 
        const iconMarkerStyle = new ol.style.Style({
            image: new ol.style.Icon( {
                opacity: 1.0,
                scale: 0.1,
                src: '/assets/images/logo.png'
            })
        });

        let vectorLayer = new ol.layer.Vector({
            source:new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326','EPSG:3857')),
                })]
            }),
            style: iconMarkerStyle
        });

        if( this.prevMarker ) {
            this.map.removeLayer(this.prevMarker);
        }

        this.map.addLayer(vectorLayer);
        this.prevMarker = vectorLayer;
    }

    /*
    https://www.maps.ie/map-my-route/

    idx: number = 0;
    steps: any = [
        [40.861793161679294,-73.04730981588365],[40.861793,-73.047311],[40.862143,-73.04736],[40.862143,-73.04736],[40.862492,-73.047415],[40.862492,-73.047415],[40.862842,-73.047465],[40.862842,-73.047465],[40.863002,-73.047493],[40.863002,-73.047493],[40.863337,-73.04756],[40.863337,-73.04756],[40.863593,-73.047618],[40.863593,-73.047618],[40.863881,-73.047683],[40.863891,-73.047619],[40.863891,-73.047619],[40.863881,-73.047683],[40.864028,-73.047655],[40.86417,-73.047699],[40.86417,-73.047699],[40.86441,-73.047774],[40.864478,-73.04785],[40.864477,-73.04775],[40.864477,-73.04775],[40.864478,-73.04785],[40.864809,-73.047897],[40.864809,-73.047897],[40.865154,-73.047946],[40.865154,-73.047946],[40.865536,-73.048015],[40.865536,-73.048015],[40.865798,-73.048062],[40.865808,-73.047966],[40.865808,-73.047966],[40.865851,-73.047547],[40.865851,-73.047547],[40.865907,-73.047013],[40.865907,-73.047013],[40.865959,-73.046432],[40.865959,-73.046432],[40.86598,-73.046222],[40.866253,-73.046266],[40.866253,-73.046266],[40.866527,-73.046309],[40.866527,-73.046309],[40.866741,-73.046424],[40.866775,-73.046513],[40.866771,-73.046557],[40.866771,-73.046557],[40.866715,-73.047177],[40.866715,-73.047177],[40.866682,-73.047523],[40.866682,-73.047523],[40.86666,-73.0476],[40.866528,-73.047892],[40.866528,-73.047892],[40.866477,-73.048318],[40.866477,-73.048318],[40.86644,-73.048698],[40.86644,-73.048698],[40.866401,-73.0491],[40.866401,-73.0491],[40.866349,-73.049643],[40.866349,-73.049643],[40.86633,-73.049841],[40.866261,-73.049828],[40.866261,-73.049828],[40.866151,-73.049807],[40.866151,-73.049807],[40.865965,-73.049772],[40.865965,-73.049772],[40.865747,-73.04973],[40.865747,-73.04973],[40.865402,-73.049664],[40.865402,-73.049664],[40.865034,-73.049664],[40.865034,-73.049664],[40.865005,-73.049665],[40.864982,-73.049925],[40.864982,-73.049925],[40.864939,-73.050328],[40.864939,-73.050328],[40.864922,-73.050414],[40.864824,-73.050632],[40.864723,-73.05079],[40.864723,-73.05079],[40.864586,-73.051003],[40.864586,-73.051003],[40.86468,-73.050856],[40.864367,-73.050821],[40.864367,-73.050821],[40.86468,-73.050856],[40.864824,-73.050632],[40.864113,-73.050546],[40.864113,-73.050546],[40.864005,-73.050533],[40.864005,-73.050533],[40.864005,-73.050533]
    ];
    */

    private update() {
        this.running = this.api.module('gps').running;

        if( this.map ) {
            /*
            let step = this.steps[this.idx++ % this.steps.length];
            this.api.session.gps.Longitude = step[1];
            this.api.session.gps.Latitude = step[0];
            */
            this.addMarker(this.api.session.gps.Latitude, this.api.session.gps.Longitude)

            var view = this.map.getView();

            view.setCenter(ol.proj.fromLonLat([this.api.session.gps.Longitude, this.api.session.gps.Latitude]));
        }
    }
}
