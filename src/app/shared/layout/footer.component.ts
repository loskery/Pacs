import { NgModule, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {

  today: number = Date.now();

  ngOnInit(): void {
  }

}
