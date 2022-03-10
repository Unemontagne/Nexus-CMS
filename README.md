# Nexus CMS

A one-click solution to create and auto-deploy Nexus instances... and markdown pages!  

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/I-is-as-I-does/Nexus-CMS"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>

> Under the hood, Nexus CMS makes use of **11ty** to generate files, and **Netlify CMS** for a user-friendly backend.  

/!\ THIS IS NOT COOKED YET.  
Auto deploy needs to be set up and some additionnal testing needs to be done.

## How-to

### Install

tbd

### Use

tbd

### Update

Nexus CMS might get new features, fixes and updates.  
By **forking** the original repository, keeping in sync is easy: 

- go to the [Nexus CMS repository](https://github.com/I-is-as-I-does/Nexus-CMS)
- select the `Fetch upstream` drop-down
- click `Fetch and merge`.

## Advanced How-to

### Sync with CLI

To keep your fork up-to-date, you can also resort to GitHub CLI.  
Use `gh repo sync` subcommand and supply your fork name as argument.  

`$ gh repo sync owner/cli-fork`

If the changes from the upstream repository cause conflict then the GitHub CLI can't sync.  
You can set the `-force` flag to overwrite the destination branch.

### Switch to Private

By default the created repository will be public.  
You can change it to private, but will need to regenerate your Netlify token.  
Go to your Netlify site dashboard, Settings > Identity > Services, click "Edit settings" then "Generate access token in GitHub".

### Run Locally

Clone the repository locally and run: `$ npm install`.  
In `admin/config.yml`: add `local_backend: true`.   

Then run 2 terminals in parallel:  
    - first: `$ npm run serve` or `$ npm run build`  
    - second: `$ npx netlify-cms-proxy-server`  

Go to `localhost:PORT` for website and `localhost:PORT/admin` for admin (PORT is usually 8080).

### Host anywhere
 
All built files are in the `_site/` folder.  
Drop the content of this folder anywhere you want.  

If you plan to host the built files on an Apache server: required `.htaccess` files are already prepared.  
Open `.eleventy.js` and simply uncomment the two indicated lines at the beginning of the config.  

### Make it yours

You can augment your 11ty site; add custom widgets to Netlify CMS; build your own Nexus app.

Nexus: [github.com/I-is-as-I-does/Nexus](https://github.com/I-is-as-I-does/Nexus)  
Eleventy: [github.com/11ty/eleventy/](https://github.com/11ty/eleventy/)  
Netlify CMS: [github.com/netlify/netlify-cms](https://github.com/netlify/netlify-cms)  

## Toss a coin to the dev

<a href='https://ko-fi.com/I2I17EOYP' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
