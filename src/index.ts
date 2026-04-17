import 'reflect-metadata';
import { App } from './presentation/http/App';
import { container } from './di/container';
 
const app = container.resolve(App)
app.listen();