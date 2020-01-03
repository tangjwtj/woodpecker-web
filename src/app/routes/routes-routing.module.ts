import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { SimpleGuard } from '@delon/auth';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';

// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    // canActivate: [SimpleGuard],
    children: [{
      path: 'config',
      loadChildren: 'app/routes/configuration/configuration.module#ConfigurationModule'
    },
    {
      path: 'run',
      loadChildren: 'app/routes/run/run.module#RunModule'
    },
    {
      path: 'case',
      loadChildren: 'app/routes/case/case.module#CaseModule'
    },
    {
      path: 'generate',
      loadChildren: 'app/routes/generate/generate.module#GenerateModule'
    },
    {
      path: 'dashboard',
      loadChildren: 'app/routes/dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'swagger',
      loadChildren: 'app/routes/swagger/swagger.module#SwaggerModule'
    },
    {
      path: '',
      redirectTo: 'dashboard', pathMatch: 'full'
    }
    // canActivate: [SimpleGuard],
    // children: [
    //   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    //   { path: 'dashboard', component: LayoutDefaultComponent, data: { title: '仪表盘' } },
    //   { path: 'exception', loadChildren: './exception/exception.module#ExceptionModule' },
    //   // 业务子模块
      // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
    ]
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } },
      { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        useHash: environment.useHash,
        // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
        // Pls refer to https://ng-alain.com/components/reuse-tab
        scrollPositionRestoration: 'top',
      }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
