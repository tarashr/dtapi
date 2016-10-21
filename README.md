DTester!
===================

In this file, we describe a variant of our structure. 
We also tried to give some explanation of the reasons for building such a structure

Structure
-------------

<ul>
    <li>config</li>
    <li>dist</li>
    <li>src
        <ul>
        <li>сomponents</li>
        <li>app  
                <ul>
                   <li>faculty
                                <ul>
                                    <li>faculty.component.ts|html|sass|spec.ts</li>
                                </ul>
                            </li>
                            <li>subject
                                <ul>
                                    <li>subject.component.ts|html|sass|spec.ts</li>
                                </ul>
                            </li>
                            <li>student</li>
                            <li> ... other</li>
                    <li>shared 
                        <ul>
                            <li>services
                        <ul>
                            <li>login.service.ts</li>
                            <li> ... other</li>
                        </ul>
                    </li>
                    <li>classes  
                        <ul>
                            <li>subject.ts</li>
                            <li>faculty.ts</li>
                            <li>student.ts</li>
                            <li>... other</li>
                        </ul>
                    </li>
                        </ul>
                    </li>
                    <li>app.component.ts 
                    <li>app.component.html</li>
                    <li>app.component.sass</li>
                </ul>
            </li>
            <li>assets
                <ul>
                    <li>img </li>
                    <li>fonts</li>
                    <li>libs</li>
                    <li>sass</li>
                </ul>
            </li>
            <li>app.module.ts</li>
            <li>vendor.ts</li>
            <li>app-routing.module.ts</li>
            <li>main.ts </li>
            <li>index.html </li>   
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

   
Basic rules for working with GITHUB Ropositories
================================================
This section explains the basic rules of work on our common project using
version control system GIT.

----------

This model envisages one central repository if069web.
Each developer clones main repository * origin *.
All members will take and send changes (* push & pull *) in the * origin *.
Also, each developer will be able to pick up changes from other team members
previously adding a remote repository

```
git remote add <namerepo> <url>

```

To remove the change from colleagues must enter the following command

```
git pull <namerepo> <branch>

```

The repository will contain two main branches

 **master**
>- main branch, the code in it will be in a state of production.
        We must push change in it only after each demo.
    
 **develop**
>- main branch for develop, will always contain the latest changes.


----------

#### Addition branch

- functionalities branch (feature)
- branch releases (demo)
- branch hotfix (hotfix)

Each branch has its own meaning and set of rules

----------

Functionalities branch (feature)
--------------------------------

>- are based on develop
```
    $ git checkout -b myfeature develop
    Switched to a new branch "myfeature"
```
>- at the end of work on the functionality merge into develop
```
    $ git checkout develop
    Switched to branch 'develop'
    $ git merge --no-ff myfeature
```
>- after the branch must be removed
   ```
   $ git branch -d myfeature
   Deleted branch myfeature (was 05e9557).
   $ git push origin develop
   ```
>- we must name it - all but master, develop, release, hotfix

----------
 
 Branch releases (demo)
-----------------------
  
 >- are based on develop
 ```
 $ git checkout -b demo-1 develop
 Switched to a new branch "demo-1"
```
>- merge into develop and master
>- name  - demo-*
>- created at the time of readiness branch develop to the new demo
>- after creating we must specify a new version of project
 ```
 $ git commit -a -m "Bumped version number to 1"
  ```
>- when the release branch is ready we merge it into master
  ```
 $ git checkout master
 Switched to branch 'master'
 $ git merge --no-ff demo-1
 Merge made by recursive.
 ```
>- create tag 
```
$ git tag -a 1
```
>- to save change in fathes release we must merge it into branche develop 
````
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff demo-1
Merge made by recursive.
````
>-  at the end we delete branch
````
$ git branch -d demo-1
Deleted branch demo-1 (was ff452fe).
````

----------

Branch hotfix (hotfix)
----------------------

>- are based on master
````
$ git checkout -b hotfix-1.2.1 master
Switched to a new branch "hotfix-1.2.1"
````
>- merge into develop and master
>- name hotfix-*
>- cens its existence is the work team of the branch development (develop) can safely continue
   while someone is preparing a fix production version.
>- after correcting merge it and create a master tag
````
$ git checkout master
Switched to branch 'master'
$ git merge --no-ff hotfix-1.2.1
$ git tag -a 1.2.1
````
>- transfer the corrections into develop
````
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff hotfix-1.2.1
Merge made by recursive.
````
>- remove branch
````
$ git branch -d hotfix-1.2.1
Deleted branch hotfix-1.2.1 (was abbe5d6).
````
