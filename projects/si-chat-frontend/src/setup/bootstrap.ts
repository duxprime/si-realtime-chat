import { registerServices } from './services';
import { registerRoutes } from './routes';
import { AuthenticationService } from 'domain/authentication'
import { UserService } from 'domain/user';
import { MessageService } from 'domain/message';
import type { Ctor } from 'utils/types';
import  type { ValueProvider } from 'injection-js';
import { type App } from 'vue';

export function bootstrap<T>(app: App<T>, services?: (Ctor | ValueProvider)[] ) {
    const { injector, serviceMap } = registerServices(app, services);
    registerRoutes(app);

    const authService: AuthenticationService = injector.get(AuthenticationService);
    const userService: UserService = injector.get(UserService);
    const messageService: MessageService = injector.get(MessageService);

    if(authService.authenticated){
        init();
    }
      
    authService.authenticated$.subscribe(() => init());

    function init(){
        messageService.init();
        userService.init();
    }
    
    return { 
        injector,
        serviceMap
    };
}
