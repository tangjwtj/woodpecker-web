import { Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc';
import { STPage } from '@delon/abc';
import { SerManageService } from '../../../services/ser-manage.service';
import { ProjectManageService } from '../../../services/project-manage.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'sn-service',
  templateUrl: './service.component.html'
})
export class ServiceComponent implements OnInit {

  constructor(
    private serviceManage: SerManageService,
    private projectService: ProjectManageService,
    private message: NzMessageService,
    private fb: FormBuilder
    ) { }
  page: STPage = {
    show: true,
    showSize: true
  };
  serviceList: Array<any>;
  envs: Array<any> = [];
  projects: Array<any> = [];

  columns: STColumn[] = [{
    title: 'id',
    index: 'id'
  }, {
    title: 'projectName',
    index: 'projectName'
  },{
    title: 'name',
    index: 'name'
  },{
    title: 'description',
    index: 'description'
  },
  {
    title: 'operation',
    buttons: [
      {
        text: 'Edit',
        icon: 'edit',
        click: (record: any) =>{
          this.getService(record.id);
        }
      },
      {
        text: 'delete',
        icon: 'delete',
        type: 'del',
        click: (record) => {
          this.delete(record);
        }
      }
    ]
  }
  ];

  serviceFG: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    projectId: ['', Validators.required],
    configFile: ['', Validators.required],
    description: ['']
  });
  isVisible = false;
  isOkLoading = false;

  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项',
    },
    en: {
      required: 'Input is required',
    }
  };
  ngOnInit() {
    this.serviceManage.getServiceList().subscribe(data => {
      this.serviceList = data.data ? data.data : [];
    });
  }


  show() {
    this.getProjectList();
    this.serviceFG.reset();
    this.isVisible = true;
  }

  handleCancel(){
    this.isVisible = false;
    this.serviceFG.reset();
    // this.init();
  }

  handleOk(value: any){
    this.isOkLoading = true;
    this.serviceManage.addOrModify(value).toPromise().then(data =>{
      if ( data.status ===   'STATUS_SUCCESS' ) {
          this.isOkLoading = false;
          this.isVisible = false;
          this.serviceFG.reset();
          this.message.success('添加/修改服务成功');
          this.ngOnInit();
      } else {
        this.isOkLoading = false;
        this.isVisible = true;
        this.message.error(data.message, {
          nzDuration: 5000
        });
      }
    });
  }
  getService(id: string) {
    this.getProjectList();
    this.serviceFG.reset();
    this.serviceManage.getServiceById(id).subscribe(data => {
      if (data.data.length > 0) {
        this.serviceFG.setValue({
          id: data.data[0].id,
          name: data.data[0].name,
          projectId: data.data[0].projectId,
          configFile: data.data[0].configFile,
          description: data.data[0].description ? data.data[0].description : ''
        });
        this.isVisible = true;
      }
    });
  }


  getProjectList() {
    this.projectService.getProjectList().subscribe(data =>{
      this.projects = data.data;
    });
  }

  delete(record: any) {
    this.serviceManage.deleteById(record.id).subscribe(data => {
      if(data.status!=='STATUS_SUCCESS'){
        this.message.error(data.message);
      }else{
        this.ngOnInit();
        this.message.success(`成功删除【${record.name}】`);
      }
    });
  }

}
