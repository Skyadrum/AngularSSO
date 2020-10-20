import { Component, OnInit } from '@angular/core';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';

@Component({
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    constructor(private menuHeaderService: MenuHeaderService) {
        this.menuHeaderService.setMenuHeader();
    }

    ngOnInit() {

    }

}
