import {Component, OnInit, Input} from "@angular/core";
import {GroupService} from "../../shared/services/group.service";

@Component({
    selector: "pie-chart",
    template: `
        <chart [options]="options"></chart>
    `,
    styles: [`
        chart {
         display: block;
        }
    `]
})
export class GroupPieChartResultsComponent implements OnInit {

    @Input() chartData;
    options: Object;

    constructor(private groupService: GroupService) {}

    ngOnInit() {
        const pieChartData = this.groupService.formPieChartData(this.chartData);
        this.createPieChart(pieChartData);
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
    };
}