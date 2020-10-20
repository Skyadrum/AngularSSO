// Componentes tecnologicos
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEs from '@angular/common/locales/es-MX';
import { LOCALE_ID, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CaptchaModule } from 'primeng/captcha';
import { DropdownModule } from 'primeng/dropdown';
import { FocusTrapModule } from 'primeng/focustrap';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { SpinnerModule } from 'primeng/spinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TreeTableModule } from 'primeng/treetable';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { appInitializer } from './shared/helpers/app.initializer';
import { AccountService } from './shared/service/Account.service';

// Componentes framework
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { MenuBarComponent } from './shared/components/menubar/menubar.component';
import { SideBarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthGuard } from './shared/service/AuthGuard.service';
import { ErrorInterceptorService } from './shared/service/ErrorInterceptor.service';
import { JwtInterceptor } from './shared/service/JwtInterceptor.service';
registerLocaleData(localeEs);
// Componentes proyectos
import { CatalogoGeneroComponent } from './controlProduccion/components/catalogoGenero/catalogoGenero.component';
import { CatalogoClienteComponent } from './controlProduccion/components/catalogoCliente/catalogoCliente.component';
import { CatalogoEstatusTareaComponent } from './controlProduccion/components/catalogoEstatusTarea/catalogoEstatusTarea.component';
import { CatalogoTemplateComponent } from './controlProduccion/components/catalogoTemplate/catalogoTemplate.component';
import { CatalogoEstatusCtrlProd } from './controlProduccion/components/catalogoEstatusCtrlProd/catalogoEstatusCtrlProd.component';
import { CatalogoTiposTareaComponent } from './controlProduccion/components/catalogoTipoTarea/catalogoTiposTarea.component';
import { CatalogoEtapaComponent } from './controlProduccion/components/catalogoEtapa/catalogoEtapa.component';
import { CatalogoControlProduccionComponent } from './controlProduccion/components/catalogoControlProduccion/catalogoControlProduccion.component';
import { CatalogoUsuariosComponent } from './controlProduccion/components/catalogoUsuarios/catalogoUsuarios.component';
import { CatalogoPlaneacionTareasComponent } from './controlProduccion/components/catalogoPlaneacionTareas/catalogoPlaneacionTareas.component';
import { CatalogoColaboradorComponent } from './controlProduccion/components/catalogoColaborador/catalogoColaborador.component';
import { CatalogoProyectoComponent } from './controlProduccion/components/catalogoProyecto/catalogoProyecto.component';
import { CatalogoActividadesComponent } from './controlProduccion/components/catalogoActividades/catalogoActividades.component';
import { CatalogoAgrupadorTareasComponent } from './controlProduccion/components/catalogoAgrupadorTareas/catalogoAgrupadorTareas.component';
import { TransaccionalRealesComponent } from './controlProduccion/components/transaccionReales/transaccionReales.component';
import { CatalogoPlaneacionComponent } from './controlProduccion/components/catalogoPlaneacion/catalogoPlaneacion.component';
import { CatalogoSistemaComponent } from './sso/components/catalogoSistema/catalogoSistema.component';
import { CatalogoAmbientesComponent } from './sso/components/catalogoAmbientes/catalogoAmbiente.component';
import { CatalogoConexionesComponent } from './sso/components/catalogoConexiones/catalogoConexiones.component';
import { CatalogoParametrosComponent } from './sso/components/catalogoParametros/catalogoParametros.component';
import { CatalogoUsuariosComponentSSO } from './sso/components/catalogoUsuarios/catalogoUsuarios.component';
import { EncryptComponent } from './shared/components/encrypt/encrypt.component';
import { CatalogoTiposIncidenciaComponent } from './sso/components/catalogoTipoIncidencia/catalogoTipoIncidencia.component';
import { CatalogoIncidenciasComponent } from './sso/components/catalogoIncidencias/catalogoIncidencias.component';
import { CatalogoPantallasComponent } from './sso/components/catalogoPantallas/catalogoPantallas.component';
import { CatalogoParametroAmbienteComponent } from './sso/components/catalogoParametroAmbiente/catalogoParametroAmbiente.component';




