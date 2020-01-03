import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Result } from '../common/result';
import { Observable } from 'rxjs';
import { httpOptions } from './http-option';

@Injectable()
export class RunResultService {
  constructor(private httpClient: HttpClient) {}

  deleteByRunsetId(id: string): Observable<Result> {
    return this.httpClient.delete<Result>('/runResult/' + id);
  }

  getRunsetById(id: string): Observable<Result> {
    return this.httpClient.get<Result>('/runResult/' + id);
  }

  getRunResultDetail(id: string): Observable<Result> {
    return this.httpClient.get<Result>('/runResult/cases/' + id);
  }

  getSubRundata(id: string): Observable<Result> {
    const url = '/runResult/cases/' + id + '/subcases';
    return this.httpClient.get<Result>(url);
  }

  getRundata(
    id: string,
    status: string,
    serviceName: string,
    pageNum: number = 1,
    pageSize: number = 0,
  ): Observable<Result> {
    const httpOption = {
      params: new HttpParams()
        .set('pageNum', pageNum.toString())
        .set('pageSize', pageSize.toString()),
    };
    if (status) {
      httpOption.params = httpOption.params.set('status', status);
    }
    const url = '/runResult/' + id + '/cases';
    if (serviceName) {
      httpOption.params = httpOption.params.append('serviceName', serviceName);
    }
    console.log(httpOption);
    return this.httpClient.get<Result>(url, httpOption);
  }

  getCompareRundata(
    id: string,
    compareId: string,
    originStatus: string,
    destinationStatus: string,
    pageNum: number = 1,
    pageSize: number = 0,
  ): Observable<Result> {
    const httpOption = {
      params: new HttpParams()
        .set('pageNum', pageNum.toString())
        .set('pageSize', pageSize.toString())
        .set('originStatus', originStatus)
        .set('destinationStatus', destinationStatus),
    };
    const url = '/runResult/comparedetail/' + id + '/' + compareId;
    return this.httpClient.get<Result>(url, httpOption);
  }

  getCompareRunResultStatistic(
    originId: string,
    destId: string,
  ): Observable<Result> {
    return this.httpClient.get<Result>(
      '/runResult/compare/' + originId + '/' + destId,
    );
  }

  hasSubRunSetList(id: string): Observable<Result> {
    return this.httpClient.get<Result>('/runResult/hasSubRunset/' + id);
  }

  getSubRunSetList(
    id: string,
    pageNum: number = 1,
    pageSize: number = 0,
  ): Observable<Result> {
    const httpOption = {
      params: new HttpParams()
        .set('pageNum', pageNum.toString())
        .set('pageSize', pageSize.toString()),
    };
    return this.httpClient.get<Result>(
      '/runResult/subRunset/' + id,
      httpOption,
    );
  }

  getRunSetList(pageNum: number = 1, pageSize: number = 0): Observable<Result> {
    const httpOption = {
      params: new HttpParams()
        .set('pageNum', pageNum.toString())
        .set('pageSize', pageSize.toString()),
    };
    return this.httpClient.get<Result>('/runResult', httpOption);
  }

  getRunSetListByTask(
    taskid: string,
    pageNum: number = 1,
    pageSize: number = 0,
  ): Observable<Result> {
    const httpOption = {
      params: new HttpParams()
        .set('pageNum', pageNum.toString())
        .set('pageSize', pageSize.toString()),
    };
    const url = `/runResult/task/${taskid}`;
    return this.httpClient.get<Result>(url, httpOption);
  }

  getRunResultStatistic(id: string): Observable<Result> {
    return this.httpClient.get<Result>('/runResult/' + id + '/statistic');
  }
}