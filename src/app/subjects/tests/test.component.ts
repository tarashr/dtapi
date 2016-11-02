import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import '../shared/rxjs-operators';
import {Router} from "@angular/router";
import {Subject}   from '../../shared/classes/subject';
import {CRUDService}  from '../../shared/services/crud.service';
import {SubjectService}  from '../../shared/services/subject.service';
import {configAddTest, configEditTest} from '../../shared/constants';

@Component({
    selector: 'test-container',
    templateUrl: 'test.component.html'
})

export class SubjectComponent implements OnInit {

    //common variables
    public entity: string = "test";
    public errorMessage: string;


    //varibles for addedit
    public configAdd = configAddTest;
    public configEdit = configEditTest;

    // variables for common component
    public entityTitle: string = "Тести";
    public entityData: any[] = [];

    constructor(private crudService: CRUDService,
                private _router: Router,
                private subjectService: SubjectService) {
    }

    ngOnInit() {
        this.getTestsBySubjectId();
    }

    headers = [
        {name: "№", style: "col-xs-12 col-sm-1"},
        {name: "Назва тесту", style: "col-xs-12 col-sm-4"},
        {name: "Кількість завдань", style: "col-xs-12 col-sm-4"},
        {name: "Тривалість тесту", style: "col-xs-12 col-sm-4"},
        {name: "Статус", style: "col-xs-12 col-sm-4"},
        {name: "Кількість спроб", style: "col-xs-12 col-sm-4"},
        {name: "", style: "col-xs-12 col-sm-3"}
    ];

    actions = [
        {title: "Детальніше про тест", action: "testDetaile", style: "glyphicon glyphicon-th"},
        {title: "Завдання", action: "task", style: "glyphicon glyphicon-th"},
        {title: "Редагувати тест", action: "edit", style: "glyphicon glyphicon-edit"},
        {title: "Видалити тест", action: "delete", style: "glyphicon glyphicon-trash"}
    ];

    getTestsBySubjectId() :void {
        this.subjectService.getTestsBySubjectId(this.entity, subject.subject_id)
    }

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

    // modalAdd(data: any) {
    //     if (data.action === "create") {
    //         let newTest: Test = new Test(data.list[0].value, data.list[1].value);
    //         this.crudService.insertData(this.entity, newTest)
    //             .subscribe(response=> {
    //                 console.log(response);
    //                 this.refreshData(data.action);
    //             });
    //     } else if (data.action === "edit") {
    //         let editedTest: Test = new Test(data.list[0].value, data.list[1].value);
    //         this.crudService.updateData(this.entity, data.id, editedTest)
    //             .subscribe(response=> {
    //                 console.log(response);
    //                 this.refreshData(data.action);
    //             });
    //     }
    // }

    // activate(data: any) {
    //     console.log("!!! ", data);
    //     switch (data.action) {
    //         case "tests":
    //             this._router.navigate(["/admin/subject", data.entity_id, "tests"]);
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


