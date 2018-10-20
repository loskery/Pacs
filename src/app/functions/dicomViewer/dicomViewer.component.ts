import { Component, OnInit, Input, AfterViewInit, ElementRef, Renderer, ViewChild } from '@angular/core';

import * as $ from 'jquery';
import * as Hammer from 'hammerjs';
import * as cornerstoneMath from 'cornerstone-math';
import * as dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader';
import { Series } from '../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RichTextEditorComponent } from '@syncfusion/ej2-ng-richtexteditor';

cornerstoneTools.external.$ = $;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWebImageLoader.external.$ = $;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const config = {
    webWorkerPath: '/node_modules/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
        'decodeTask': {
            codecsPath: '/node_modules/cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderCodecs.js'
        }
    }
};
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
@Component({
    selector: 'app-dicomviewer',
    templateUrl: './dicomViewer.component.html',
    styleUrls: ['./dicomViewer.component.css'],
})
export class DicomViewerComponent implements OnInit, AfterViewInit {
    title = 'QNWebViewer';
    public ImageIds = [];
    public fromDiagnose: FormGroup;
    closeResult: string;
    // cột, dòng, số viewPort
    public column: Array<number> = [];
    public row: Array<number> = [];
    public numberViews: Array<number> = [];
    // thông tin cho phiếu chẩn đoán
    public patientName: string;
    public patientAge: number;
    public patientSex: string;
    public patientAddress: string;
    public department: string;
    public doctor: string;
    public diagnose: string;

