# DTester
   | - config
   | - node_module
   | - dist
   | - src
        | - app                                                    // Main app folder
              | - core                                             // ??????? Do gather application-wide,    
                   | - core.module.ts                              // single use components in the CoreModule
                   | - nav                                         // import it once (in the AppModule) when the app starts
                        | - nav.component.ts|html|sass|spec.ts     // and never import it anywhere else. (e.g. NavComponent and 
                                                                   // SpinnerComponent).
              | - container-components
                   | - faculty
                        | - faculty.component.ts|html|sass|spec.ts
                        | - faculty.module.ts                      // ???????
                   | - subject
                        | - subject.component.ts|html|sass|spec.ts
                        | - subject.module.ts                      // ???????
                   | - student
                   | - ... other
              | - services
                   | - login.service.ts
                   | - ... other
              | - classes                                         // Here we'l define some feature of our class(e.g. student)
                   | - subject.ts
                   | - faculty.ts
                   | - student.ts
                   | - ... other                                        
              | - shared                                           // We want to make multiple instances of them and for these
                   | - shared.module.ts                            // to be available everywhere
                   | - init-caps.pipe.ts|spec.ts
                   | - text-filter.component.ts|spec.ts
                   | - text-filter.service.ts|spec.ts
              | - app.component.ts                                  // Root component for the app (e.g. AppComponent)
              | - app.component.html
              | - app.component.sass
        | - app.module.ts
        | - app-routing.module.ts
        | - main.ts                                                 // bootstrap here
        | - index.html                                              // Starting page
        | - assets
              | - img                                               // Images and icons for your app
              | - fonts
              | - libs                                              // Third-party libraries
              | - sass                                              // Mixins, variables etc. (SaSS files)
   | - README.md
   | - package.json
   | - tsconfig.json
   | - typings.json
   
   Style 02-5
      - Do put bootstrapping and platform logic for the app in a file named main.ts.
      
   Style 04-04 
      - Consider creating sub-folders when a folder reaches seven or more files.
      
   Style 04-06 
      - Do put all of the app's code in a folder named app.
      - Consider creating a folder for a component when is has multiple accompanying files (.ts, .html, .css and .spec).
         Why? Components often have four files (e.g. *.html, *.css, *.ts, and *.spec.ts) and can clutter a folder quickly.
   
   Style 04-07 
      - Do create folders named for the feature area they represent.
         *Why? A developer can locate the code, identify what each file represents at a glance, the structure is as flat as it  
         can be, and there is no repetitive nor redundant names.
      - Do create an Angular module for each feature area.
         *Why? Angular modules make it easier to isolate, test, and re-use features.
         
    Style 04-08
         Do create an Angular module at the root of the application.
         
    Style 04-09 
      - Do create an Angular module for all distinct features in an application (e.g. Heroes feature).
      - Do place the feature module in the same named folder as the feature area (.e.g app/heroes).
          *Why? A feature module can expose or hide its implementation from other modules.
          *Why? A feature module identifies distinct sets of related components that comprise the feature area.
          *Why? A feature module can easily be routed to both eagerly and lazily.
          *Why? A feature module can easily be isolated for testing.
          
    Style 04-10
      - Do create a feature module named SharedModule in a shared folder (e.g. app/shared/shared.module.ts defines 
        SharedModule).
      - Do put common components, directives and pipes that will be used throughout the application by other feature modules in 
        the SharedModule, where those assets are expected to share a new instance of themselves (not singletons).
      - Do import all modules required by the assets in the SharedModule (e.g. CommonModule and FormsModule).
        *Why? SharedModule will contain components, directives and pipes that may need features from another common module 
        (e.g.ngFor in CommonModule).
        
     Style 04-10
      - Do collect single-use classes and hiding their gory details inside CoreModule. A simplified root AppModule imports  
        CoreModule in its capacity as orchestrator of the application as a whole.
      - Do create a feature module named CoreModule in a core folder (e.g. app/core/core.module.ts defines CoreModule)
      - Do gather application-wide, single use components in the CoreModule. Import it once (in the AppModule) when the app 
        starts and never import it anywhere else. (e.g. NavComponent and SpinnerComponent).
        *Why? Real world apps can have several single-use components (e.g., spinners, message toasts, and modal dialogs) that 
        appear only in the AppComponent template. They are not imported elsewhere so they're not shared in that sense. Yet 
        they're too big and messy to leave loose in the root folder.
        #Avoid importing the CoreModule anywhere except in the AppModule.
        
     Style 04-10
      - Do extract templates and styles into a separate file, when more than 3 lines.
      
     Style 04-11
      - Do collect single-use classes and hiding their gory details inside CoreModule. A simplified root AppModule imports 
        CoreModule in its capacity as orchestrator of the application as a whole.
      - Do put a singleton service whose instance wil be shared throughout the application in the CoreModule (e.g. 
        ExceptionService and LoggerService).
      - Do gather application-wide, single use components in the CoreModule. Import it once (in the AppModule) when the app 
        starts and never import it anywhere else. (e.g. NavComponent and SpinnerComponent).
        *Why? Real world apps can have several single-use components (e.g., spinners, message toasts, and modal dialogs) that 
        appear only in the AppComponent template. They are not imported elsewhere so they're not shared in that sense. Yet 
        they're too big and messy to leave loose in the root folder.
        #Avoid importing the CoreModule anywhere except in the AppModule.

   
