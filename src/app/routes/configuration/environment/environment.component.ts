import { Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc';
import { STPage } from '@delon/abc';

import { EnvManageService } from '../../../services/env-manage.service';
import { ProjectManageService } from '../../../services/project-manage.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'sn-environment',
  templateUrl: './environment.component.html'
})
export class EnvironmentComponent implements OnInit {

  envs: Array<any> = [];
  projects: Array<any> = [];
  page: STPage = {
    show: true,
    showSize: true
  };
  columns: STColumn[] = [
    {
      title: 'id',
      index: 'id',
    },
    {
      title: 'projectName',
      index: 'projectName'
    },
    {
      title: 'name',
      index: 'name',
    },
    {
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
            this.getEnv(record.id)
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

  envFG: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    projectId: ['', Validators.required],
    description: ['']
  });
  isVisible = false;
  isOkLoading = false;

  constructor(
    private environmentService: EnvManageService,
    private projectService: ProjectManageService,
    private message: NzMessageService,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.environmentService.getEnvList().subscribe(data => {
      this.envs = data.data ? data.data : [];
    });
  }


  show() {
    this.getProjectList();
    this.envFG.reset();
    this.isVisible = true;
  }

  handleCancel(){
    this.isVisible = false;
    this.envFG.reset();
    // this.init();
    // this.serviceFG.reset();
  }

  handleOk(value: any){
    this.isOkLoading = true;
    this.environmentService.addOrModifyEnv(value).toPromise().then(data =>{
      if ( data.status == 'STATUS_SUCCESS' ) {
          this.isOkLoading = false;
          this.isVisible = false;
          this.envFG.reset();
          this.message.success('添加/修改环境成功');
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

  getEnv(id: string) {
    this.getProjectList();
    this.environmentService.getEnvById(id).subscribe(data => {
      if (data.data.length > 0) {
        this.envFG.setValue({
          id: data.data[0].id,
          name: data.data[0].name,
          projectId: data.data[0].projectId,
          description: data.data[0].description ? data.data[0].description : ''
        });
        this.isVisible = true;
      }
    });
  }


  getProjectList(){
    this.projectService.getProjectList().subscribe(data =>{
      this.projects = data.data;
    });
  }


  delete(record: any) {
    this.environmentService.deleteById(record.id).subscribe(data => {
      if(data.status!=='STATUS_SUCCESS'){
        this.message.error(data.message);
      }else{
        this.ngOnInit();
        this.message.success(`成功删除【${record.name}】`);
      }
    });
  }

}