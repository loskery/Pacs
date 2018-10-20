import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Button } from '@syncfusion/ej2-buttons';
import { Dialog } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-ng-popups';
import { RichTextEditorComponent } from '@syncfusion/ej2-ng-richtexteditor';
import { PageSettingsModel, IRow, Column, ToolbarItems, SearchSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-ng-grids';
import { closest } from '@syncfusion/ej2-base';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { Service, DiagnosticService, PatientService, DiagnoseTemplate } from '../../core';
import { routerTransition } from '../../router.animations';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss'],
  animations: [routerTransition()]
})

export class DiagnosticsComponent implements OnInit, AfterViewInit {

  @ViewChild('gridTemplate') public gridTemplate: GridComponent;

  @ViewChild('toolsRTEDiagnostic') public rteObj: RichTextEditorComponent;
  placeholderRTE = 'Nhập mô tả kết quả';

  // tslint:disable-next-line:max-line-length
  valueRTE = `<p></p>`;
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
  fontFamily: Object = {
    default: 'Times New Roman', // to define default font-family
  };

  public templateList: any[];
  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;
  public initialPage: PageSettingsModel;
  public templateForm: FormGroup;

  // public diagnoseTemplate: DiagnoseTemplate;
  public templateName: string;
  public concludeTemp: string;
  public modalities: Service[];
  public modality: string;
  public diagnoseId = 0;
  errors: any;

  constructor(
    private diagnosticService: DiagnosticService,
    private patientService: PatientService,
    private spinner: NgxSpinnerService
  ) {
    this.templateForm = this.createFormGroup();
  }

  ngOnInit() {
    this.initialPage = { pageSize: 20 };
    this.searchOptions = { fields: ['templateName'], operator: 'contains', key: '', ignoreCase: true };
    this.toolbarOptions = ['Search'];
    this.spinner.show();
    // this.rteObj.value = this.valueRTE;
    // this.rteObj.toolbarSettings = this.toolsRTE;
  }

  createFormGroup() {
    return new FormGroup({
      templateName: new FormControl(),
      concludeTemp: new FormControl(),
      modalityControl: new FormControl(1)
    });
  }

  ngAfterViewInit(): void {
    const rteObj: RichTextEditorComponent = this.rteObj;

    // get Diagnose Templates (init)
    this.getTemplates();

    // get modalities (init)
    this.getModalities();
  }

  getTemplates() {
    this.diagnosticService.getAllDiagnoseTemplates()
      .subscribe(
        list => {
          this.templateList = list;
          this.spinner.hide();
        });
  }

  getModalities() {
    this.patientService.getServices()
      .subscribe(
        list => {
          this.modalities = list;
        });
  }

