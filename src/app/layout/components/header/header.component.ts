import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService, User } from '../../../core';
import { ProfilesService } from '../../../core';
import { JwtService } from '../../../core/services/jwt.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass = 'push-right';
    public displayName = 'Gues';
    public userCurrent: User;
    public token: String;
    public logx: string;
    constructor(
        private translate: TranslateService,
        public router: Router,
        private jwtService: JwtService) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        if (this.jwtService.getToken()) {
            this.logx = 'Log out';
            this.token = this.jwtService.getToken();
            this.userCurrent = this.jwtService.getDecodedAccessToken(this.token);
            if (this.userCurrent == null) {
                return;
            } else {
                if (!this.userCurrent.displayName) {
                    this.displayName = this.userCurrent.unique_name;
                } else {
                    this.displayName = this.userCurrent.displayName;
                }
            }
        } else {
            this.logx = 'login';
        }

    }
    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this.jwtService.destroyToken();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
