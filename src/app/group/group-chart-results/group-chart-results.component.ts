import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: "barChart",
    template: `
        <chart [options]="options"></chart>
    `
})
export class GroupChartResultsComponent implements OnInit {

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
                        fontSize: "13px",
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
                    rotation: -90,
                    color: "#000",
                    align: "right",
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: "13px",
                        fontFamily: "Verdana, sans-serif"
                    }
                }
            }]
        };
    }
}