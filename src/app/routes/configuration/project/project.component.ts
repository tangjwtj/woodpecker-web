import { Component, OnInit, TemplateRef } from '@angular/core';
import { STColumn } from '@delon/abc';
import { STPage } from '@delon/abc';
import { ProjectManageService } from '../../../services/project-manage.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'sn-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less'],
})
export class ProjectComponent implements OnInit {
  page: STPage = {
    show: true,
    showSize: true,
  };
  projects: Array<any> = [];
  projectTypes = ['COMMON', 'TESTNG'];
  columns: STColumn[] = [
    {
      title: 'id',
      index: 'id',
    },
    {
      title: 'name',
      index: 'name',
    },
    {
      title: 'svnPath',
      index: 'svnPath',
    },
    {
      title: 'username',
      index: 'username',
    },
    {
      title: 'type',
      index: 'type',
    },
    {
      title: 'description',
      index: 'description',
    },
    {
      title: 'operation',
      buttons: [
        {
          text: 'Edit',
          icon: 'edit',
          click: (record: any) => {
            this.getProject(record.id);
          },
        },
        {
          text: 'delete',
          icon: 'delete',
          type: 'del',
          click: record => {
            this.delete(record);
          },
        },
      ],
    },
  ];
  projectFG: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    svnPath: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    type: ['', Validators.required],
    description: [''],
  });
  isVisible = false;
  isOkLoading = false;

  constructor(
    private projectService: ProjectManageService,
    private message: NzMessageService,
    private modalSrv: NzModalService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.projectService.getProjectList().subscribe(data => {
      this.projects = data.data ? data.data : [];
    });
  }

  show() {
    this.projectFG.reset();
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
    this.projectFG.reset();
  }

  handleOk(value: any) {
    this.isOkLoading = true;
    this.projectService
      .add(value)
      .toPromise()
      .then(data => {
        if (data.status === 'STATUS_SUCCESS') {
          this.isOkLoading = false;
          this.ngOnInit();
          this.isVisible = false;
          this.message.success('添加/修改项目成功');
          this.ngOnInit();
        } else {
          this.isOkLoading = false;
          this.isVisible = true;
          this.message.error(data.message, {
            nzDuration: 5000,
          });
        }
      });
  }

  getProject(id: string) {
    this.projectFG.reset();
    this.projectService.getById(id).subscribe(data => {
      this.projectFG.setValue({
        id: data.data.id,
        name: data.data.name,
        svnPath: data.data.svnPath,
        username: data.data.username,
        password: data.data.password,
        type: data.data.type,
        description: data.data.description
          ? data.data.description
          : '',
      });
      this.isVisible = true;
    });
  }

  delete(record: any) {
    this.projectService.deleteById(record.id).subscribe(data => {
      if(data.status!=='STATUS_SUCCESS'){
        this.message.error(data.message);
      }else{
        this.ngOnInit();
        this.message.success(`成功删除【${record.name}】`);
      }
    });
  }

  addProject(tpl: TemplateRef<{}>) {
    let isOkLoading = false;
    this.modalSrv.create({
      nzTitle: '添加/修改项目',
      nzContent: tpl,
      nzOkLoading: isOkLoading,
      nzOkDisabled: !this.projectFG.valid,
      nzOnOk: () => {
        isOkLoading = true;
        return this.projectService.getById('1').toPromise();
      },
    });
  }
}
