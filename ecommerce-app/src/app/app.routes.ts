import { Routes, RouterModule } from '@angular/router';
import {HeroComponent} from './components/hero/hero.component';
import {SobreNosotrosComponent} from './pages/sobre-nosotros/sobre-nosotros.component';
import { NgModule } from '@angular/core';
import {InicioComponent} from './pages/inicio/inicio.component';
import {CursesComponent} from './components/curses/curses.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {ContactoComponent} from './pages/contacto/contacto.component';



export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'sobrenosotros', component: SobreNosotrosComponent },
  {path: 'cursos', component: CursesComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'contacto', component: ContactoComponent},



  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
