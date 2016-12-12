import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: "bar-chart",
    template: `
        <chart [options]="options"></chart>
    `,
    styleUrls: ["group-barchart-results.component.scss"]
})
export class GroupBarChartResultsComponent implements OnInit {

    @Input() chartData;
    options: Object;

    constructor() {}

    ngOnInit() {
        this.options = {
            chart: {
                type: "column"
            },
            title: {
                text: "Результати тестування"
            },
            xAxis: {
                type: "category",
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: "12px",
                        fontFamily: "Verdana, sans-serif"
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Бали за тестування"
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: "Набрано балів: <b>{point.y:.1f}</b>"
            },
            series: [{
                name: "Набрані бали",
                data: this.chartData,
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: "#000",
                    align: "center",
                    style: {
                        fontSize: "11px",
                        fontFamily: "Verdana, sans-serif"
                    }
                }
            }]
        };
    }
}