const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'encrypt', component: EncryptComponent, canActivate: [AuthGuard] },
  { path: 'catalogoGenero', component: CatalogoGeneroComponent, canActivate: [AuthGuard] },
  { path: 'catalogoClientes', component: CatalogoClienteComponent, canActivate: [AuthGuard] },
  { path: 'catalogoEstatusTarea', component: CatalogoEstatusTareaComponent, canActivate: [AuthGuard] },
  { path: 'catalogoTemplate', component: CatalogoTemplateComponent, canActivate: [AuthGuard] },
  { path: 'catalogoEstatusCtrlProd', component: CatalogoEstatusCtrlProd, canActivate: [AuthGuard] },
  { path: 'catalogoTiposTarea', component: CatalogoTiposTareaComponent, canActivate: [AuthGuard] },
  { path: 'catalogoEtapas', component: CatalogoEtapaComponent, canActivate: [AuthGuard] },
  { path: 'catalogoControlProduccion', component: CatalogoControlProduccionComponent, canActivate: [AuthGuard] },
  { path: 'catalogoUsuarios', component: CatalogoUsuariosComponent, canActivate: [AuthGuard] },
  { path: 'catalogoPlaneacionTareas', component: CatalogoPlaneacionTareasComponent, canActivate: [AuthGuard] },
  { path: 'catalogoColaboradores', component: CatalogoColaboradorComponent, canActivate: [AuthGuard] },
  { path: 'catalogoUsuarios', component: CatalogoUsuariosComponent, canActivate: [AuthGuard] },
  { path: 'catalogoProyectos', component: CatalogoProyectoComponent, canActivate: [AuthGuard] },
  { path: 'catalogoActividades', component: CatalogoActividadesComponent, canActivate: [AuthGuard] },
  { path: 'catalogoAgrupadorTareas', component: CatalogoAgrupadorTareasComponent, canActivate: [AuthGuard] },
  { path: 'transaccionReales', component: TransaccionalRealesComponent, canActivate: [AuthGuard] },
  { path: 'catalogoPlaneacion', component: CatalogoPlaneacionComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoSistema', component: CatalogoSistemaComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoAmbientes', component: CatalogoAmbientesComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoConexion', component: CatalogoConexionesComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoParametros', component: CatalogoParametrosComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoUsuarios', component: CatalogoUsuariosComponentSSO, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoTiposIncidencias', component: CatalogoTiposIncidenciaComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoIncidencias', component: CatalogoIncidenciasComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoPantallas', component: CatalogoPantallasComponent, canActivate: [AuthGuard] },
  { path: 'SSOCatalogoParametroAmbiente', component: CatalogoParametroAmbienteComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    MenuBarComponent,
    LoginComponent,
    HomeComponent,
    EncryptComponent,
    CatalogoGeneroComponent,
    CatalogoClienteComponent,
    CatalogoEstatusTareaComponent,
    CatalogoTemplateComponent,
    CatalogoEstatusCtrlProd,
    CatalogoTiposTareaComponent,
    CatalogoEtapaComponent,
    CatalogoControlProduccionComponent,
    CatalogoUsuariosComponent,
    CatalogoPlaneacionTareasComponent,
    CatalogoColaboradorComponent,
    CatalogoProyectoComponent,
    CatalogoActividadesComponent,
    CatalogoAgrupadorTareasComponent,
    TransaccionalRealesComponent,
    CatalogoPlaneacionComponent,
    CatalogoSistemaComponent,
    CatalogoAmbientesComponent,
    CatalogoConexionesComponent,
    CatalogoParametrosComponent,
    CatalogoUsuariosComponentSSO,
    CatalogoTiposIncidenciaComponent,
    CatalogoIncidenciasComponent,
    CatalogoPantallasComponent,
    CatalogoParametroAmbienteComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    PanelModule,
    TableModule,
    PanelMenuModule,
    SidebarModule,
    DropdownModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    MenubarModule,
    HttpClientModule,
    CaptchaModule,
    ToastModule,
    FocusTrapModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    CheckboxModule,
    CalendarModule,
    SpinnerModule,
    InputTextareaModule,
    InputSwitchModule,
    SelectButtonModule,
    ClipboardModule,
    ReactiveFormsModule,
    TreeTableModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