  saveTemplate() {
    // Make sure to create a deep copy of the form-model
    const result = Object.assign({}, this.templateForm.value);

    // const template: DiagnoseTemplate = new DiagnoseTemplate();
    // template.id = this.diagnoseId;
    // template.service = result.modalityControl;
    // template.templateName = result.templateName;
    // template.diagnoseTech = '';
    // template.diagnoseResult = result.concludeTemp;
    // template.data = this.rteObj.value;

    const template: DiagnoseTemplate = {
      id: this.diagnoseId,
      service: result.modalityControl,
      templateName: result.templateName,
      diagnoseTech: '',
      diagnoseResult: result.concludeTemp,
      data: this.rteObj.value,
      qnuRis_Service: null
    };

    if (!template.templateName) {
      swal({
        position: 'center',
        type: 'error',
        title: 'Chưa nhập tên mẫu chẩn đoán.',
        animation: true,
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.diagnosticService.saveDiagnoseTemplate(template)
      .subscribe(
        (_result) => {
          this.diagnoseId = 0;
          this.rteObj.value = '';
          this.templateForm.controls['templateName'].setValue('');
          this.templateForm.controls['concludeTemp'].setValue('');
          this.getTemplates();
          swal({
            position: 'center',
            type: 'success',
            title: 'Lưu thông tin mẫu chẩn đoán thành công!',
            showConfirmButton: false,
            timer: 1500
          });
        },
        err => {
          this.errors = err;
          swal({
            position: 'center',
            type: 'error',
            title: 'Lưu thông tin mẫu chẩn đoán thất bại.',
            showConfirmButton: false,
            timer: 1500
          });
        });
  }

  // editTemplate() {
  //   if (this.diagnoseId === 0) {
  //     swal('Chưa chọn mẫu chẩn đoán cần chỉnh sửa.', '', 'error');
  //     return;
  //   }

  //   // Make sure to create a deep copy of the form-model
  //   const result = Object.assign({}, this.templateForm.value);

  //   const template: DiagnoseTemplate = new DiagnoseTemplate();
  //   template.id = this.diagnoseId;
  //   template.service = result.modalityControl;
  //   template.templateName = result.templateName.trim();
  //   template.diagnoseTech = '';
  //   template.diagnoseResult = result.concludeTemp.trim();
  //   template.data = this.rteObj.value;

  //   if (!template.templateName) {
  //     // thong bao loi
  //     swal('Chưa nhập tên mẫu chẩn đoán.', '', 'error');
  //     return;
  //   }

  //   this.diagnosticService.saveDiagnoseTemplate(template)
  //     .subscribe(
  //       (_result) => {
  //         this.getTemplates();
  //         swal('Cập nhật mẫu chẩn đoán thành công!', '', 'success');
  //       },
  //       err => {
  //         this.errors = err;
  //         swal('Cập nhật mẫu chẩn đoán thất bại.', '', 'error');
  //       });
  // }

  cancelTemplate() {
    this.diagnoseId = 0;
    this.templateName = '';
    this.concludeTemp = '';
    this.rteObj.value = '';
    this.templateForm = new FormGroup({
      templateName: new FormControl(this.templateName),
      concludeTemp: new FormControl(this.concludeTemp),
      modalityControl: new FormControl(1)
    });
  }

  rowSelected(args: RowSelectEventArgs) {
    // let selectedrowindex: number[] = this.grid.getSelectedRowIndexes();  // Get the selected row indexes.
    // alert(selectedrowindex); // To alert the selected row indexes.
    // const selectedrecords: Object[] = this.gridTemplate.getSelectedRecords();  // Get the selected records.

    const rowObj: IRow<Column> = this.gridTemplate.getRowObjectFromUID(closest(<Element>args.target, '.e-row').getAttribute('data-uid'));
    const rowData: any = rowObj.data;
    this.templateName = rowData.templateName;
    this.rteObj.value = rowData.data;
    this.concludeTemp = rowData.diagnoseResult;
    this.modality = rowData.service;
    this.diagnoseId = rowData.id;

    this.templateForm = new FormGroup({
      templateName: new FormControl(this.templateName),
      concludeTemp: new FormControl(this.concludeTemp),
      modalityControl: new FormControl(this.modality)
    });
  }

  onCellClick(args: Event): void {
    const rowObj: IRow<Column> = this.gridTemplate.getRowObjectFromUID(closest(<Element>args.target, '.e-row').getAttribute('data-uid'));
    const rowData: any = rowObj.data;
    this.templateName = rowData.templateName;
    this.rteObj.value = rowData.data;
    this.concludeTemp = rowData.diagnoseResult;
    this.modality = rowData.service;
    this.diagnoseId = rowData.id;

    this.templateForm = new FormGroup({
      templateName: new FormControl(this.templateName),
      concludeTemp: new FormControl(this.concludeTemp),
      modalityControl: new FormControl(this.modality)
    });

    // console.log(this.templateName);
    // this.diagnoseTemplate.id = rowData.id;
    // this.diagnoseTemplate.service = rowData.service;
    // this.diagnoseTemplate.templateName = rowData.templateName;
    // this.diagnoseTemplate.diagnoseResult = rowData.diagnoseResult;
    // this.diagnoseTemplate.data = rowData.data;
    // this.diagnoseTemplate.diagnoseTech = rowData.diagnoseTech;
    // this.diagnoseTemplate.qnuRis_Service = rowData.qnuRis_Service;
  }

  // // tslint:disable-next-line:member-ordering
  // public dlgButtons: any = [{ buttonModel: { content: 'Insert', isPrimary: true }, click: this.onInsert.bind(this) },
  // { buttonModel: { content: 'Cancel' }, click: this.dialogOverlay.bind(this) }];
  // // tslint:disable-next-line:member-ordering
  // public header = 'Special Characters';
  // // tslint:disable-next-line:member-ordering
  // public target: HTMLElement = document.getElementById('rteSection');
  // // tslint:disable-next-line:member-ordering
  // public height: any = '350px';

  // public onCreate(): void {
  //   const customBtn: HTMLElement = document.getElementById('custom_tbar') as HTMLElement;
  //   this.dialogObj.target = document.getElementById('rteSection');
  //   customBtn.onclick = (e: Event) => {
  //     this.rteObj.focusIn();
  //     this.ranges = this.selection.getRange(document);
  //     this.dialogObj.width = this.rteObj.element.offsetWidth * 0.5;
  //     // this.dialogObj.dataBind();
  //     this.dialogObj.show();
  //     this.dialogObj.element.style.maxHeight = 'none';
  //   };
  // }

  // public dialogCreate(): void {
  //   const dialogCtn: HTMLElement = document.getElementById('rteSpecial_char');
  //   dialogCtn.onclick = (e: Event) => {
  //     const target: HTMLElement = e.target as HTMLElement;
  //     const activeEle: Element = this.dialogObj.element.querySelector('.char_block.e-active');
  //     if (target.classList.contains('char_block')) {
  //       target.classList.add('e-active');
  //       if (activeEle) {
  //         activeEle.classList.remove('e-active');
  //       }
  //     }
  //   };
  // }

  // public onInsert(): void {
  //   const activeEle: Element = this.dialogObj.element.querySelector('.char_block.e-active');
  //   if (activeEle) {
  //     this.ranges.insertNode(document.createTextNode(activeEle.textContent));
  //   }
  //   this.dialogOverlay();
  // }

  // public dialogOverlay(): void {
  //   const activeEle: Element = this.dialogObj.element.querySelector('.char_block.e-active');
  //   if (activeEle) {
  //     activeEle.classList.remove('e-active');
  //   }
  //   this.dialogObj.hide();
  // }

}
