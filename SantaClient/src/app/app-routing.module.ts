import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from './home/admin.guard';
import { AuthGuard } from './login/auth.guard';
import { ChildComponent } from './child/child.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
    },
    {
        path: 'home/add-child',
        component: RegisterComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard, AdminGuard],
        data: { redirectUrl: '/home' }
    },
    {
        path: 'home/children/:id',
        component: ChildComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        path: 'home/children/:id/map',
        component: MapComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard, AdminGuard]
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
