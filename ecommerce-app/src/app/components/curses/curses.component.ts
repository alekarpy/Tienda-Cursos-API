import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/cart.service';
import { Datos } from '../../../datos';
import { CartComponent } from '../../pages/cart/cart.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-curses',
  templateUrl: './curses.component.html',
  styleUrls: ['./curses.component.css'],

  standalone: true,
  imports: [CurrencyPipe, CommonModule, CartComponent],

})


export class CursesComponent implements OnInit, OnDestroy {
  mostrarCarrito: boolean = false;

  notificacionVisible = false;

  cursos: Datos[] = [];

  categoriaSeleccionada: string = 'Todos';
  loading: boolean = false;
  error: string | null = null;
  private productsSubscription?: Subscription;

  // Acceso al servicio de ProductService y de CarritoService (cartService)
  constructor(
    public productService: ProductService,
    public cartService: CarritoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'A',location:'curses.component.ts:ngOnInit',message:'CursesComponent ngOnInit ejecutado',data:{timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    await this.cargarCursos();
    
    // Suscribirse a cambios en los productos para actualizar automáticamente
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'C',location:'curses.component.ts:ngOnInit:beforeSubscribe',message:'Estableciendo suscripción a productsUpdated',data:{timestamp:Date.now()},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    this.productsSubscription = this.productService.productsUpdated.subscribe((updatedProducts) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'C',location:'curses.component.ts:ngOnInit:subscription',message:'Productos actualizados recibidos via observable',data:{updatedProductsLength:updatedProducts.length,firstProduct:updatedProducts[0]?.nombre,currentCursosLength:this.cursos.length,willUpdate:updatedProducts.length > 0},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      console.log('🔄 [CursesComponent] Productos actualizados automáticamente:', updatedProducts.length);
      // Ejecutar dentro de NgZone para asegurar que Angular detecte los cambios
      this.ngZone.run(() => {
        if (updatedProducts && updatedProducts.length > 0) {
          this.cursos = updatedProducts;
          // Forzar detección de cambios para asegurar que la vista se actualice
          this.cdr.detectChanges();
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'C',location:'curses.component.ts:ngOnInit:subscription:afterUpdate',message:'Cursos actualizados y detección de cambios forzada',data:{cursosLength:this.cursos.length,firstCourse:this.cursos[0]?.nombre},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
        }
      });
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'C',location:'curses.component.ts:ngOnInit:afterSubscribe',message:'Suscripción establecida',data:{hasSubscription:!!this.productsSubscription},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  ngOnDestroy() {
    // Limpiar suscripción al destruir el componente
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  private async cargarCursos() {
    this.loading = true;
    this.error = null;

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'A',location:'curses.component.ts:cargarCursos',message:'Iniciando carga de cursos',data:{cursosLength:this.cursos.length},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      console.log('📡 [CursesComponent] Cargando cursos desde API...');
      const cursosApi = await this.productService.traerProductosDesdeApi();
      this.cursos = cursosApi;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'refresh-issue',hypothesisId:'A',location:'curses.component.ts:cargarCursos',message:'Cursos cargados desde API',data:{cursosLength:this.cursos.length,firstCourse:this.cursos[0]?.nombre},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      console.log('📡 [CursesComponent] Cursos cargados:', this.cursos.length);
    } catch (error) {
      console.error('❌ [CursesComponent] Error al cargar cursos:', error);
      this.error = 'Error al cargar los cursos. Mostrando datos locales.';
      // Fallback: usar datos locales del servicio
      this.cursos = this.productService.getTodosLosDatos();
    } finally {
      this.loading = false;
    }
  }


  agregarAlCarrito(product: Datos): void {
    this.cartService.addToCart(product);
    this.mostrarCarrito = true; // Esto activará el modal
    this.mostrarNotificacion();
  }

  mostrarNotificacion() {
    this.notificacionVisible = true;
    setTimeout(() => {
      this.notificacionVisible = false;
    }, 3000); // 3 segundos
  }


  // Obtener categorías únicas de los cursos
  get categoriasUnicas(): string[] {
    const origen = this.cursos.length ? this.cursos : this.productService.getTodosLosDatos();
    const categorias = origen.map(curso => curso.categoria);
    return [...new Set(categorias)]; // Elimina duplicados
  }

  // Cursos filtrados por categoría seleccionada
  get cursosFiltrados(): Datos[] {
    const origen = this.cursos.length ? this.cursos : this.productService.getTodosLosDatos();
    if (this.categoriaSeleccionada === 'Todos') {
      return origen;
    }
    return origen.filter(curso => curso.categoria === this.categoriaSeleccionada);
  }





cerrarCarrito() {
  this.mostrarCarrito = false;
}


}

  /*  this.cursos = this.productService.datos; // O usar un observable si es async */











