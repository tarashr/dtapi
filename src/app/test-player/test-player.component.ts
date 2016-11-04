import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    templateUrl: 'test-player.component.html',
    styleUrls: ['../studentpart/start-page.component.css']

})

export class TestPlayerComponent implements OnInit{


    constructor(
        private _router: Router
    ) { }

    private success(response:any){
        if (response.response==="non logged") {
            this._router.navigate(["/login"]);
        }
    }

    ngOnInit() {
        let userRole:string = sessionStorage.getItem("userRole");

        if (!userRole && userRole != "student") {
            this._router.navigate(["/login"]);
        }
        console.log('we in test-player')
    }

}