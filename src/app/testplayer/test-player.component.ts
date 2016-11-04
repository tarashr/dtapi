import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    templateUrl: 'start-page.component.html',
    styleUrls: ['../studentpart/start-page.component.css']

})

export class StartPageComponent implements OnInit{

    ngOnInit() {
        console.log('we in test-player')
    }

}