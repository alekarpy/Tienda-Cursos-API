// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    canActivate(): boolean {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:18',message:'AdminGuard canActivate iniciado',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        console.log('🔒 === ADMIN GUARD DEBUG ===');
        console.log('🔒 [AdminGuard] canActivate() → Verificando acceso a ruta de administración');
        console.log('1. Verificando autenticación...');

        // Primero verificar que esté autenticado
        const isLoggedIn = this.authService.isLoggedIn();
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:25',message:'Verificación de autenticación',data:{isLoggedIn},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        if (!isLoggedIn) {
            console.log('2. ❌ Usuario no autenticado - redirigiendo a login');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:28',message:'Acceso denegado - No autenticado',data:{redirectTo:'/login'},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            this.router.navigate(['/login']);
            return false;
        }

        console.log('2. ✅ Usuario autenticado');
        console.log('3. Verificando rol de administrador...');

        // Obtener el usuario actual
        const currentUser = this.authService.getCurrentUser() || this.userService.getCurrentUser();
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:37',message:'Usuario obtenido',data:{hasUser:!!currentUser,userId:currentUser?.id,userRole:currentUser?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        if (!currentUser) {
            console.log('4. ❌ No se pudo obtener información del usuario');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:42',message:'Acceso denegado - Usuario no encontrado',data:{redirectTo:'/login'},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            this.router.navigate(['/login']);
            return false;
        }

        console.log('4. Usuario actual:', currentUser);
        console.log('5. Rol del usuario:', currentUser.role);

        // Verificar que el rol sea 'admin'
        const isAdmin = currentUser.role === 'admin';
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:51',message:'Verificación de rol',data:{userRole:currentUser.role,isAdmin,requiredRole:'admin'},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        if (isAdmin) {
            console.log('6. ✅ Usuario es administrador - Acceso PERMITIDO');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:54',message:'Acceso permitido - Usuario es admin',data:{allowed:true},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return true;
        } else {
            console.log('6. ❌ Usuario NO es administrador - Acceso DENEGADO');
            console.log('7. Redirigiendo a página de inicio...');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin.guard.ts:59',message:'Acceso denegado - Usuario no es admin',data:{userRole:currentUser.role,redirectTo:'/inicio'},timestamp:Date.now(),sessionId:'debug-session',runId:'admin-guard-check',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            this.router.navigate(['/inicio']);
            return false;
        }
    }
}

