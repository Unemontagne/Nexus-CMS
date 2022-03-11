class NxSources {
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
          media: {
            url: data.instance.threads[i].content_media_url ? data.instance.threads[i].content_media_url : '',
            type: data.instance.threads[i].content_media_type
              ? data.instance.threads[i].content_media_type
              : data.instance.threads[i].content_media_url ? 'page' : '',
            caption: data.instance.threads[i].content_media_caption
              ? data.instance.threads[i].content_media_caption
              : '',
          },
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