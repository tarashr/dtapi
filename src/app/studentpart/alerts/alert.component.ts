import {Component,Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'ngbd-alert-selfclosing',
    templateUrl: './alert.component.html'
})
export class NgbdAlertSelfclosing implements OnInit {
    private _success = new Subject<string>();
    
	@Input() countOfTests;
  
    staticAlertClosed = false;
    successMessage: string;

    ngOnInit(): void {
        setTimeout(() => this.staticAlertClosed = true, 20000);

        this._success.subscribe((message) => this.successMessage = message);
        this._success.debounceTime(5000).subscribe(() => this.successMessage = null);
        
    }

    
}