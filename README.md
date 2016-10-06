DTester!
===================

In this file, we describe a variant of our structure. 
We also tried to give some explanation of the reasons for building such a structure

Structure
-------------

<ul>
    <li>config</li>
    <li>node_module</li>
    <li>dist</li>
    <li>src
        <ul>
        <li>app  ----------------------<i> //main app folder</i> 
                <ul>
                    <li>core 
                        <ul>
                            <li>core.module.ts</li> ------------------<i> //single use components in the CoreModule import it once (in the AppModule) when the app starts and never import it anywhere else. (e.g. NavComponent and SpinnerComponent).</i>
                            <li>nav
                                <ul> <li>nav.component.ts|html|sass|spec.ts</li> </ul>
                            </li>
                        </ul>
                    </li>
                    <li>container-components
                        <ul>
                            <li>faculty
                                <ul>
                                    <li>faculty.component.ts|html|sass|spec.ts</li>
                                    <li>faculty.module.ts  ------------------<i> // ???????</i></li>
                                </ul>
                            </li>
                            <li>subject
                                <ul>
                                    <li>subject.component.ts|html|sass|spec.ts</li>
                                    <li>subject.module.ts  --------------<i> // ???????</i></li>
                                </ul>
                            </li>
                            <li>student</li>
                            <li> ... other</li>
                        </ul>
                    </li>
                    <li>services
                        <ul>
                            <li>login.service.ts</li>
                            <li> ... other</li>
                        </ul>
                    </li>
                    <li>classes  --------------<i> // Here we'l define some feature of our class(e.g. student)</i>
                        <ul>
                            <li>subject.ts</li>
                            <li>faculty.ts</li>
                            <li>student.ts</li>
                            <li>... other</li>
                        </ul>
                    </li>
                    <li>shared --------<i> // We want to make multiple instances of them and for these to be available everywhere</i>
                        <ul>
                            <li>shared.module.ts </li>
                            <li>init-caps.pipe.ts|spec.ts</li>
                            <li>text-filter.component.ts|spec.ts</li>
                            <li>text-filter.service.ts|spec.ts</li>
                        </ul>
                    </li>
                    <li>app.component.ts -------- <i>// Root component for the app (e.g. AppComponent)</i></li>
                    <li>app.component.html</li>
                    <li>app.component.sass</li>
                </ul>
            </li>
            <li>assets
                <ul>
                    <li>img ---------------------<i>// Images and icons for your app</i></li>
                    <li>fonts</li>
                    <li>libs --------------------<i>// Third-party libraries</i></li>
                    <li>sass  -------------------<i>// Mixins, variables etc. (SaSS files)</i></li>
                </ul>
            </li>
            <li>app.module.ts</li>
            <li>vendor.ts</li>
            <li>app-routing.module.ts</li>
            <li>main.ts  ----------------------  <i>// bootstrap here</i></li>
            <li>index.html  -------------------  <i>// Starting page</i></li>   
        </ul>
    </li>
    <li>README.md</li>
    <li>package.json</li>
    <li>tsconfig.json</li>
    <li>typings.json</li>
</ul>

Explanation
-------------
                                                                           
#### Style 02-5
> Do put bootstrapping and platform logic for the app in a file named main.ts.
     
#### Style 04-04 
> Consider creating sub-folders when a folder reaches seven or more files.
      
#### Style 04-06 
> Do put all of the app's code in a folder named app.
> Consider creating a folder for a component when is has multiple accompanying files (.ts, .html, .css and .spec).
> - **Why?** Components often have four files (e.g. *.html, *.css, *.ts, and *.spec.ts) and can clutter a folder quickly.
   
#### Style 04-07 
> Do create folders named for the feature area they represent.
> - **Why?** A developer can locate the code, identify what each file represents at a glance, the structure is as flat as it

> Do create an Angular module for each feature area.
> - **Why?** Angular modules make it easier to isolate, test, and re-use features.
         
#### Style 04-08
> Do create an Angular module at the root of the application.
         
#### Style 04-09 
> Do create an Angular module for all distinct features in an application (e.g. Heroes feature).
> Do place the feature module in the same named folder as the feature area (.e.g app/heroes).
> - **Why?** A feature module can expose or hide its implementation from other modules.
> - **Why?** A feature module identifies distinct sets of related components that comprise the feature area.
> - **Why?** A feature module can easily be routed to both eagerly and lazily.
> - **Why?** A feature module can easily be isolated for testing.
          
#### Style 04-10
> Do create a feature module named SharedModule in a shared folder (e.g. app/shared/shared.module.ts defines 
        SharedModule).
> Do put common components, directives and pipes that will be used throughout the application by other feature modules in 
        the SharedModule, where those assets are expected to share a new instance of themselves (not singletons).
> Do import all modules required by the assets in the SharedModule (e.g. CommonModule and FormsModule).
> - **Why?** SharedModule will contain components, directives and pipes that may need features from another common module 
        (e.g.ngFor in CommonModule).
        
#### Style 04-10
> Do collect single-use classes and hiding their gory details inside CoreModule. A simplified root AppModule imports  
        CoreModule in its capacity as orchestrator of the application as a whole.
> Do create a feature module named CoreModule in a core folder (e.g. app/core/core.module.ts defines CoreModule)
> Do gather application-wide, single use components in the CoreModule. Import it once (in the AppModule) when the app 
        starts and never import it anywhere else. (e.g. NavComponent and SpinnerComponent).
> - **Why?** Real world apps can have several single-use components (e.g., spinners, message toasts, and modal dialogs) that 
        appear only in the AppComponent template. They are not imported elsewhere so they're not shared in that sense. Yet 
        they're too big and messy to leave loose in the root folder.
> - **Avoid** importing the CoreModule anywhere except in the AppModule.
        
#### Style 04-10
> Do extract templates and styles into a separate file, when more than 3 lines.
      
#### Style 04-11
> Do collect single-use classes and hiding their gory details inside CoreModule. A simplified root AppModule imports 
        CoreModule in its capacity as orchestrator of the application as a whole.
> Do put a singleton service whose instance wil be shared throughout the application in the CoreModule (e.g. 
        ExceptionService and LoggerService).
> Do gather application-wide, single use components in the CoreModule. Import it once (in the AppModule) when the app 
        starts and never import it anywhere else. (e.g. NavComponent and SpinnerComponent).
> - **Why?** Real world apps can have several single-use components (e.g., spinners, message toasts, and modal dialogs) that 
        appear only in the AppComponent template. They are not imported elsewhere so they're not shared in that sense. Yet 
        they're too big and messy to leave loose in the root folder.
> - **Avoid** importing the CoreModule anywhere except in the AppModule.

   
