import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicionService } from '../services/medicion.service';
import * as moment from 'moment';
import { Medicion } from '../model/Medicion';
import { Log } from '../model/Log';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})
export class DispositivoPage implements OnInit {

  public medicion: Medicion;
  public mediciones: Medicion[];
  public logs: Log[];
  public idDispositivo: string;
  private valorObtenido: number = 0;
  public myChart;
  private chartOptions;
  private estaAbierto: number = 0;
  private mostrarMediciones: boolean = false;
  private mostrarLogs: boolean = false;
  constructor(private router: ActivatedRoute, private mServ: MedicionService) {
    setTimeout(() => {
      console.log("Cambio el valor del sensor.");
      this.valorObtenido = this.medicion.valor - 0;
      //llamo al update del chart para refrescar y mostrar el nuevo valor
      this.myChart.update({
        series: [{
          name: 'kPA',
          data: [this.valorObtenido],
          tooltip: {
            valueSuffix: ' kPA'
          }
        }]
      });
      this.generarChart();

    }, 1000);

  }

  ngOnInit() {

    this.idDispositivo = this.router.snapshot.paramMap.get('id');
    this.mServ.getMedicionByIdDispositivo(this.idDispositivo).then((med) => {
      this.medicion = med;
    });


    this.mServ.getMedicionesByIdDispositivo(this.idDispositivo).then((med) => {
      console.log(med)
    });
    this.mServ.getLogsByIdDispositivo(this.idDispositivo).then((log) => {
      this.logs = log;

    });
    this.mServ.getMedicionesByIdDispositivo(this.idDispositivo).then((med) => {
      this.mediciones = med;

    });

    //6
    //opción 1- utilizar libreria Momentjs , haciendo npm install --save moment y luego el import * as moment from 'moment'; en donde lo necesitemos.
    // let a : Medicion= new Medicion(99,moment().format("YYYY-MM-DD hh:mm:ss"),99,1);

    //opción 2, utilizar el objeto Date y hacer el formato necesario a mano.
  }

  ionViewDidEnter() {
    this.generarChart();
  }
  toggleValvula() {

    let current_datetime = new Date()
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
    let log: Log = new Log(1, formatted_date, this.estaAbierto, this.idDispositivo);
    this.mServ.agregarLog(this.idDispositivo, log).then((log) => {
      console.log(log);
    });
    this.mServ.getLogsByIdDispositivo(this.idDispositivo).then((log) => {
      this.logs = log;
    });
    if (this.estaAbierto == 1) {
      let a: Medicion = new Medicion(99, formatted_date, current_datetime.getSeconds(), this.idDispositivo);

      this.mServ.agregarMedicion(a).then((med) => {
        console.log("NUEVA MEDICION!!");
        console.log(med)
      });
      this.mServ.getMedicionesByIdDispositivo(this.idDispositivo).then((med) => {
        this.mediciones = med;
        //this.logs=JSON.parse(JSON.stringify(log));
        console.log(this.mediciones);
      });

      this.estaAbierto = 0;
    }
    else this.estaAbierto = 1;
  }
  toggleLogs() {
    this.mostrarLogs = !this.mostrarLogs
  };
  toggleMediciones() { this.mostrarMediciones = !this.mostrarMediciones };

  generarChart() {
    this.chartOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      }
      , title: {
        text: `Sensor N° ` + this.idDispositivo
      }

      , credits: { enabled: false }


      , pane: {
        startAngle: -150,
        endAngle: 150
      }
      // the value axis
      , yAxis: {
        min: 0,
        max: 100,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        title: {
          text: 'kPA'
        },
        plotBands: [{
          from: 0,
          to: 10,
          color: '#55BF3B' // green
        }, {
          from: 10,
          to: 30,
          color: '#DDDF0D' // yellow
        }, {
          from: 30,
          to: 100,
          color: '#DF5353' // red
        }]
      }
      ,

      series: [{
        name: 'kPA',
        data: [this.valorObtenido],
        tooltip: {
          valueSuffix: ' kPA'
        }
      }]

    };
    this.myChart = Highcharts.chart('highcharts', this.chartOptions);
  }


}
