import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Subject}   from '../../shared/classes/subject';
import {CRUDService}  from '../../shared/services/crud.service';
import {SubjectService}  from '../../shared/services/subject.service';
import {configAddTest, configEditTest} from '../../shared/constants';
import {Test} from "../../shared/classes/test"

@Component({
    selector: 'test-container',
    templateUrl: 'test.component.html'
})

export class TestComponent implements OnInit {

    //common variables
    public entity: string = "test";
    public errorMessage: string;
    public pageTitle: string = "Тести по предмету";
    public subject_id: number;


    //varibles for addedit
    public configAdd = configAddTest;
    public configEdit = configEditTest;

    // variables for common component
    public entityTitle: string = "Тести";
    public entityData: any[] = [];

    constructor(private crudService: CRUDService,
                private route: ActivatedRoute,
                private router: Router,
                private subjectService: SubjectService,
                private location: Location) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.subject_id = +params['id']; // (+) converts string 'id' to a number
            this.getTestBySubjectId();
        });

    }

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "Назва тесту", style: "col-xs-12 col-sm-2"},
        {name: "Завдань", style: "col-xs-12 col-sm-1"},
        {name: "Тривалість", style: "col-xs-12 col-sm-2"},
        {name: "Статус", style: "col-xs-12 col-sm-2"},
        {name: "Cпробів", style: "col-xs-12 col-sm-1"},
        {name: "", style: "col-xs-12 col-sm-3"}
    ]

    actions = [
        {title: "Детальніше про тест", action: "testDetaile", style: "glyphicon glyphicon-th"},
        {title: "Завдання", action: "task", style: "glyphicon glyphicon-th"},
        {title: "Редагувати тест", action: "edit", style: "glyphicon glyphicon-edit"},
        {title: "Видалити тест", action: "delete", style: "glyphicon glyphicon-trash"}
    ];

    goBack(): void {
        this.location.back();

    }

    getTestBySubjectId() {
        this.subjectService.getTestsBySubjectId(this.entity, this.subject_id)
            .subscribe(
                data => {
                    let tempArr: any[] = [];
                    data.forEach((item)=> {
                        let test: any = {};
                        test.entity_id = item.test_id;
                        test.entityColumns = [
                            item.test_name,
                            item.tasks,
                            item.time_for_test,
                            item.enabled,
                            item.attempts
                        ];
                        test.actions = this.actions;
                        tempArr.push(test);
                    });
                    this.entityData = tempArr;
                },
                error=>console.log("error: ", error)
            );
    }

    // deleteTest(entity: string, id: number): void {
    //     if (confirm('Підтвердіть видалення тесту')) {
    //         this.crudService
    //             .delRecord(entity, id)
    //             .subscribe(
    //                 () => {
    //                     this.refreshData("delete");
    //                 },
    //                 error => this.errorMessage = <any>error
    //             );
    //     }
    // }

    modalAdd(data: any) {
        if (data.action === "create") {
            let newTest: Test = new Test(
                data.list[0].value,
                this.subject_id,
                data.list[1].value,
                data.list[2].value,
                data.list[3].value,
            );
            this.crudService.insertData(this.entity, newTest)
                .subscribe(response=> {
                    console.log(response);
                    this.getTestBySubjectId();
                });
            // } else if (data.action === "edit") {
            //     let editedTest: Test = new Test(
            //         data.list[0].value,
            //         data.list[1].value,
            //         data.list[2].value,
            //         data.list[3].value
            //     );
            //     this.crudService.updateData(this.entity, data.id, editedTest)
            //         .subscribe(response=> {
            //             console.log(response);
            //             this.getTestBySubjectId();
            //         });
        }
    }

    // activate(data: any) {
    //     console.log("!!! ", data);
    //     switch (data.action) {
    //         case "tests":
    //             this.router.navigate(["/admin/subject", data.entity_id, "tests"]);
    //             break;
    //         case "edit":
    //             console.log("we will edit ", data.entityColumns[0] + " with id: " + data.entity_id);
    //             break;
    //         case "delete":
    //             console.log("we will delete ", data.entityColumns[0] + " with id: " + data.entity_id);
    //             this.deleteSubject(this.entity, data.entity_id);
    //             break;
    //     }
    // }


}


