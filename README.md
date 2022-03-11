# Nexus CMS

A free, 1 minute setup solution to create and auto-deploy Nexus instances... and markdown pages!  
Under the hood, Nexus CMS makes use of 11ty to generate files, and Netlify CMS for a user-friendly backend.  

<a target="_blank" href="https://app.netlify.com/start/deploy?repository=https://github.com/I-is-as-I-does/Nexus-CMS"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a>

Toss a coin to the dev:

<a href='https://ko-fi.com/I2I17EOYP' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

/!\ THIS IS NOT COOKED YET.  
Some additionnal testing needs to be done.

- [Install](#install)
  - [I'm an old dog](#im-an-old-dog)
  - [Step-by-step please](#step-by-step-please)
- [Use](#use)
- [Advanced](#advanced)
  - [Switch to Private](#switch-to-private)
  - [Run Locally](#run-locally)
  - [Host anywhere](#host-anywhere)
  - [Make it yours](#make-it-yours)
- [About Third Parties](#about-third-parties)
  - [Netlify](#netlify)
    - [How it works](#how-it-works)
    - [How it meshes with Nexus](#how-it-meshes-with-nexus)
  - [GitHub](#github)
    - [Storage limitations](#storage-limitations)
  - [Netlify CMS](#netlify-cms)
  - [11ty](#11ty)
  - [Markdown](#markdown)
- [About Nexus](#about-nexus)

## Install

It's super easy and should take less than 1min.

### I'm an old dog

- Click the `Deploy to Netlify` button and follow steps.
- In the Netlify site settings, setup `Netlify Identity`, `GitHub OAuth` and `Git Gateway`.
- Go to `http://your-site-name.netlify.app/admin`.

### Step-by-step please

If you're unfamiliar with GitHub or Netlify, [About Third Parties](#about-third-parties) is there for you.

- Click the `Deploy to Netlify` button.  
  You will be redirected to Netlify.

- Next, you'll be asked to connect to GitHub.   
  Create an account if you do not already have one.  
  When prompted, click `Authorize netlify`.

- Once you're back to the Netlify setup page, choose your repository name.  
  Click `Save and Deploy`.

- You should now see your Netlify site dashboard.  
  Go to `Site settings`. 

- In the `General` tab: change your site name (unless you fancy the random one!).  
  Your Nexus website will be accessible at `http://your-site-name.netlify.app`.
  > You can also set up a custom domain if you wish to, going to the the `Domain management` tab.

- Now, let's activate authentication.  
  In the `Identity` tab: click `Enable Identity`, then:
  - in the `Registration preferences` section: click `Edit settings` and select `Invite only`.
  - in the `External providers` section: click `Add provider` > `GitHub` > `Use default configuration`.
  - finally scroll down to the `Service` > `Git Gateway` section, and click `Enable Git Gateway`.	
  
- Go to `http://your-site-name.netlify.app/admin` and click `Login with Netlify Identity` if you're not automatically redirected.
- Go to `Settings` > `Site`, and in the `Url` field enter your newly created netlify domain `http://your-site-name.netlify.app`. Click `Publish` > `Publish now`, and you're done!
  > If you did setup a custom domain, enter your domain url instead.

## Use

tbd

## Advanced

### Switch to Private

By default the created repository will be public.  
You can change it to private, but will need to regenerate your Netlify token.  
- Go to your Netlify site dashboard,
- navigate to `Site settings` > `Identity` > `Services` > `Git Gateway`,
- click `Edit settings` and then `Generate access token in GitHub`.

### Run Locally

Clone the repository locally and run: `$ npm install`.  
In `admin/config.yml`: add `local_backend: true`.   

Then run 2 terminals in parallel:  
    - first: `$ npm run serve` or `$ npm run build`  
    - second: `$ npx netlify-cms-proxy-server`  

Go to `localhost:PORT` for website and `localhost:PORT/admin` for admin (PORT is usually 8080).

### Host anywhere

If you use Nexus CMS locally, you're not bound to Netlify hosting services.   
All built files are in the `_site/` folder.  
Drop the content of this folder anywhere you want.  

If you plan to host the built files on an Apache server: required `.htaccess` files are already prepared.  
Open `.eleventy.js` and simply uncomment the two indicated lines at the beginning of the config.  

### Make it yours

You can augment your [11ty](https://github.com/11ty/eleventy/) site; add custom widgets to [Netlify CMS](https://github.com/netlify/netlify-cms); build your own [Nexus](https://github.com/I-is-as-I-does/Nexus) app.

## About Third Parties

### Netlify

Netlify is a **web hosting** and **automation** platform.  
Their free tier is perfectly fine for a Nexus CMS website.

#### How it works

- Netlify connects to a repository containing source code,
- runs a build process to pre-render files each time content gets updated,
- then distributes the optimized files on a Content Delivery Network.

> **Content Delivery Network**  
> A CDN is a geographically distributed network of proxy servers.  
Your website will be served from the closest server to each visitor.  
     
#### How it meshes with Nexus 

Since the whole principle of Nexus is to connect your content to other live, self-hosted Nexus instances, the Nexus part of the page is still built on-the-fly, and not pre-rendered.  
The focus of Nexus CMS is more on the *self-hosted* matter. This solution offers a simple, seamless way to create, edit and **auto-deploy** Nexus instances.  
For efficiency, Nexus apps that take care of this on-the-fly rendering are also hosted on a Content Delivery Network, and make use of the browser cache.

### GitHub

GitHub is a **repository hosting service** that provides a web-based graphical interface.  
Their free tier is extremely generous with unlimited public and private repositories.

This is where your source files will be stored.

#### Storage limitations

- Your repository should not exceed **1GB** in size.  
- Each file must not exceed 25MB; this limit is stretched to 50MB if you're using git commands.  
- Since Nexus CMS generates a website, it is actually recommended that your media do not exceed 2MB for video and audio files, 500KB for images. Nexus CMS implements those limits.
    
You are still free to store your media files on another server or platform, as long as you can provide a working direct access url.  
YouTube, Vimeo and Soundcloud urls are also supported.

### Netlify CMS

tbd

### 11ty

tbd

### Markdown

tbd

## About Nexus

tbd