# Setup Vite + React + JavaScript in npm

 Official reference guide - [click here](https://v3.vitejs.dev/guide/).

### Run this command in the terminal,
 This is where the **root** folder / directory of the project will be set (Vite will create the project's root directory later):

	npm init vite

### Fill in the follow up prompts in the terminal.

	# Type in the project-name:
	fcc-javascript-calculator-1.0

	# Choose a framework:
	React

	# Choose a variant:
	JavaScript + SWC

### After the initial setup...

 Run the following in the terminal:

	# Go inside the created project-root-directory.
	cd {project-name}

	# Install npm packages that comes with Vite
	npm install

	# Run vite development server. Start developing.
	npm run dev

### Start developing.

 The development files:
 - *Source codes* - like .js, .css, etc. go inside the **./src** folder.
 - *Static files* that are referenced within the source code, or hashed, go inside the **./src/assets** directory
 - The non code *static files* go to the **./public** folder.


# Git initial setup

 ### Create a new repository on the command line.

	# Within the project-root-directory, run the following in the terminal.
	git init
	git add README.md
	git commit -m "first commit"
	git branch -M master

	# The URL below is the created remote repository.
	git remote add origin https://github.com/{USER-NAME}/{REPO-NAME}.git

	# Store local files to remote repo
	git push -u origin master


 ### Or push an existing repository from the command line.

	git remote add origin https://github.con/{USER-NAME}/{REPO-NAME}.git
	git branch -M master
	git push -u origin master





# Using SASS

1. **Installed** SASS - reference [here](https://sass-lang.com/install/). Run this in the terminal:
	```
	# install as devDependency
	npm i --save-dev sass
	```
1. **Created** a sass file.
	```
	./src/styles/app.scss
	```
1. **Imported** the sass file to react.js. This will automatically compile to a *CSS* file.
	```
	import './styles/app.scss';
	```
1. **Partials**: Create *partials* with filenames beginning with *underscores* (_). The **@import** rule is used to share variables and styles among sass files. [Reference](https://www.freecodecamp.org/news/the-beginners-guide-to-sass/).
	```
	// import to './styles.scss' a partial file named '_partial.scss'

	@import './partial.scss';
	```




# Deploy to GitHub pages with Vite config
Full [reference](https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3).

1. Complete the web app's **development**.

1. **Preview** the build-output locally. Proceed to deploy when it runs to requirement.

1. **Deploy**. The project's github repository is needed.

- **Install** [gh-pages](https://www.npmjs.com/package/gh-pages) as devDependency. Run this on the terminal:
	```
	# devDependency
	npm i --save-dev gh-pages
	```

- **Update** *vite.config.js* file.  Add a base-URL (repo-name) as property-value within the **defineConfig({})**:
	```
	base: "/{repo-name}/"
	```

- **Update** *package.json* file with a *"homepage"* property:
	```
	"homepage": "https://{user-name}/github.io/{repo-name}/"
	```

- **Add** these two *"script"* properties in the *package.json* file. The *'dist'* in the *"deploy"* property-value is the build-output folder:
	```
	"scripts": {
		"predeploy": "npm run build",
		"deploy": "gh-pages -d dist",
		...
	}
	```

- **Deploy** the app. Run this on the terminal:
	```
	npm run deploy
	```

- **Configure** your project's remote GitHub repository:
	- Go to **Settings**.
	- Go to **Pages**.
	- Under **Build and deployment**:
		- set the **Source** to *Deploy from a branch*
		- set the **Branch** to *gh-pages* and */(root)*
	- Click **Save**.
