import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtService } from '../../../core/services/jwt.service';
import { User, Role, UserService, Errors } from '../../../core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive = false;
    collapsed = false;
    showMenu = '';
    pushRightClass = 'push-right';
    public token: String;
    public userCurrent: User;
    public hideUsermanagement = true;
    public hidePatient = true;
    public hideManagerSYS = true;
    errors: Errors = { errors: {} };

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(
        private translate: TranslateService,
        public router: Router,
        private jwtService: JwtService,
        private userService: UserService,
    ) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

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
    ngOnInit(): void {
        if (this.jwtService.getToken()) {
            this.token = this.jwtService.getToken();
            this.userCurrent = this.jwtService.getDecodedAccessToken(this.token);
            this.userService.getUserByUserName(this.userCurrent.unique_name).subscribe(
                data => {
                    for (let i = 0; i < data.roles.length; i++) {
                        if (data.roles[i] === 'Admin') {
                            this.hideUsermanagement = false;
                            this.hidePatient = false;
                            this.hideManagerSYS = false;
                        }
                        if (data.roles[i] === 'SuperAdmin') {
                            this.hideUsermanagement = false;
                            this.hidePatient = false;
                            this.hideManagerSYS = false;
                        }
                        if (data.roles[i] === 'BSChanDoanHinhAnh') {
                            this.hidePatient = false;
                        }
                    }
                },
                err => {
                    this.errors = err;
                }
            );


        }
    }
    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
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

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
}
