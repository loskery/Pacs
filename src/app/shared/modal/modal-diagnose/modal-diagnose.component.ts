import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Service, DiagnosticService, DiagnoseTemplate, Patient, Study } from '../../../core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarService, HtmlEditorService, RichTextEditorComponent } from '@syncfusion/ej2-ng-richtexteditor';
import { Button } from '@syncfusion/ej2-buttons';

@Component({
  selector: 'app-modal-diagnose',
  templateUrl: './modal-diagnose.component.html',
  styleUrls: ['./modal-diagnose.component.scss'],
  providers: [ToolbarService, HtmlEditorService]
})
export class ModalDiagnoseComponent implements OnInit, AfterViewInit {

  @Input() studyId: number;
  @Input() subNameOfService: string;
  @Input() study: Study;

  diagnoseForm: FormGroup;
  template: DiagnoseTemplate;
  templates: Array<DiagnoseTemplate>;
  concludeTemp: string;

  @ViewChild('toolsRTEModal') public rteObj: RichTextEditorComponent;
  placeholderRTE = 'Nhập kết quả chẩn đoán';

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

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public diagnosticService: DiagnosticService
  ) {
    this.createForm();
  }

  ngOnInit() {
    // this.rteObj.value = this.valueRTE;
    // this.rteObj.toolbarSettings = this.toolsRTE;
  }

  ngAfterViewInit() {
    const rteObj: RichTextEditorComponent = this.rteObj;

    // load template list
    this.getTemplates();
  }

  private createForm() {
    this.diagnoseForm = this.formBuilder.group({
      concludeTemp: ''
    });
  }

  getTemplates() {
    this.diagnosticService.getAllDiagnoseTemplates()
      .subscribe(
        list => this.templates = list
      );
  }

  getTemplate(id: number) {
    this.diagnosticService.getDiagnoseTemplate(id)
      .subscribe(
        data => {
          this.rteObj.value = data.data;
          this.concludeTemp = data.diagnoseResult;
          this.diagnoseForm.controls['concludeTemp'].setValue(this.concludeTemp);
        }
      );
  }

  onChangeTemplates(templateValue) {
    this.getTemplate(templateValue);
  }

  onDiagnose() {
    console.log('1');
  }
}
