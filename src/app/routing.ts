import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { NoIdentityGuard } from "./components/services/nologin";
import { UserGuard } from "./components/services/user.guard";

import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { InventoryComponent } from "./components/inventory/inventory.component";
import { ModalEbayComponent } from "./components/modal-ebay/modal-ebay.component";

const AppRoutes: Routes = [
    
    { path: 'inicio', component: HomeComponent },
    { path: 'register', canActivate: [NoIdentityGuard], component:RegisterComponent},
    { path: 'login',canActivate:[NoIdentityGuard], component: LoginComponent },
    { path: 'inventory',canActivate:[UserGuard] , component: InventoryComponent },
    { path: 'inventory/:page', canActivate: [UserGuard], component: InventoryComponent },
    { path: 'create-item', canActivate: [UserGuard], component: ModalEbayComponent },
    { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(AppRoutes);