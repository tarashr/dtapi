import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: "pie-chart",
    template: `
        <chart [options]="options"></chart>
    `,
    styleUrls: ["gruop-piechart-results.component.scss"]
})
export class GroupPieChartResultsComponent implements OnInit {

    @Input() chartData;
    options: Object;

    constructor() {}

    ngOnInit() {
        this.formChartData();
    }

    formChartData() {
        let countPerfect: number = 0;
        let countGood: number = 0;
        let countSatisfactorily: number = 0;
        let countNotSatisfactorily: number = 0;
        const data: any = [];

        for (let i = 0; i < this.chartData.length; i++) {
            if (this.chartData[i] === "Відмінно") {
                countPerfect++;
            }
            if (this.chartData[i] === "Добре") {
                countGood++;
            }
            if (this.chartData[i] === "Задовільно") {
                countSatisfactorily++;
            }
            if (this.chartData[i] === "Незадовільно") {
                countNotSatisfactorily++;
            }
        }

        if (countPerfect) {
            data.push({name: "Відмінно", y: (100 * countPerfect) / this.chartData.length});
        }

        if (countGood) {
            data.push({name: "Добре", y: (100 * countGood) / this.chartData.length});
        }

        if (countSatisfactorily) {
            data.push({name: "Задовільно", y: (100 * countSatisfactorily) / this.chartData.length});
        }

        if (countNotSatisfactorily) {
            data.push({name: "Незадовільно", y: (100 * countNotSatisfactorily) / this.chartData.length});
        }

        this.createPieChart(data);
    }

    createPieChart(pieChartData) {
        this.options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: "pie"
            },
            title: {
                text: "Успішність групи"
            },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.percentage:.1f} %"
                    }
                }
            },
            series: [{
                name: "Частка",
                colorByPoint: true,
                data: pieChartData
            }]
        };
    }
}