class NxSources {
  mediaData(thread, host){
   
    var media = {
      url: '',
      type: '',
      caption: ''
    }

    if(thread.content_media_url){    
      if(thread.content_media_url.slice(0,4) === "http"){
        media.url = thread.content_media_url
      } else if(host) {
        if(host.slice(-1) === "/"){
          host = host.slice(0,-1)
      }      
      var sl = ''  
        if(thread.content_media_url[0] !== "/"){
          sl = '/'
        }    
        media.url = host+sl+thread.content_media_url
      }
      if(media.url){
        media.type = thread.content_media_type ? thread.content_media_type : 'page'
        media.caption = thread.content_media_caption ? thread.content_media_caption : ''
      }
  }

  return media
  }
  data() {
    return {
      pagination: {
        data: "collections.NxInstances",
        size: 1,
        alias: "instance",
        resolve: "values"
      },
      eleventyComputed: {
        permalink: data => `source/${data.instance.meta_filename}.json`
      }
    };
  }
  render(data) {
    var threads = []
    for (var i = 0; i < data.instance.threads.length; i++) {
      threads.push({
        id: data.instance.threads[i].id,
        title: data.instance.threads[i].title,
        description: data.instance.threads[i].description ? data.instance.threads[i].description : '',
        content: {
          timestamp: data.instance.threads[i].content_timestamp,
          main: data.instance.threads[i].content_main,
          aside: data.instance.threads[i].content_aside ? data.instance.threads[i].content_aside : '',
          media: this.mediaData(data.instance.threads[i], data.settings._site.url),
        },
        linked: data.instance.threads[i].linked ? data.instance.threads[i].linked.map((l) => l.url) : [],
      })
    }
    return JSON.stringify({
      nexus: 'https://nexus-dock.github.io/',
      author: data.instance.author,
      threads: threads,
    })
  }
}
module.exports = NxSources;