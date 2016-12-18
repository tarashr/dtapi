import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: "bar-chart",
    template: `
        <chart [options]="options"></chart>
    `,
    styles: [`
        chart {
         display: block;
        }
    `]
})
export class GroupBarChartResultsComponent implements OnInit {

    @Input() chartData;
    options: Object;

    constructor() {}

    ngOnInit() {
        this.options = {
            chart: {
                height: this.chartData.names.length * 50 + 120,
                type: "bar"
            },
            title: {
                text: "Результати тестування"
            },
            xAxis: {
                categories: this.chartData.names,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: "Резульат здачі тесту, %",
                    align: "high"
                },
                labels: {
                    overflow: "justify"
                }
            },
            tooltip: {
                pointFormat: "Набрано <b>{point.y:.1f}</b>%"
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                showInLegend: false,
                data: this.chartData.series

            }]
        };
    }
}