    @ViewChild('toolsRTEDiagnostic') public rteObj: RichTextEditorComponent;
    toolsRTE: object = {
        type: 'Expand', // Expand - MultiRow
        items: ['Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', '|',
            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
            'SourceCode']
    };
    @Input() PatientToDicom: Series;
    constructor(
        private _fromBuilder: FormBuilder,
        private modalService: NgbModal,
    ) {
    }
    ngOnInit() {
        console.log(this.PatientToDicom); // object patient
        console.log(this.PatientToDicom.qnuRis_Study.studyStudyDate.toString().slice(0, 10));

        // set cột, dòng khi chạy lần đầu
        this.column = new Array();
        this.row = new Array();
        this.column.push(1);
        this.row.push(0);
        // get thông tin bệnh nhân cho form chẩn đoán
        this.inforPatient();
    }
    ngAfterViewInit(): void {
        // const rteObj: RichTextEditorComponent = this.rteObj;
        this.loadView(1);
    }
    createForm() {
        this.fromDiagnose = this._fromBuilder.group({
            result: [''],
            template: [''],
            suggest: ['']
        });
    }
    inforPatient() {
        this.patientName = this.PatientToDicom.qnuRis_Study.qnuRis_Patient.patientName;
        this.patientAge = this.PatientToDicom.qnuRis_Study.qnuRis_Patient.patientAge;
        this.patientSex = this.PatientToDicom.qnuRis_Study.qnuRis_Patient.patientGender;
        this.patientAddress = this.PatientToDicom.qnuRis_Study.qnuRis_Patient.patientAddress;
        this.doctor = this.PatientToDicom.qnuRis_Study.studyReferringPhysiciansName;
        this.diagnose = this.PatientToDicom.qnuRis_Study.studyStudyDescription;
    }
    open(content) {
        this.createForm();
        this.modalService.open(content, { size: 'lg' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;

        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
    loadView(numberView: number) {
        const canvas = new Array<any>();
        this.numberViews = new Array();
        for (let i = 0; i < numberView; i++) {
            this.numberViews.push(i);
        }
        for (let i = 0; i < this.numberViews.length; i++) {
            canvas.push(('.image-canvas-' + i));
            const c = '.image-canvas-' + i;
            // this.configLoadImage(c);
        }
        this.configLoadImage();
    }
    configLoadImage() {
        const h = $(window).height();
        const h1 = $('a.navbar-brand')[0].clientHeight;
        const h2 = $('#ToolBar')[0].clientHeight;
        $('.image-canvas-1').css('height', h - h1 - h2 + 'px');
        // $('.image-canvas-1').css('height', 100 + '%');

        const canvas = $('.image-canvas-1')[0];
        cornerstone.enable(canvas);
        this.getSerialImage();
        // function onImageRendered(e) {
        //     const viewport = cornerstone.getViewport(e.target);
        //     $('#mrbottomleft').text('WW/WC: ' + Math.round(viewport.voi.windowWidth) + '/' + Math.round(viewport.voi.windowCenter));
        //     $('#mrbottomright').text('Zoom: ' + viewport.scale.toFixed(2));
        // }
        // canvas.addEventListener('cornerstoneimagerendered', onImageRendered);
        // config zoom
        const confugration = {
            minScale: 0.25,
            maxScale: 20.0,
            preventZoomOutsideImage: true
        };
        cornerstoneTools.zoom.setConfiguration(confugration);
        // config magSizeRange
        const magSizeRange = document.getElementById('magSizeRange');
        magSizeRange.addEventListener('change', function () {
            const config2 = cornerstoneTools.magnify.getConfiguration();
            config2.magnifySize = parseInt((<HTMLInputElement>document.getElementById('magSizeRange')).value, 10);
            (document.querySelector('.magnifyTool') as HTMLElement).style.width = config2.magnifySize;
            (document.querySelector('.magnifyTool') as HTMLElement).style.height = config2.magnifySize;
            cornerstoneTools.magnify.deactivate(canvas, 1);
            cornerstoneTools.magnifyTouchDrag.deactivate(canvas);
            cornerstoneTools.magnify.activate(canvas, 1);
            cornerstoneTools.magnifyTouchDrag.activate(canvas);
        });
        // config magnify
        const magLevelRange = document.getElementById('magLevelRange');
        magLevelRange.addEventListener('change', function () {
            const config1 = cornerstoneTools.magnify.getConfiguration();
            config1.magnificationLevel = parseInt((<HTMLInputElement>document.getElementById('magLevelRange')).value, 10);
        });

        const config_magnify_magSizeRange = {
            magnifySize: parseInt((<HTMLInputElement>document.getElementById('magSizeRange')).value, 10),
            magnificationLevel: parseInt((<HTMLInputElement>document.getElementById('magLevelRange')).value, 10)
        };
        cornerstoneTools.magnify.setConfiguration(config_magnify_magSizeRange);
        cornerstoneTools.mouseInput.enable(canvas);
        cornerstoneTools.touchInput.enable(canvas);
        cornerstoneTools.mouseWheelInput.enable(canvas);
        cornerstoneTools.keyboardInput.enable(canvas);

        this.loadImage(canvas);
    }
    loadImage(canvas: any) {
        const initWidth = canvas.clientWidth;
        const initHeight = canvas.clientHeight;
        const stack = {
            currentImageIdIndex: 0,
            imageIds: this.ImageIds
        };

        cornerstone.loadAndCacheImage(this.ImageIds[1]).then(function (image) {
            cornerstone.displayImage(canvas, image);
            // coment teamp
            $('.image-canvas-1').css('width', '100%');
            $('.cornerstone-canvas').css('width', '100%');
            $('.cornerstone-canvas').css('height', '100%');
            // Set the stack as tool state
            cornerstoneTools.addStackStateManager(canvas, ['stack']);
            cornerstoneTools.addToolState(canvas, 'stack', stack);
            cornerstoneTools.scrollIndicator.enable(canvas);
            cornerstoneTools.mouseInput.enable(canvas);
            cornerstoneTools.touchInput.enable(canvas);
            cornerstoneTools.mouseWheelInput.enable(canvas);
            cornerstoneTools.zoomWheel.activate(canvas);
            // Set the div to focused, so keypress events are handled
            canvas.tabIndex = 0;
            canvas.focus();
            // Enable all tools we want to use with this element
            cornerstoneTools.stackScrollKeyboard.activate(canvas);
            cornerstoneTools.wwwc.activate(canvas, 1); // ww/wc is the default tool for left mouse button
            cornerstoneTools.pan.activate(canvas, 2); // pan is the default tool for middle mouse button
            cornerstoneTools.zoom.activate(canvas, 4); // zoom is the default tool for right mouse button

            function disableAllTools() {
                cornerstoneTools.wwwc.disable(canvas);
                cornerstoneTools.pan.activate(canvas, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.zoom.activate(canvas, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.probe.deactivate(canvas, 1);
                cornerstoneTools.length.deactivate(canvas, 1);
                cornerstoneTools.ellipticalRoi.deactivate(canvas, 1);
                cornerstoneTools.rectangleRoi.deactivate(canvas, 1);
                cornerstoneTools.angle.deactivate(canvas, 1);
                cornerstoneTools.magnify.deactivate(canvas, 1);
                cornerstoneTools.magnifyTouchDrag.deactivate(canvas);
                cornerstoneTools.freehand.deactivate(canvas, 1);
                // cornerstoneTools.eraser.deactivate(canvas, 1);
                cornerstoneTools.highlight.deactivate(canvas, 1);
                cornerstoneTools.arrowAnnotate.deactivate(canvas, 1);
                cornerstoneTools.stopClip(canvas);
            }
            function clearAllTools() {
                cornerstoneTools.clearToolState(canvas, 'wwwc');
                cornerstoneTools.clearToolState(canvas, 'length');
                cornerstoneTools.clearToolState(canvas, 'probe');
                cornerstoneTools.clearToolState(canvas, 'ellipticalRoi');
                cornerstoneTools.clearToolState(canvas, 'rectangleRoi');
                cornerstoneTools.clearToolState(canvas, 'angle');
                cornerstoneTools.clearToolState(canvas, 'highlight');
                cornerstoneTools.clearToolState(canvas, 'freehand');
                cornerstoneTools.clearToolState(canvas, 'arrowAnnotate');
            }
            $('button').click(function () {
                $('button').removeClass('active');
                $(this).addClass('active');
                const id = $(this).attr('id');
                switch (id) {
                    case 'enableWindowLevelTool': {
                        disableAllTools();
                        cornerstoneTools.wwwc.activate(canvas, 1);
                        break;
                    }
                    case 'pan': {
                        disableAllTools();
                        cornerstoneTools.pan.activate(canvas, 1);
                        //  $(".cornerstone-canvas").css("border", "3px solid red");
                        break;
                    }
                    case 'zoom': {
                        disableAllTools();
                        break;
                    }
                    case 'enableLength': {
                        disableAllTools();
                        cornerstoneTools.length.activate(canvas, 1);
                        break;
                    }
                    case 'probe': {
                        disableAllTools();
                        cornerstoneTools.probe.activate(canvas, 1);
                        break;
                    }
                    case 'circleroi': {
                        disableAllTools();
                        cornerstoneTools.ellipticalRoi.activate(canvas, 1);
                        break;
                    }
                    case 'rectangleroi': {
                        disableAllTools();
                        cornerstoneTools.rectangleRoi.activate(canvas, 1);
                        break;
                    }
                    case 'angle': {
                        disableAllTools();
                        cornerstoneTools.angle.activate(canvas, 1);
                        break;
                    }
                    case 'highlight': {
                        disableAllTools();
                        cornerstoneTools.highlight.activate(canvas, 1);
                        break;
                    }
                    case 'freehand': {
                        disableAllTools();
                        cornerstoneTools.freehand.activate(canvas, 1);
                        break;
                    }
                    case 'magnification': {
                        disableAllTools();
                        cornerstoneTools.magnify.activate(canvas, 1);
                        cornerstoneTools.magnifyTouchDrag.activate(canvas);
                        $('#magnificationdiv').show();
                        break;
                    }
                    case 'x256': {
                        disableAllTools();
                        canvas.style.width = '256px';
                        canvas.style.height = '256px';
                        cornerstone.resize(canvas);
                        break;
                    }
                    case 'x512': {
                        disableAllTools();
                        canvas.style.width = '512px';
                        canvas.style.height = '512px';
                        cornerstone.resize(canvas);
                        break;
                    }
                    case 'invert': {
                        disableAllTools();
                        const viewport = cornerstone.getViewport(canvas);
                        viewport.invert = !viewport.invert;
                        cornerstone.setViewport(canvas, viewport);
                        break;
                    }
                    case 'interpolation': {
                        disableAllTools();
                        const viewport = cornerstone.getViewport(canvas);
                        viewport.pixelReplication = !viewport.pixelReplication;
                        cornerstone.setViewport(canvas, viewport);
                        break;
                    }
                    case 'hflip': {
                        disableAllTools();
                        const viewport = cornerstone.getViewport(canvas);
                        viewport.hflip = !viewport.hflip;
                        cornerstone.setViewport(canvas, viewport);
                        break;
                    }
                    case 'vflip': {
                        disableAllTools();
                        const viewport = cornerstone.getViewport(canvas);
                        viewport.vflip = !viewport.vflip;
                        cornerstone.setViewport(canvas, viewport);
                        break;
                    }
                    case 'rotate': {
                        disableAllTools();
                        const viewport = cornerstone.getViewport(canvas);
                        viewport.rotation += 90;
                        cornerstone.setViewport(canvas, viewport);
                        break;
                    }
                    case 'reset': {
                        disableAllTools();
                        canvas.style.width = initWidth + 'px';
                        canvas.style.height = initHeight + 'px';
                        cornerstone.reset(canvas);
                        cornerstone.resize(canvas);
                        // coment temp
                        $('.image-canvas-1').css('width', '100%');
                        $('.cornerstone-canvas').css('width', '100%');
                        $('.cornerstone-canvas').css('height', '100%');
                        break;
                    }
                    case 'saveImage': {
                        const filename = 'image dicom';
                        cornerstoneTools.saveAs(canvas, filename);
                        break;
                    }
                    case 'playClip': {
                        // cornerstoneTools.addStackStateManager(canvas, ['stack', 'playClip']);
                        // cornerstoneTools.addToolState(canvas, 'stack', stack);
                        const frameRate = 2;
                        cornerstoneTools.playClip(canvas, frameRate);
                        break;
                    }
                    case 'stopClip': {
                        cornerstoneTools.stopClip(canvas);
                        break;
                    }
                    case 'annotate': {
                        disableAllTools();
                        cornerstoneTools.arrowAnnotate.activate(canvas, 1);
                        break;
                    }
                    case 'eraser': {
                        clearAllTools();
                        cornerstone.updateImage(canvas);
                        break;
                    }
                    case 'next': {
                        // disableAllTools();
                        cornerstoneTools.scroll(canvas, 1, true, false);
                        break;
                    }
                    case 'previous': {
                        // disableAllTools();
                        cornerstoneTools.scroll(canvas, -1, true, false);
                        break;
                    }
                    default: {
                        disableAllTools();
                        cornerstoneTools.zoom.activate(canvas, 5);
                        break;
                    }
                }
            });
            // đặt focus de su dung ban phim trong stack
            // coment temp
            $('.image-canvas-1').mouseover(function () {
                canvas.focus();
            });
            $('.closemagnification').click(function () {
                $('#magnificationdiv').hide();
            });
        });
    }
    getSerialImage() {
        this.ImageIds.push('wadouri:http://localhost:4200/assets/dicom/24.dcm');
        this.ImageIds.push('wadouri:http://localhost:4200/assets/dicom/25.dcm');
        this.ImageIds.push('wadouri:http://localhost:4200/assets/dicom/1.3.12.2.1107.5.1.4.37359.30000018080901492803100019450.dcm');
        return this.ImageIds;
    }
    layoutClick(numberCell: number) {
        if (numberCell === 2) {
            this.column = new Array();
            this.row = new Array();
            this.column.push(1);
            this.column.push(2);
            this.row.push(1);
            setTimeout(() => {
                this.loadView(2);
            },
                50);
        }
        if (numberCell === 4) {
            this.column = new Array();
            this.row = new Array();
            this.column.push(1);
            this.column.push(2);
            this.row.push(1);
            this.row.push(2);
            setTimeout(() => {
                this.loadView(4);
            },
                50);
        }
        if (numberCell === 6) {
            this.column = new Array();
            this.row = new Array();
            this.column.push(1);
            this.column.push(2);
            this.column.push(3);
            this.row.push(1);
            this.row.push(2);
            this.row.push(3);
            setTimeout(() => {
                this.loadView(6);
            },
                50);
        }


    }
    saveDiagnose() {
        console.log(this.fromDiagnose);
        this.modalService.dismissAll();
        swal('đã lưu thành công');
    }

}

