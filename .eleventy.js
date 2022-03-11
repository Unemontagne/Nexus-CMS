const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const fs = require("fs");
const NOT_FOUND_PATH = "_site/404.html";

module.exports = function(eleventyConfig) {

  /* If you're NOT using Netlify as a hosting service, set to false */
  eleventyConfig.addGlobalData("onNetlify", true);

  /* If you plan to host the built files on an Apache server, 
     htaccess files are already prepared; 
     simply uncomment the two following lines: */

 // eleventyConfig.ignores.remove("_src/rt-htaccess.njk");
 // eleventyConfig.ignores.remove("_src/source/src-htaccess.njk");

  /* Markdown Plugin */
  let markdownIt = require("markdown-it");
  const md = new markdownIt({
    html: true
  });

  // Processed Collections
      eleventyConfig.addCollection("SitePages", function(apiCollection) {
        var pages = apiCollection.getAll()[0].data.pages
        var done = []
        var pgs = []
        if(pages){
          Object.values(pages).forEach(pg => {
                  if(pg.meta_filename && !done.includes(pg.meta_filename) && pg.content && pg.content.length){
                      done.push(pg.meta_filename)
                      pg.content = md.render(pg.content)
                      pgs.push(pg)
                  }
              })
        }
    
            return pgs
      });    

  eleventyConfig.addCollection("NxInstances", function(apiCollection) {
    var instances = apiCollection.getAll()[0].data.instances
    var done = []
    var insts = []
    if(instances){
      Object.values(instances).forEach(inst => {
              if(inst.meta_filename && !done.includes(inst.meta_filename) && inst.author && inst.author.handle && inst.author.url && inst.threads.length){
                  done.push(inst.meta_filename)
                  insts.push(inst)
              }
          })
    }

        return insts
  });

// Short Codes
  eleventyConfig.addShortcode("MediaUrl", function(media, host) {
    var url = ''
    if(media){
      if(media.slice(0,4) === "http"){
        url = media
      } else if(host) {
        if(media[0] !== "/"){
          media = "/"+media
        }
        if(host.slice(-1) === "/"){
            host = host.slice(0,-1)
        }
        url = host+media
      }
  }
  return url
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code, outputPath) {
    if (outputPath.indexOf(".json") < 0) {
    let minified = UglifyJS.minify(code);
    if (!minified.error) {
      return minified.code;
    }
    console.log("UglifyJS error: ", minified.error);
  }
  return code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Don't process folders with static assets
  eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");

  // 404 when run serve 
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }

          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    templateFormats: ["njk","html", "md", '11ty.js'], // add "liquid" if you wish
    pathPrefix: "/", // If your site lives in a different subdirectory, change this.
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_src/_includes",
      data: "_data",
      output: "_site"
    }
  };
};
